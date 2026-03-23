import type { Block } from './block';
import type { Price } from './price';
import type { ValidatorCount } from './validator';

export interface ChainStats {
  latestBlock: Block | null;
  averageBlockTime: number | null;
  price: Price | null;
  validators: ValidatorCount;
}

export interface DailyStats {
  date: string;
  transactions: number;
}

export interface IChainStatsService {
  getChainStats(input: { priceDenom: string }): Promise<ChainStats>;
  getDailyStats(): Promise<DailyStats[]>;
}
