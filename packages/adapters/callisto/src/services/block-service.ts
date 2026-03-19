import { type Block, type IBlockService, type PaginatedResult } from '@cosmos-explorer/core';
import { type Fetcher, resolveKeybaseAvatars } from '@cosmos-explorer/utils';

import { mapBlockDetail, mapBlocks, type RawBlock } from '../mappers';
import { BLOCK_DETAILS_QUERY, BLOCKS_QUERY, LATEST_BLOCKS_QUERY } from '../queries';
import type { BlockDetailsResponse, BlocksWithCountResponse, LatestBlocksResponse } from '../types';

async function resolveAvatars(rawBlocks: RawBlock[]): Promise<Block[]> {
  const identities = rawBlocks.map((b) => b._identity);
  const avatarMap = await resolveKeybaseAvatars(identities);

  return rawBlocks.map(({ _identity, ...block }) => ({
    ...block,
    proposerAvatarUrl: _identity ? avatarMap.get(_identity) ?? null : null,
  }));
}

export class CallistoBlockService implements IBlockService {
  constructor(private readonly fetcher: Fetcher) {}

  async getLatestBlock(): Promise<Block | null> {
    const blocks = await this.getLatestBlocks(1);
    return blocks[0] ?? null;
  }

  async getLatestBlocks(limit: number): Promise<Block[]> {
    const response = await this.fetcher.graphql<LatestBlocksResponse, { limit: number }>({
      query: LATEST_BLOCKS_QUERY,
      variables: { limit },
      operationName: 'LatestBlocks',
    });

    return resolveAvatars(mapBlocks(response));
  }

  async getBlocks(params?: { limit?: number; offset?: number }): Promise<PaginatedResult<Block>> {
    const response = await this.fetcher.graphql<
      BlocksWithCountResponse,
      { limit: number; offset: number }
    >({
      query: BLOCKS_QUERY,
      variables: {
        limit: params?.limit ?? 50,
        offset: params?.offset ?? 0,
      },
      operationName: 'Blocks',
    });

    const items = await resolveAvatars(mapBlocks(response));
    const total = response.total.aggregate?.count ?? 0;

    return { items, total };
  }

  async getBlockByHeight(height: number) {
    const response = await this.fetcher.graphql<
      BlockDetailsResponse,
      { height: number; signatureHeight: number }
    >({
      query: BLOCK_DETAILS_QUERY,
      variables: {
        height,
        signatureHeight: height + 1,
      },
      operationName: 'BlockDetails',
    });

    return mapBlockDetail(response);
  }
}
