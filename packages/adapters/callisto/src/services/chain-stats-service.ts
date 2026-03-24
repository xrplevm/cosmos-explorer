import {
  type ChainStats,
  type DailyStats,
  type IBlockService,
  type IChainStatsService,
  type IValidatorService,
} from '@cosmos-explorer/core';
import { type Fetcher } from '@cosmos-explorer/utils';

import { mapAverageBlockTime } from '../mappers';
import { AVERAGE_BLOCK_TIME_QUERY, buildDailyStatsQuery } from '../queries';
import type { AverageBlockTimeResponse, DailyStatsResponse } from '../types';

export class CallistoChainStatsService implements IChainStatsService {
  constructor(
    private readonly fetcher: Fetcher,
    private readonly blockService: IBlockService,
    private readonly validatorService: IValidatorService
  ) {}

  async getChainStats(_input: { priceDenom: string }): Promise<ChainStats> {
    const [latestBlockResult, averageBlockTimeResult, validatorsResult] =
      await Promise.allSettled([
        this.blockService.getLatestBlock(),
        this.getAverageBlockTime(),
        this.validatorService.getValidatorCount(),
      ]);

    return {
      latestBlock:
        latestBlockResult.status === 'fulfilled' ? latestBlockResult.value : null,
      averageBlockTime:
        averageBlockTimeResult.status === 'fulfilled'
          ? averageBlockTimeResult.value
          : null,
      price: null,
      validators:
        validatorsResult.status === 'fulfilled'
          ? validatorsResult.value
          : { active: 0, total: 0 },
    };
  }

  async getDailyStats(): Promise<DailyStats[]> {
    const query = buildDailyStatsQuery();
    const response = await this.fetcher.graphql<DailyStatsResponse>({
      query,
      operationName: 'DailyStats',
    });

    const now = new Date();
    const result: DailyStats[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setUTCDate(date.getUTCDate() - i);
      date.setUTCHours(0, 0, 0, 0);

      const dayData = response[`day_${i}`];
      result.push({
        date: date.toISOString().slice(0, 10),
        transactions: dayData?.aggregate?.sum?.num_txs ?? 0,
      });
    }

    return result;
  }

  private async getAverageBlockTime(): Promise<number | null> {
    const response = await this.fetcher.graphql<AverageBlockTimeResponse>({
      query: AVERAGE_BLOCK_TIME_QUERY,
      operationName: 'AverageBlockTime',
    });

    return mapAverageBlockTime(response);
  }
}
