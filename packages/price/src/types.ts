type Scalar = string | number | boolean | null;

export type CurrentPriceResponse = {
  tokenPrice: Array<{
    price: Scalar;
    timestamp: Scalar;
    marketCap: Scalar;
    unitName: string;
  }>;
};
