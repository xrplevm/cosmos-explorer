import { type Block, type IBlockService } from '@cosmos-explorer/core';
import { type Fetcher } from '@cosmos-explorer/utils';

import { LATEST_BLOCKS_QUERY } from '../home-queries.js';
import { mapBlocks } from '../home-mappers.js';
import type { LatestBlocksResponse } from '../home-types.js';

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
}
