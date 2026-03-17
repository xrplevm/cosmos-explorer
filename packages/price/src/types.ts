type Scalar = string | number | boolean | null;

export type CurrentPriceResponse = {
  tokenPrice: Array<{
    price: Scalar;
    timestamp: Scalar;
    marketCap: Scalar;
    unitName: string;
  }>;
};

export type PriceHistoryResponse = {
  tokenPrice: Array<{
    price: Scalar;
    timestamp: Scalar;
  }>;
};

export type MarketSummaryResponse = {
  communityPool: Array<{
    coins: unknown;
  }>;
  inflation: Array<{
    value: Scalar;
  }>;
  tokenPrice: Array<{
    price: Scalar;
    marketCap: Scalar;
    timestamp: Scalar;
  }>;
  supply: Array<{
    coins: unknown;
  }>;
  bondedTokens: Array<{
    bondedTokens: Scalar;
  }>;
  distributionParams: Array<{
    params: unknown;
  }>;
};
