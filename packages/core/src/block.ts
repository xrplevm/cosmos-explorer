import type { TransactionSummary } from './transaction';

export interface Block {
  height: number;
  hash: string;
  txs: number;
  timestamp: string;
  proposer: string;
  proposerMoniker: string | null;
  proposerAvatarUrl: string | null;
}

export interface BlockDetail {
  overview: Block;
  signatures: string[];
  transactions: TransactionSummary[];
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
}

export interface IBlockService {
  getLatestBlock(): Promise<Block | null>;
  getLatestBlocks(limit: number): Promise<Block[]>;
  getBlocks(params?: { limit?: number; offset?: number }): Promise<PaginatedResult<Block>>;
  getBlockByHeight(height: number): Promise<BlockDetail | null>;
}
