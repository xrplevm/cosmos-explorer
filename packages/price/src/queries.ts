export const CURRENT_PRICE_QUERY = `
  query CurrentPrice($denom: String) {
    tokenPrice: token_price(where: { unit_name: { _eq: $denom } }) {
      price
      timestamp
      marketCap: market_cap
      unitName: unit_name
    }
  }
`;

export const PRICE_HISTORY_QUERY = `
  query TokenPriceHistory($denom: String, $limit: Int = 48) {
    tokenPrice: token_price_history(
      where: { unit_name: { _eq: $denom } }
      limit: $limit
      order_by: { timestamp: desc }
    ) {
      price
      timestamp
    }
  }
`;

export const MARKET_SUMMARY_QUERY = `
  query MarketData($denom: String) {
    communityPool: community_pool(order_by: { height: desc }, limit: 1) {
      coins
    }
    inflation: inflation(order_by: { height: desc }, limit: 1) {
      value
    }
    tokenPrice: token_price(where: { unit_name: { _eq: $denom } }) {
      marketCap: market_cap
      price
      timestamp
    }
    supply: supply(order_by: { height: desc }, limit: 1) {
      coins
    }
    bondedTokens: staking_pool(order_by: { height: desc }, limit: 1) {
      bondedTokens: bonded_tokens
    }
    distributionParams: distribution_params(order_by: { height: desc }, limit: 1) {
      params
    }
  }
`;
