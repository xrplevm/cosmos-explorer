import { type ITransactionService, type TransactionSummary } from '@cosmos-explorer/core';
import { type Fetcher } from '@cosmos-explorer/utils';

import { mapTransactions } from '../home-mappers.js';
import { LATEST_TRANSACTIONS_QUERY } from '../home-queries.js';
import type { LatestTransactionsResponse } from '../home-types.js';

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
}
