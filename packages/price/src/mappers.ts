import { type Price } from '@cosmos-explorer/core';

import type { CurrentPriceResponse } from './types';

function toOptionalNumber(value: unknown): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function mapPrice(response: CurrentPriceResponse, denom: string): Price | null {
  const row = response.tokenPrice[0];

  if (!row) {
    return null;
  }

  return {
    denom,
    priceUsd: toOptionalNumber(row.price),
    marketCapUsd: toOptionalNumber(row.marketCap),
    timestamp: typeof row.timestamp === 'string' ? row.timestamp : null,
  };
}
