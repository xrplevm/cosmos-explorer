type Scalar = string | number | boolean | null;

export type LatestBlocksResponse = {
  blocks: Array<{
    height: Scalar;
    txs?: number | null;
    hash: string;
    timestamp: Scalar;
    validator?: {
      validatorInfo?: {
        operatorAddress: string;
      } | null;
    } | null;
  }>;
};

export type LatestTransactionsResponse = {
  transactions: Array<{
    height: Scalar;
    hash: string;
    success: boolean;
    block: {
      timestamp: Scalar;
    };
    messages: unknown;
  }>;
};

export type ValidatorCountResponse = {
  activeTotal: {
    aggregate?: {
      count?: number | null;
    } | null;
  };
  total: {
    aggregate?: {
      count?: number | null;
    } | null;
  };
};

export type AverageBlockTimeResponse = {
  averageBlockTime: Array<{
    averageTime: Scalar;
  }>;
};
