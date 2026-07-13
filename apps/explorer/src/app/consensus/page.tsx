import type { Metadata } from "next";
import type { ConsensusBlock } from "@cosmos-explorer/core";
import { getServices } from "@/lib/services";
import { getChainConfig } from "@/lib/config";
import { buildPageMetadata } from "@/lib/metadata";
import { ConsensusMatrix } from "@/components/consensus-matrix";
import { RECENT_BLOCK_COUNT } from "./constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "Consensus",
  description:
    "Recent blocks with their proposer and each validator's precommit time on the XRPL EVM Sidechain.",
  path: "/consensus",
});

export default async function ConsensusPage() {
  const { consensusService } = getServices();

  let blocks: ConsensusBlock[] | null;
  try {
    blocks = await consensusService.getRecentConsensus(RECENT_BLOCK_COUNT);
  } catch {
    blocks = null;
  }

  if (blocks == null) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-destructive">
        Couldn&apos;t load consensus data. Please try again later.
      </div>
    );
  }

  if (blocks.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        No blocks found.
      </div>
    );
  }

  const graphqlWs = getChainConfig().network.endpoints.graphqlWs;

  return (
    <ConsensusMatrix
      initialBlocks={blocks}
      pollCount={RECENT_BLOCK_COUNT}
      graphqlWs={graphqlWs}
    />
  );
}
