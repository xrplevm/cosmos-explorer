import {
  type ConsensusBlock,
  type ConsensusValidatorVote,
  type IConsensusService,
} from "@cosmos-explorer/core";
import { type Fetcher, resolveKeybaseAvatars } from "@cosmos-explorer/utils";

import {
  mapConsensusBlocks,
  type RawConsensusBlock,
  type RawConsensusVote,
} from "../mappers";
import { CONSENSUS_BLOCKS_QUERY, CONSENSUS_VALIDATOR_CONTEXT_QUERY } from "../queries";
import type { ConsensusBlocksResponse, ConsensusValidatorContextResponse } from "../types";

async function finalizeBlocks(
  blocks: RawConsensusBlock[],
  signedBlocksWindow: number | null,
): Promise<ConsensusBlock[]> {
  // One cached batch resolve for every validator across the window.
  const identities: (string | null)[] = [];
  for (const block of blocks) {
    identities.push(block.proposer._identity);
    for (const vote of block.votes) identities.push(vote._identity);
    for (const vote of block.missed) identities.push(vote._identity);
  }
  const avatarMap = await resolveKeybaseAvatars(identities);

  const avatarFor = (identity: string | null): string | null =>
    identity ? (avatarMap.get(identity) ?? null) : null;

  // Signing uptime over the slashing window: (window − missed) / window.
  const uptimeFor = (missed: number | null): number | null => {
    if (missed == null || signedBlocksWindow == null) return null;
    const pct = ((signedBlocksWindow - missed) / signedBlocksWindow) * 100;
    return Math.max(0, Math.min(100, pct));
  };

  const finalizeVote = (vote: RawConsensusVote): ConsensusValidatorVote => {
    const { _identity, _missedBlocks, ...rest } = vote;
    return {
      ...rest,
      avatarUrl: avatarFor(_identity),
      uptimePercent: uptimeFor(_missedBlocks),
    };
  };

  return blocks.map((block) => {
    const { _identity, ...proposer } = block.proposer;
    return {
      ...block,
      proposer: { ...proposer, avatarUrl: avatarFor(_identity) },
      votes: block.votes.map(finalizeVote),
      missed: block.missed.map(finalizeVote),
    };
  });
}

// Module-scoped, not an instance field: the app layer recreates the service
// on every request, so an instance field would never actually cache anything.
const VALIDATOR_CONTEXT_TTL_MS = 15_000;
let cachedValidatorContext:
  | { expiresAt: number; promise: Promise<ConsensusValidatorContextResponse> }
  | null = null;

export class CallistoConsensusService implements IConsensusService {
  constructor(private readonly fetcher: Fetcher) {}

  private getValidatorContext(): Promise<ConsensusValidatorContextResponse> {
    const now = Date.now();
    if (cachedValidatorContext && cachedValidatorContext.expiresAt > now) {
      return cachedValidatorContext.promise;
    }

    const promise = this.fetcher.graphql<ConsensusValidatorContextResponse>({
      query: CONSENSUS_VALIDATOR_CONTEXT_QUERY,
      operationName: "ConsensusValidatorContext",
    });
    cachedValidatorContext = { expiresAt: now + VALIDATOR_CONTEXT_TTL_MS, promise };
    promise.catch(() => {
      cachedValidatorContext = null;
    });
    return promise;
  }

  async getRecentConsensus(limit: number): Promise<ConsensusBlock[]> {
    // The chain tip has no precommits yet (they're only indexed with the next
    // block's LastCommit), so fetch one extra and drop the newest.
    const [blocksResponse, validatorContext] = await Promise.all([
      this.fetcher.graphql<ConsensusBlocksResponse, { limit: number }>({
        query: CONSENSUS_BLOCKS_QUERY,
        variables: { limit: limit + 1 },
        operationName: "ConsensusBlocks",
      }),
      this.getValidatorContext(),
    ]);

    const rawWindow =
      validatorContext.slashingParams?.[0]?.params?.signed_blocks_window;
    const window = rawWindow != null ? Number(rawWindow) : NaN;
    const signedBlocksWindow =
      Number.isFinite(window) && window > 0 ? window : null;

    const withoutTip = {
      block: blocksResponse.block.slice(1),
      validators: validatorContext.validators,
    };
    return finalizeBlocks(mapConsensusBlocks(withoutTip), signedBlocksWindow);
  }
}
