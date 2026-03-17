import {
  type IPriceService,
  type MarketSummary,
  type Price,
  type PricePoint,
} from '@cosmos-explorer/core';
import { type Fetcher } from '@cosmos-explorer/utils';

import { mapMarketSummary, mapPrice, mapPriceHistory } from './mappers';
import {
  CURRENT_PRICE_QUERY,
  MARKET_SUMMARY_QUERY,
  PRICE_HISTORY_QUERY,
} from './queries';
import type {
  CurrentPriceResponse,
  MarketSummaryResponse,
  PriceHistoryResponse,
} from './types';

export class PriceService implements IPriceService {
  constructor(private readonly fetcher: Fetcher) {}

  async getCurrentPrice(denom: string): Promise<Price | null> {
    const response = await this.fetcher.graphql<CurrentPriceResponse, { denom: string }>({
      query: CURRENT_PRICE_QUERY,
      variables: { denom },
      operationName: 'CurrentPrice',
    });

    return mapPrice(response, denom);
  }

  async getPriceHistory(
    denom: string,
    params?: { limit?: number }
  ): Promise<PricePoint[]> {
    const response = await this.fetcher.graphql<
      PriceHistoryResponse,
      { denom: string; limit: number }
    >({
      query: PRICE_HISTORY_QUERY,
      variables: {
        denom,
        limit: params?.limit ?? 48,
      },
      operationName: 'TokenPriceHistory',
    });

    return mapPriceHistory(response, denom);
  }

  async getMarketSummary(denom: string): Promise<MarketSummary> {
    const response = await this.fetcher.graphql<
      MarketSummaryResponse,
      { denom: string }
    >({
      query: MARKET_SUMMARY_QUERY,
      variables: { denom },
      operationName: 'MarketData',
    });

    return mapMarketSummary(response, denom);
  }
}
