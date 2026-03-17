import { type ITransactionService, type TransactionSummary } from '@cosmos-explorer/core';
import { type Fetcher } from '@cosmos-explorer/utils';

import { mapTransactionDetail, mapTransactions } from '../mappers';
import {
  LATEST_TRANSACTIONS_QUERY,
  TRANSACTION_DETAILS_QUERY,
  TRANSACTIONS_BY_BLOCK_QUERY,
  TRANSACTIONS_QUERY,
} from '../queries';
import type {
  LatestTransactionsResponse,
  TransactionDetailsResponse,
} from '../types';

export class CallistoTransactionService implements ITransactionService {
  constructor(private readonly fetcher: Fetcher) {}

  async getLatestTransactions(limit: number): Promise<TransactionSummary[]> {
    const response = await this.fetcher.graphql<LatestTransactionsResponse, { limit: number }>({
      query: LATEST_TRANSACTIONS_QUERY,
      variables: { limit },
      operationName: 'LatestTransactions',
    });

    return mapTransactions(response);
  }

  async getTransactions(params?: {
    limit?: number;
    offset?: number;
  }): Promise<TransactionSummary[]> {
    const response = await this.fetcher.graphql<
      LatestTransactionsResponse,
      { limit: number; offset: number }
    >({
      query: TRANSACTIONS_QUERY,
      variables: {
        limit: params?.limit ?? 50,
        offset: params?.offset ?? 0,
      },
      operationName: 'Transactions',
    });

    return mapTransactions(response);
  }

  async getTransactionsByBlock(height: number) {
    const response = await this.fetcher.graphql<
      LatestTransactionsResponse,
      { height: number }
    >({
      query: TRANSACTIONS_BY_BLOCK_QUERY,
      variables: { height },
      operationName: 'TransactionsByBlock',
    });

    return mapTransactions(response);
  }

  async getTransactionByHash(hash: string) {
    const response = await this.fetcher.graphql<
      TransactionDetailsResponse,
      { hash: string }
    >({
      query: TRANSACTION_DETAILS_QUERY,
      variables: { hash },
      operationName: 'TransactionDetails',
    });

    return mapTransactionDetail(response);
  }
}
