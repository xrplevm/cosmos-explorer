export type TokenAmount = {
  amount: string;
  denom: string;
};

export type Price = {
  denom: string;
  priceUsd: number | null;
  marketCapUsd: number | null;
  timestamp: string | null;
};

export type PricePoint = {
  denom: string;
  priceUsd: number;
  timestamp: string;
};

export type MarketSummary = {
  denom: string;
  priceUsd: number | null;
  marketCapUsd: number | null;
  supply: TokenAmount | null;
  bonded: TokenAmount | null;
  inflation: number | null;
  communityPool: TokenAmount | null;
  apr: number | null;
  updatedAt: string | null;
};

export interface IPriceService {
  getCurrentPrice(denom: string): Promise<Price | null>;
  getPriceHistory(
    denom: string,
    params?: { limit?: number }
  ): Promise<PricePoint[]>;
  getMarketSummary(denom: string): Promise<MarketSummary>;
}
