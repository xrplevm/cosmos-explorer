import { type IPriceService, type Price } from '@cosmos-explorer/core';
import { type Fetcher } from '@cosmos-explorer/utils';

import { mapPrice } from './mappers.js';
import { CURRENT_PRICE_QUERY } from './queries.js';
import type { CurrentPriceResponse } from './types.js';

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
}
