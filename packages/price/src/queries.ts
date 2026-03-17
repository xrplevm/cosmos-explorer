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
