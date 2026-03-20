type Scalar = string | number | boolean | null;

export interface CurrentPriceResponse {
  tokenPrice: {
    price: Scalar;
    timestamp: Scalar;
    marketCap: Scalar;
    unitName: string;
  }[];
}

export interface PriceHistoryResponse {
  tokenPrice: {
    price: Scalar;
    timestamp: Scalar;
  }[];
}

export interface MarketSummaryResponse {
  communityPool: {
    coins: unknown;
  }[];
  inflation: {
    value: Scalar;
  }[];
  tokenPrice: {
    price: Scalar;
    marketCap: Scalar;
    timestamp: Scalar;
  }[];
  supply: {
    coins: unknown;
  }[];
  bondedTokens: {
    bondedTokens: Scalar;
  }[];
  distributionParams: {
    params: unknown;
  }[];
}
