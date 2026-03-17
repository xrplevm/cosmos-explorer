export const LATEST_BLOCKS_QUERY = `
  query LatestBlocks($limit: Int = 7) {
    blocks: block(limit: $limit, order_by: { height: desc }) {
      height
      txs: num_txs
      hash
      timestamp
      validator {
        validatorInfo: validator_info {
          operatorAddress: operator_address
        }
        validatorDescriptions: validator_descriptions(order_by: { height: desc }, limit: 1) {
          moniker
          identity
        }
      }
    }
  }
`;

export const BLOCKS_QUERY = `
  query Blocks($limit: Int = 50, $offset: Int = 0) {
    blocks: block(limit: $limit, offset: $offset, order_by: { height: desc }) {
      height
      txs: num_txs
      hash
      timestamp
      validator {
        validatorInfo: validator_info {
          operatorAddress: operator_address
        }
        validatorDescriptions: validator_descriptions(order_by: { height: desc }, limit: 1) {
          moniker
          identity
        }
      }
    }
  }
`;

export const BLOCK_DETAILS_QUERY = `
  query BlockDetails($height: bigint, $signatureHeight: bigint) {
    transactions: transaction(where: { height: { _eq: $height } }, order_by: { hash: asc }) {
      height
      hash
      success
      block {
        timestamp
      }
      messages
    }
    block: block(limit: 1, where: { height: { _eq: $height } }) {
      height
      hash
      timestamp
      txs: num_txs
      validator {
        validatorInfo: validator_info {
          operatorAddress: operator_address
        }
      }
    }
    preCommits: pre_commit(where: { height: { _eq: $signatureHeight } }) {
      validator {
        validatorInfo: validator_info {
          operatorAddress: operator_address
        }
      }
    }
  }
`;

export const LATEST_TRANSACTIONS_QUERY = `
  query LatestTransactions($limit: Int = 7) {
    transactions: transaction(limit: $limit, order_by: { height: desc }) {
      height
      hash
      success
      block {
        timestamp
      }
      messages
    }
  }
`;

export const TRANSACTIONS_QUERY = `
  query Transactions($limit: Int = 50, $offset: Int = 0) {
    transactions: transaction(limit: $limit, offset: $offset, order_by: { height: desc }) {
      height
      hash
      success
      block {
        timestamp
      }
      messages
    }
  }
`;

export const TRANSACTIONS_BY_BLOCK_QUERY = `
  query TransactionsByBlock($height: bigint) {
    transactions: transaction(where: { height: { _eq: $height } }, order_by: { hash: asc }) {
      height
      hash
      success
      block {
        timestamp
      }
      messages
    }
  }
`;

export const TRANSACTION_DETAILS_QUERY = `
  query TransactionDetails($hash: String) {
    transaction: transaction(where: { hash: { _eq: $hash } }, limit: 1) {
      hash
      height
      block {
        timestamp
      }
      fee
      gasUsed: gas_used
      gasWanted: gas_wanted
      success
      memo
      messages
      logs
      rawLog: raw_log
    }
  }
`;

export const VALIDATOR_COUNT_QUERY = `
  query ValidatorCount {
    activeTotal: validator_status_aggregate(where: { status: { _eq: 3 } }) {
      aggregate {
        count
      }
    }
    total: validator_status_aggregate {
      aggregate {
        count
      }
    }
  }
`;

export const VALIDATORS_QUERY = `
  query Validators {
    stakingPool: staking_pool(limit: 1, order_by: { height: desc }) {
      bondedTokens: bonded_tokens
    }
    validator {
      validatorStatuses: validator_statuses(order_by: { height: desc }, limit: 1) {
        status
        jailed
      }
      validatorDescriptions: validator_descriptions(order_by: { height: desc }, limit: 1) {
        moniker
        identity
      }
      validatorSigningInfos: validator_signing_infos(order_by: { height: desc }, limit: 1) {
        missedBlocksCounter: missed_blocks_counter
        tombstoned
      }
      validatorInfo: validator_info {
        operatorAddress: operator_address
      }
      validatorVotingPowers: validator_voting_powers(offset: 0, limit: 1, order_by: { height: desc }) {
        votingPower: voting_power
      }
      validatorCommissions: validator_commissions(order_by: { height: desc }, limit: 1) {
        commission
      }
    }
  }
`;

export const VALIDATOR_DETAILS_QUERY = `
  query ValidatorDetails($address: String, $limit: Int = 10) {
    validator(where: { validator_info: { operator_address: { _eq: $address } } }) {
      validatorStatuses: validator_statuses(order_by: { height: desc }, limit: 1) {
        status
        jailed
        height
      }
      validatorDescriptions: validator_descriptions(order_by: { height: desc }, limit: 1) {
        moniker
        identity
        details
        website
      }
      validatorSigningInfos: validator_signing_infos(order_by: { height: desc }, limit: 1) {
        missedBlocksCounter: missed_blocks_counter
        tombstoned
      }
      validatorInfo: validator_info {
        operatorAddress: operator_address
        selfDelegateAddress: self_delegate_address
        maxRate: max_rate
      }
      validatorVotingPowers: validator_voting_powers(limit: 1, order_by: { height: desc }) {
        votingPower: voting_power
      }
      validatorCommissions: validator_commissions(order_by: { height: desc }, limit: 1) {
        commission
      }
    }
    blocks: block(
      limit: $limit
      order_by: { height: desc }
      where: { validator: { validator_info: { operator_address: { _eq: $address } } } }
    ) {
      height
      txs: num_txs
      hash
      timestamp
    }
  }
`;

export const PROPOSALS_QUERY = `
  query Proposals($limit: Int = 20, $offset: Int = 0) {
    proposals: proposal(limit: $limit, offset: $offset, order_by: { id: desc }) {
      proposalId: id
      title
      description
      proposer: proposer_address
      status
      submitTime: submit_time
      votingEndTime: voting_end_time
      content
    }
  }
`;

export const PROPOSAL_DETAILS_QUERY = `
  query ProposalDetails($proposalId: Int!) {
    proposal: proposal(where: { id: { _eq: $proposalId } }, limit: 1) {
      proposalId: id
      title
      description
      proposer: proposer_address
      status
      submitTime: submit_time
      votingEndTime: voting_end_time
      depositEndTime: deposit_end_time
      votingStartTime: voting_start_time
      metadata
      content
    }
    proposalTallyResult: proposal_tally_result(where: { proposal_id: { _eq: $proposalId } }) {
      yes
      no
      abstain
      noWithVeto: no_with_veto
    }
    stakingPool: proposal_staking_pool_snapshot(where: { proposal_id: { _eq: $proposalId } }) {
      bondedTokens: bonded_tokens
    }
  }
`;

export const ACCOUNT_BALANCES_QUERY = `
  query AccountBalances($address: String!) {
    accountBalances: action_account_balance(address: $address) {
      coins
    }
  }
`;

export const ACCOUNT_DELEGATION_BALANCE_QUERY = `
  query AccountDelegationBalance($address: String!) {
    delegationBalance: action_delegation_total(address: $address) {
      coins
    }
  }
`;

export const ACCOUNT_UNBONDING_BALANCE_QUERY = `
  query AccountUnbondingBalance($address: String!) {
    unbondingBalance: action_unbonding_delegation_total(address: $address) {
      coins
    }
  }
`;

export const ACCOUNT_REWARDS_QUERY = `
  query AccountDelegationRewards($address: String!) {
    delegationRewards: action_delegation_reward(address: $address) {
      validatorAddress: validator_address
      coins
    }
  }
`;

export const ACCOUNT_DELEGATIONS_QUERY = `
  query AccountDelegations(
    $address: String!
    $offset: Int = 0
    $limit: Int = 10
    $pagination: Boolean! = true
  ) {
    delegations: action_delegation(
      address: $address
      limit: $limit
      offset: $offset
      count_total: $pagination
    ) {
      delegations
      pagination
    }
  }
`;

export const ACCOUNT_WITHDRAWAL_ADDRESS_QUERY = `
  query AccountWithdrawalAddress($address: String!) {
    withdrawalAddress: action_delegator_withdraw_address(address: $address) {
      address
    }
  }
`;

export const ACCOUNT_MESSAGES_QUERY = `
  query AccountMessages(
    $address: _text
    $limit: bigint = 20
    $offset: bigint = 0
    $types: _text = "{}"
  ) {
    messagesByAddress: messages_by_address(
      args: { addresses: $address, limit: $limit, offset: $offset, types: $types }
    ) {
      transaction {
        height
        hash
        success
        messages
        block {
          timestamp
        }
      }
    }
  }
`;

export const AVERAGE_BLOCK_TIME_QUERY = `
  query AverageBlockTime {
    averageBlockTime: average_block_time_per_hour(limit: 1, order_by: { height: desc }) {
      averageTime: average_time
    }
  }
`;
