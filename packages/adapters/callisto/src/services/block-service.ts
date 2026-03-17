import { type Block, type IBlockService } from '@cosmos-explorer/core';
import { type Fetcher } from '@cosmos-explorer/utils';

import { mapBlockDetail, mapBlocks } from '../mappers';
import { BLOCK_DETAILS_QUERY, BLOCKS_QUERY, LATEST_BLOCKS_QUERY } from '../queries';
import type { BlockDetailsResponse, LatestBlocksResponse } from '../types';

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

    return mapBlocks(response);
  }

  async getBlocks(params?: { limit?: number; offset?: number }): Promise<Block[]> {
    const response = await this.fetcher.graphql<
      LatestBlocksResponse,
      { limit: number; offset: number }
    >({
      query: BLOCKS_QUERY,
      variables: {
        limit: params?.limit ?? 50,
        offset: params?.offset ?? 0,
      },
      operationName: 'Blocks',
    });

    return mapBlocks(response);
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
