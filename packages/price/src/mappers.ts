import {
  type MarketSummary,
  type Price,
  type PricePoint,
  type TokenAmount,
} from '@cosmos-explorer/core';

import type {
  CurrentPriceResponse,
  MarketSummaryResponse,
  PriceHistoryResponse,
} from './types';

function toOptionalNumber(value: unknown): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeCoins(coins: unknown): { denom: string; amount: string }[] {
  if (!Array.isArray(coins)) {
    return [];
  }

  return coins.flatMap((coin) => {
    if (!coin || typeof coin !== 'object') {
      return [];
    }

    const denom = typeof (coin as { denom?: unknown }).denom === 'string'
      ? (coin as { denom: string }).denom
      : '';
    const amount = (coin as { amount?: unknown }).amount;

    if (!denom || amount == null) {
      return [];
    }

    return [{ denom, amount: `${amount as string | number}` }];
  });
}

function getCoinAmount(coins: unknown, denom: string): TokenAmount | null {
  const coin = normalizeCoins(coins).find((item) => item.denom === denom);

  if (!coin) {
    return null;
  }

  return {
    amount: coin.amount,
    denom: coin.denom,
  };
}

export function mapPrice(response: CurrentPriceResponse, denom: string): Price | null {
  const row = response.tokenPrice[0] as CurrentPriceResponse['tokenPrice'][number] | undefined;

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

export function mapPriceHistory(
  response: PriceHistoryResponse,
  denom: string
): PricePoint[] {
  return response.tokenPrice
    .map((row) => {
      const priceUsd = toOptionalNumber(row.price);
      const timestamp = typeof row.timestamp === 'string' ? row.timestamp : null;

      if (priceUsd == null || timestamp == null) {
        return null;
      }

      return {
        denom,
        priceUsd,
        timestamp,
      } satisfies PricePoint;
    })
    .filter((row): row is PricePoint => row != null);
}

export function mapMarketSummary(
  response: MarketSummaryResponse,
  denom: string
): MarketSummary {
  const price = response.tokenPrice[0] as MarketSummaryResponse['tokenPrice'][number] | undefined;
  const inflation = toOptionalNumber(response.inflation[0]?.value);
  const bondedAmount = toOptionalNumber(response.bondedTokens[0]?.bondedTokens);
  const supply = getCoinAmount(response.supply[0]?.coins, denom);
  const bonded = bondedAmount == null
    ? null
    : {
        amount: String(bondedAmount),
        denom,
      };
  const communityPool = getCoinAmount(response.communityPool[0]?.coins, denom);
  const communityTax = toOptionalNumber(
    (response.distributionParams[0]?.params as { community_tax?: unknown } | undefined)
      ?.community_tax
  ) ?? 0;
  const supplyAmount = toOptionalNumber(supply?.amount);
  const apr =
    supplyAmount != null && bondedAmount != null && bondedAmount !== 0 && inflation != null
      ? (supplyAmount * (1 - communityTax) * inflation) / bondedAmount
      : null;

  return {
    denom,
    priceUsd: toOptionalNumber(price?.price),
    marketCapUsd: toOptionalNumber(price?.marketCap),
    supply,
    bonded,
    inflation,
    communityPool,
    apr,
    updatedAt: typeof price?.timestamp === 'string' ? price.timestamp : null,
  };
}
