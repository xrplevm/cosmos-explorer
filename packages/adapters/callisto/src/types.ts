type Scalar = string | number | boolean | null;

export interface LatestBlocksResponse {
  blocks: {
    height: Scalar;
    txs?: number | null;
    hash: string;
    timestamp: Scalar;
    validator?: {
      validatorInfo?: {
        operatorAddress: string;
      } | null;
      validatorDescriptions?: {
        moniker?: string | null;
        identity?: string | null;
      }[] | null;
    } | null;
  }[];
}

export interface BlockDetailsResponse {
  block: LatestBlocksResponse['blocks'];
  transactions: LatestTransactionsResponse['transactions'];
  preCommits: {
    validator?: {
      validatorInfo?: {
        operatorAddress: string;
      } | null;
    } | null;
  }[];
}

export interface LatestTransactionsResponse {
  transactions: {
    height: Scalar;
    hash: string;
    success: boolean;
    block: {
      timestamp: Scalar;
    };
    messages: unknown;
  }[];
}

export interface TransactionDetailsResponse {
  transaction: {
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
  }[];
}

export interface ValidatorCountResponse {
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
}

export interface ValidatorsResponse {
  stakingPool: {
    bondedTokens: Scalar;
  }[];
  validator: {
    validatorStatuses: {
      status: number;
      jailed: boolean;
    }[];
    validatorDescriptions: {
      moniker?: string | null;
      identity?: string | null;
    }[];
    validatorSigningInfos: {
      missedBlocksCounter: Scalar;
      tombstoned: boolean;
    }[];
    validatorInfo?: {
      operatorAddress: string;
      selfDelegateAddress?: string | null;
    } | null;
    validatorVotingPowers: {
      votingPower: Scalar;
    }[];
    validatorCommissions: {
      commission: Scalar;
    }[];
  }[];
}

export interface AverageBlockTimeResponse {
  averageBlockTime: {
    averageTime: Scalar;
  }[];
}

export interface ValidatorDetailsResponse {
  validator: {
    validatorStatuses: {
      status: number;
      jailed: boolean;
      height: Scalar;
    }[];
    validatorDescriptions: {
      moniker?: string | null;
      identity?: string | null;
      details?: string | null;
      website?: string | null;
    }[];
    validatorSigningInfos: {
      missedBlocksCounter: Scalar;
      tombstoned: boolean;
    }[];
    validatorInfo?: {
      operatorAddress: string;
      selfDelegateAddress?: string | null;
      maxRate?: Scalar | null;
    } | null;
    validatorVotingPowers: {
      votingPower: Scalar;
    }[];
    validatorCommissions: {
      commission: Scalar;
    }[];
  }[];
  blocks: {
    height: Scalar;
    txs?: number | null;
    hash: string;
    timestamp: Scalar;
  }[];
}

export interface ProposalsResponse {
  proposals: {
    proposalId: number;
    title?: string | null;
    description?: string | null;
    proposer?: string | null;
    status?: string | null;
    submitTime?: string | null;
    votingEndTime?: string | null;
    content?: unknown;
  }[];
}

export interface ProposalDetailsResponse {
  proposal: {
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
  }[];
  proposalTallyResult: {
    yes?: Scalar;
    no?: Scalar;
    abstain?: Scalar;
    noWithVeto?: Scalar;
  }[];
  stakingPool: {
    bondedTokens?: Scalar | null;
  }[];
}

export interface ActiveProposalsResponse {
  proposal: {
    proposalId: number;
    title?: string | null;
    description?: string | null;
    proposer?: string | null;
    status?: string | null;
    submitTime?: string | null;
    votingEndTime?: string | null;
    votingStartTime?: string | null;
    depositEndTime?: string | null;
    metadata?: string | null;
    content?: unknown;
  }[];
}

export interface ActiveProposalsDataResponse {
  proposal_tally_result: {
    proposalId: number;
    yes?: Scalar;
    no?: Scalar;
    abstain?: Scalar;
    noWithVeto?: Scalar;
  }[];
  proposal_staking_pool_snapshot: {
    proposalId: number;
    bondedTokens?: Scalar | null;
  }[];
}

export interface ProposalVotesResponse {
  proposal_vote: {
    voter_address: string;
    option: string;
    height: number | string;
    timestamp?: string | null;
    weight: string;
  }[];
  proposal_vote_aggregate: {
    aggregate?: {
      count?: number | null;
    } | null;
  };
}

export interface AccountCoinsResponse {
  accountBalances?: {
    coins?: unknown;
  } | null;
  delegationBalance?: {
    coins?: unknown;
  } | null;
  unbondingBalance?: {
    coins?: unknown;
  } | null;
}

export interface AccountRewardsResponse {
  delegationRewards: {
    validatorAddress?: string | null;
    coins?: unknown;
  }[];
}

export interface AccountDelegationsResponse {
  delegations?: {
    delegations?: {
      validator_address?: string | null;
      coins?: unknown;
      delegator_address?: string | null;
    }[] | null;
    pagination?: {
      total?: number | null;
    } | null;
  } | null;
}

export interface AccountWithdrawalAddressResponse {
  withdrawalAddress?: {
    address?: string | null;
  } | null;
}

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

export interface AccountMessagesResponse {
  messagesByAddress: {
    transaction?: {
      height: Scalar;
      hash: string;
      success: boolean;
      messages: unknown;
      block: {
        timestamp: Scalar;
      };
    } | null;
  }[];
}
