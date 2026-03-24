import {
  type IPriceService,
  type MarketSummary,
  type Price,
  type PricePoint,
} from '@cosmos-explorer/core';
import { type Fetcher } from '@cosmos-explorer/utils';

import { fetchCurrentPrice, resolveAsset } from './client';
import type { PriceServiceOptions } from './types';

export class PriceService implements IPriceService {
  constructor(
    private readonly fetcher: Fetcher,
    private readonly options: PriceServiceOptions
  ) {}

  async getCurrentPrice(denom: string): Promise<Price | null> {
    const asset = resolveAsset(denom, this.options);
    if (!asset) {
      return null;
    }

    return fetchCurrentPrice(this.fetcher, asset);
  }

  getPriceHistory(
    _denom: string,
    _params?: { limit?: number }
  ): Promise<PricePoint[]> {
    return Promise.resolve([]);
  }

  async getMarketSummary(denom: string): Promise<MarketSummary> {
    const price = await this.getCurrentPrice(denom);

    return {
      denom,
      priceUsd: price?.priceUsd ?? null,
      marketCapUsd: price?.marketCapUsd ?? null,
      supply: null,
      bonded: null,
      inflation: null,
      communityPool: null,
      apr: null,
      updatedAt: price?.timestamp ?? null,
    };
  }
}
