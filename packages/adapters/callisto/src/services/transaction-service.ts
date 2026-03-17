import { type ITransactionService, type TransactionSummary } from '@cosmos-explorer/core';
import { type Fetcher } from '@cosmos-explorer/utils';

import { mapTransactions } from '../home-mappers';
import { LATEST_TRANSACTIONS_QUERY } from '../home-queries';
import type { LatestTransactionsResponse } from '../home-types';

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
