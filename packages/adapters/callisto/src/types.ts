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
      validatorDescriptions?: Array<{
        moniker?: string | null;
        identity?: string | null;
      }> | null;
    } | null;
  }>;
};

export type BlockDetailsResponse = {
  block: LatestBlocksResponse['blocks'];
  transactions: LatestTransactionsResponse['transactions'];
  preCommits: Array<{
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

export type TransactionDetailsResponse = {
  transaction: Array<{
    hash: string;
    height: Scalar;
    block: {
      timestamp: Scalar;
    };
    fee: unknown;
    gasUsed?: Scalar;
    gasWanted?: Scalar;
    success: boolean;
    memo?: string | null;
    messages: unknown;
    logs: unknown;
    rawLog?: string | null;
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

export type ValidatorsResponse = {
  stakingPool: Array<{
    bondedTokens: Scalar;
  }>;
  validator: Array<{
    validatorStatuses: Array<{
      status: number;
      jailed: boolean;
    }>;
    validatorDescriptions: Array<{
      moniker?: string | null;
      identity?: string | null;
    }>;
    validatorSigningInfos: Array<{
      missedBlocksCounter: Scalar;
      tombstoned: boolean;
    }>;
    validatorInfo?: {
      operatorAddress: string;
    } | null;
    validatorVotingPowers: Array<{
      votingPower: Scalar;
    }>;
    validatorCommissions: Array<{
      commission: Scalar;
    }>;
  }>;
};

export type AverageBlockTimeResponse = {
  averageBlockTime: Array<{
    averageTime: Scalar;
  }>;
};

export type ValidatorDetailsResponse = {
  validator: Array<{
    validatorStatuses: Array<{
      status: number;
      jailed: boolean;
      height: Scalar;
    }>;
    validatorDescriptions: Array<{
      moniker?: string | null;
      identity?: string | null;
      details?: string | null;
      website?: string | null;
    }>;
    validatorSigningInfos: Array<{
      missedBlocksCounter: Scalar;
      tombstoned: boolean;
    }>;
    validatorInfo?: {
      operatorAddress: string;
      selfDelegateAddress?: string | null;
      maxRate?: Scalar | null;
    } | null;
    validatorVotingPowers: Array<{
      votingPower: Scalar;
    }>;
    validatorCommissions: Array<{
      commission: Scalar;
    }>;
  }>;
  blocks: Array<{
    height: Scalar;
    txs?: number | null;
    hash: string;
    timestamp: Scalar;
  }>;
};

export type ProposalsResponse = {
  proposals: Array<{
    proposalId: number;
    title?: string | null;
    description?: string | null;
    proposer?: string | null;
    status?: string | null;
    submitTime?: string | null;
    votingEndTime?: string | null;
    content?: unknown;
  }>;
};

export type ProposalDetailsResponse = {
  proposal: Array<{
    proposalId: number;
    title?: string | null;
    description?: string | null;
    proposer?: string | null;
    status?: string | null;
    submitTime?: string | null;
    votingEndTime?: string | null;
    depositEndTime?: string | null;
    votingStartTime?: string | null;
    metadata?: string | null;
    content?: unknown;
  }>;
  proposalTallyResult: Array<{
    yes?: Scalar;
    no?: Scalar;
    abstain?: Scalar;
    noWithVeto?: Scalar;
  }>;
  stakingPool: Array<{
    bondedTokens?: Scalar | null;
  }>;
};

export type AccountCoinsResponse = {
  accountBalances?: {
    coins?: unknown;
  } | null;
  delegationBalance?: {
    coins?: unknown;
  } | null;
  unbondingBalance?: {
    coins?: unknown;
  } | null;
};

export type AccountRewardsResponse = {
  delegationRewards: Array<{
    validatorAddress?: string | null;
    coins?: unknown;
  }>;
};

export type AccountDelegationsResponse = {
  delegations?: {
    delegations?: Array<{
      validator_address?: string | null;
      coins?: unknown;
      delegator_address?: string | null;
    }> | null;
    pagination?: {
      total?: number | null;
    } | null;
  } | null;
};

export type AccountWithdrawalAddressResponse = {
  withdrawalAddress?: {
    address?: string | null;
  } | null;
};

export type DailyStatsResponse = Record<
  string,
  {
    aggregate?: {
      count?: number | null;
      sum?: {
        num_txs?: number | null;
      } | null;
    } | null;
  }
>;

export type AccountMessagesResponse = {
  messagesByAddress: Array<{
    transaction?: {
      height: Scalar;
      hash: string;
      success: boolean;
      messages: unknown;
      block: {
        timestamp: Scalar;
      };
    } | null;
  }>;
};
