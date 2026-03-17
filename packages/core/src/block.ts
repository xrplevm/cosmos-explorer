import type { TransactionSummary } from './transaction';

export type Block = {
  height: number;
  hash: string;
  txs: number;
  timestamp: string;
  proposer: string;
};

export type BlockDetail = {
  overview: Block;
  signatures: string[];
  transactions: TransactionSummary[];
};

export interface IBlockService {
  getLatestBlock(): Promise<Block | null>;
  getLatestBlocks(limit: number): Promise<Block[]>;
  getBlocks(params?: { limit?: number; offset?: number }): Promise<Block[]>;
  getBlockByHeight(height: number): Promise<BlockDetail | null>;
}
