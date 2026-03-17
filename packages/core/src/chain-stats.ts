import type { Block } from './block.js';
import type { Price } from './price.js';
import type { ValidatorCount } from './validator.js';

export type ChainStats = {
  latestBlock: Block | null;
  averageBlockTime: number | null;
  price: Price | null;
  validators: ValidatorCount;
};

export interface IChainStatsService {
  getChainStats(input: { priceDenom: string }): Promise<ChainStats>;
}
