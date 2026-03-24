import type { Price } from '@cosmos-explorer/core';
import { type Fetcher } from '@cosmos-explorer/utils';

import type {
  CoinGeckoCoinResponse,
  FetchCurrentPriceInput,
  PriceServiceOptions,
  ResolvedAsset,
} from './types';

export function resolveAsset(denom: string, options: PriceServiceOptions): ResolvedAsset | null {
  const normalizedDenom = denom.trim().toLowerCase();
  const assetId = options.assetsByDenom[normalizedDenom];

  if (!assetId) {
    return null;
  }

  return {
    assetId,
    denom,
  };
}

export function mapCoinGeckoCoinToPrice(
  input: FetchCurrentPriceInput,
  coin: CoinGeckoCoinResponse
): Price {
  return {
    denom: input.denom,
    priceUsd: coin.market_data?.current_price?.usd ?? null,
    marketCapUsd: coin.market_data?.market_cap?.usd ?? null,
    timestamp: typeof coin.last_updated === 'string' ? coin.last_updated : null,
  };
}

export async function fetchCurrentPrice(
  fetcher: Fetcher,
  input: FetchCurrentPriceInput
): Promise<Price> {
  const coin = await fetcher.getJson<CoinGeckoCoinResponse>(`coins/${input.assetId}`);
  return mapCoinGeckoCoinToPrice(input, coin);
}
