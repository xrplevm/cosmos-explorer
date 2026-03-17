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

export const AVERAGE_BLOCK_TIME_QUERY = `
  query AverageBlockTime {
    averageBlockTime: average_block_time_per_hour(limit: 1, order_by: { height: desc }) {
      averageTime: average_time
    }
  }
`;
