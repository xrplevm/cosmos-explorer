import type { Block } from './block';
import type { Price } from './price';
import type { ValidatorCount } from './validator';

export type ChainStats = {
  latestBlock: Block | null;
  averageBlockTime: number | null;
  price: Price | null;
  validators: ValidatorCount;
};

export interface IChainStatsService {
  getChainStats(input: { priceDenom: string }): Promise<ChainStats>;
}
