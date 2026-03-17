import {
  type ChainStats,
  type IBlockService,
  type IChainStatsService,
  type IPriceService,
  type IValidatorService,
} from '@cosmos-explorer/core';
import { type Fetcher } from '@cosmos-explorer/utils';

import { mapAverageBlockTime } from '../home-mappers.js';
import { AVERAGE_BLOCK_TIME_QUERY } from '../home-queries.js';
import type { AverageBlockTimeResponse } from '../home-types.js';

export class CallistoChainStatsService implements IChainStatsService {
  constructor(
    private readonly fetcher: Fetcher,
    private readonly blockService: IBlockService,
    private readonly priceService: IPriceService,
    private readonly validatorService: IValidatorService
  ) {}

  async getChainStats(input: { priceDenom: string }): Promise<ChainStats> {
    const [latestBlock, averageBlockTime, price, validators] = await Promise.all([
      this.blockService.getLatestBlock(),
      this.getAverageBlockTime(),
      this.priceService.getCurrentPrice(input.priceDenom),
      this.validatorService.getValidatorCount(),
    ]);

    return {
      latestBlock,
      averageBlockTime,
      price,
      validators,
    };
  }

  private async getAverageBlockTime(): Promise<number | null> {
    const response = await this.fetcher.graphql<AverageBlockTimeResponse>({
      query: AVERAGE_BLOCK_TIME_QUERY,
      operationName: 'AverageBlockTime',
    });

    return mapAverageBlockTime(response);
  }
}
