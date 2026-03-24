import type { Price } from '@cosmos-explorer/core';

export interface CoinGeckoCoinResponse {
  id: string;
  last_updated?: string;
  market_data?: {
    current_price?: {
      usd?: number;
    };
    market_cap?: {
      usd?: number;
    };
  };
}

export interface PriceServiceOptions {
  assetsByDenom: Record<string, string>;
}

export interface FetchCurrentPriceInput {
  assetId: string;
  denom: string;
}

export interface ResolvedAsset {
  assetId: string;
  denom: string;
}

export type MappedPrice = Price;
