# Price API Design

This document proposes a clean price API for `cosmos-explorer`, based on how `../governance-explorer` currently handles price and market data.

## Current Legacy Behavior

The old project stores price data in Postgres and exposes it through Hasura.

### Backend storage

Schema:

- `../governance-explorer/callisto2/database/schema/07-pricefeed.sql`

Relevant tables:

- `token`
- `token_unit`
- `token_price`
- `token_price_history`

Important columns:

- `token_unit.price_id`
  - external identifier used to fetch price data
- `token_price`
  - latest price + market cap per unit
- `token_price_history`
  - historical price points

### Backend refresh flow

Relevant files:

- `../governance-explorer/callisto2/modules/pricefeed/handle_additional_operations.go`
- `../governance-explorer/callisto2/modules/pricefeed/handle_periodic_operations.go`
- `../governance-explorer/callisto2/modules/pricefeed/coingecko/apis.go`

Flow:

1. startup stores token units from config
2. units with `price_id` are eligible for pricing
3. periodic job fetches prices from CoinGecko every 2 minutes
4. periodic job stores history every 1 hour
5. history timestamps are normalized to `time.Now()` so repeated unchanged CoinGecko timestamps still produce hourly points

### Frontend consumption

GraphQL:

- `../governance-explorer/big-dipper-2.0-cosmos/packages/ui/src/graphql/general/token_price.graphql`
- `../governance-explorer/big-dipper-2.0-cosmos/packages/ui/src/graphql/general/market_data.graphql`

Hooks:

- `../governance-explorer/big-dipper-2.0-cosmos/packages/ui/src/screens/home/components/data_blocks/hooks.ts`
- `../governance-explorer/big-dipper-2.0-cosmos/packages/ui/src/screens/home/components/hero/hooks.ts`
- `../governance-explorer/big-dipper-2.0-cosmos/packages/ui/src/recoil/market/hooks.ts`

Legacy usage split:

- current price on home stats: `token_price` subscription
- price history chart: `token_price_history` query with 48 points
- market summary:
  - `token_price`
  - `supply`
  - `inflation`
  - `community_pool`
  - `staking_pool`
  - `distribution_params`

## Problem With The Legacy Shape

The old implementation spreads price/market data across multiple frontend queries and local calculations.

Examples:

- current price comes from one subscription
- history comes from another query
- APR is computed in the frontend
- market cap is mixed into a generic market recoil store

That makes the frontend more coupled to Hasura table layout than it needs to be.

## Design Goals

- keep the backend source compatible with the existing indexed data
- expose a smaller and clearer contract to the new frontend
- separate "current price", "price history", and "market summary"
- make timestamps, source, and freshness explicit
- keep token identity unambiguous

## Proposed Core Types

Suggested app-level types:

```ts
export type PricePoint = {
  denom: string;
  priceUsd: number;
  timestamp: string;
};

export type Price = {
  denom: string;
  priceUsd: number;
  marketCapUsd: number | null;
  timestamp: string;
  source: "coingecko" | "manual" | "unknown";
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

## Proposed Data Source Interface

Suggested additions for the adapter layer:

```ts
getCurrentPrice(denom: string): Promise<Price | null>
getPriceHistory(
  denom: string,
  params?: { limit?: number; from?: string; to?: string; resolution?: "hour" | "day" }
): Promise<PricePoint[]>
getMarketSummary(denom: string): Promise<MarketSummary>
```

This keeps price concerns separate from `getChainStats()` while still allowing `getChainStats()` to embed selected summary values later if useful.

## Rethought API Boundary

The first version of this doc proposed three app HTTP endpoints. That is probably too much.

The better default is:

- keep `getCurrentPrice(...)` and `getPriceHistory(...)` as adapter methods only
- only add an app-facing API for `market summary` if we want to centralize aggregation and caching

Reason:

- current price is already a simple indexed read from `token_price`
- history is already a simple indexed read from `token_price_history`
- market summary is the only case that actually combines multiple backend sources and frontend logic

So the recommended shape is smaller:

### Required adapter methods

```ts
getCurrentPrice(denom: string): Promise<Price | null>
getPriceHistory(
  denom: string,
  params?: { limit?: number; from?: string; to?: string; resolution?: "hour" | "day" }
): Promise<PricePoint[]>
getMarketSummary(denom: string): Promise<MarketSummary>
```

### Optional app HTTP API

Only if we want a stable frontend-facing boundary or server-side caching:

`GET /api/market/summary?denom=axrp`

Response:

```json
{
  "denom": "axrp",
  "priceUsd": 0.52,
  "marketCapUsd": 120000000,
  "supply": { "amount": "1000000000", "denom": "axrp" },
  "bonded": { "amount": "650000000", "denom": "axrp" },
  "inflation": 0.07,
  "communityPool": { "amount": "1200000", "denom": "axrp" },
  "apr": 0.096,
  "updatedAt": "2026-03-16T10:20:00Z"
}
```

### When an HTTP API is not necessary

Do not add `/api/price/current` or `/api/price/history` unless one of these becomes true:

- the frontend cannot access the adapter directly
- we need response caching at the app layer
- we want to hide the backend implementation from public clients
- we need to merge multiple price providers behind one stable contract

## How To Back The Adapter With The Existing Backend

### Current price

Source:

- `token_price where unit_name = $denom`

Maps directly to:

- `priceUsd`
- `marketCapUsd`
- `timestamp`

### Price history

Source:

- `token_price_history where unit_name = $denom order_by timestamp desc limit $limit`

Then:

- reverse in the adapter so the frontend receives ascending time order

### Market summary

Use the same data sources the old `MarketData` query already combines:

- `token_price`
- `supply`
- `staking_pool`
- `inflation`
- `community_pool`
- `distribution_params`

APR can be computed in the adapter the same way the old frontend computes it:

```ts
apr = bonded > 0
  ? (supply * ((1 - communityTax) * inflation)) / bonded
  : 0
```

That keeps the new frontend simpler and is the strongest case for a dedicated API boundary if we later need one.

## Recommended Normalization Rules

- Always return ISO timestamps in UTC.
- Always return price values as numbers, not formatted strings.
- Always identify the asset by `denom`.
- Return `null` for unknown optional values instead of `0`.
- Return history in ascending timestamp order.
- Include `updatedAt` or `timestamp` in every price-bearing response.

## Recommended Error Handling

- `404` when the denom is unknown
- `200` with `null` price fields when the denom exists but no price feed is configured yet
- `502` when the upstream price source refresh is broken and no cached DB value exists
- `200` with stale data if DB has the last known value

Suggested stale response addition:

```json
{
  "stale": true,
  "updatedAt": "2026-03-15T08:00:00Z"
}
```

## Why This Is Better Than Reusing Legacy Queries Directly

- The frontend stops depending on Hasura table names.
- APR logic moves out of UI code.
- History ordering becomes consistent.
- Current price and market summary are clearly separated.
- We can swap Hasura for another backend later without changing UI contracts.

## Minimum Viable Implementation Later

If we want the smallest first implementation, start with:

1. `getCurrentPrice(denom)`
2. `getPriceHistory(denom, { limit: 48 })`
3. `getMarketSummary(denom)`

Back them with the same legacy tables:

- `token_price`
- `token_price_history`
- `supply`
- `staking_pool`
- `inflation`
- `community_pool`
- `distribution_params`

And only expose `getMarketSummary(...)` through an app HTTP API if we discover that the frontend benefits from:

- one request instead of several
- shared caching
- backend abstraction
