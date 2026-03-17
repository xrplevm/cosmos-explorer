# Price Domain Plan

This file covers the home-page requirements for the price domain.

## Home Responsibilities

Price powers:

- price top card

## Required Data

Minimum:

- current price

Optional:

- timestamp
- market cap

## Proposed Domain Types

```ts
export type Price = {
  denom: string;
  priceUsd: number | null;
  marketCapUsd: number | null;
  timestamp: string | null;
};

export type PricePoint = {
  denom: string;
  priceUsd: number;
  timestamp: string;
};

export type MarketSummary = {
  denom: string;
  priceUsd: number | null;
  marketCapUsd: number | null;
  supply: TokenAmount | null;
  bonded: TokenAmount | null;
  inflation: number | null;
  communityPool: TokenAmount | null;
  apr: number | null;
  updatedAt: string | null;
};
```

## Proposed Service Interface

If price logic is extracted into its own service interface, keep the `I` prefix:

```ts
export interface IPriceService {
  getCurrentPrice(denom: string): Promise<Price | null>;
  getPriceHistory(denom: string, params?: { limit?: number }): Promise<PricePoint[]>;
  getMarketSummary(denom: string): Promise<MarketSummary>;
}
```

## Proposed Adapter Methods

For the home page, the minimum need is:

```ts
getCurrentPrice(denom: string): Promise<Price | null>
```

## Legacy Source Mapping

From `../governance-explorer`:

- current price: `token_price`
- history: `token_price_history`
- market summary inputs: `token_price`, `supply`, `staking_pool`, `inflation`, `community_pool`, `distribution_params`

## Hasura Structure And Types

For price, Hasura is mainly exposing tracked table data.

### Main tracked tables

- `token`
- `token_unit`
- `token_price`
- `token_price_history`

### Relevant metadata files

- `../governance-explorer/callisto2/hasura/metadata/databases/bdjuno/tables/public_token_price.yaml`
- `../governance-explorer/callisto2/hasura/metadata/databases/bdjuno/tables/public_token_price_history.yaml`
- `../governance-explorer/callisto2/hasura/metadata/databases/bdjuno/tables/public_token_unit.yaml`

### Generated frontend transport types

The frontend codegen produces types such as:

- `TokenPriceListenerSubscription`
- `TokenPriceHistoryQuery`
- `MarketDataQuery`

`MarketDataQuery` is especially important because it mixes several tracked tables into one payload:

- `token_price`
- `supply`
- `staking_pool`
- `inflation`
- `community_pool`
- `distribution_params`

### Important type quirks

- `coins` is usually generated as `any`
- `params` is usually generated as `any`
- numeric values like `price` and `inflation` are transport scalars, not normalized app numbers

So price data should be normalized into:

- `Price`
- `PricePoint`
- `MarketSummary`

## Home Implementation Tasks

1. define `Price` in `packages/core`
2. add current-price query to the Callisto adapter
3. create a price mapper
4. expose price through the home stats hook
5. implement the price card

## Notes

- current price does not need a dedicated app HTTP API by default
- only composed market summary data may justify that later
