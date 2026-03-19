export interface Message {
  type: string;
  value: unknown;
}

export interface TransactionSummary {
  hash: string;
  height: number;
  type: string;
  success: boolean;
  timestamp: string;
  messageCount: number;
}

export interface TransactionDetail {
  hash: string;
  height: number;
  timestamp: string;
  fee: unknown;
  gasUsed: number;
  gasWanted: number;
  success: boolean;
  memo: string;
  error: string;
  messages: Message[];
  logs: unknown;
}

import type { PaginatedResult } from './block';

export interface ITransactionService {
  getLatestTransactions(limit: number): Promise<TransactionSummary[]>;
  getTransactions(params?: { limit?: number; offset?: number }): Promise<PaginatedResult<TransactionSummary>>;
  getTransactionsByBlock(height: number): Promise<TransactionSummary[]>;
  getTransactionByHash(hash: string): Promise<TransactionDetail | null>;
}
