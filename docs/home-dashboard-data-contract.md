# Home Dashboard Data Contract

> **Historical document** — This was the data contract specification for the home dashboard. The implementation is complete. See `apps/explorer/src/app/(home)/` for the current layout and `src/lib/services.ts` for service composition.

This document defines the required home page data and layout.

## Layout

The dashboard should have:

- top row: `4` cards
- second row:
  - latest blocks table on the left (`50%`)
  - latest transactions table on the right (`50%`)

## Top Cards

The `4` cards are:

1. latest block
2. average block time
3. price
4. active validators

## Required Data

### Latest block

Minimum:

- latest block height

Optional:

- latest block timestamp
- latest block hash

Legacy source:

- latest `block` subscription/query

### Average block time

Minimum:

- average block time in seconds

Legacy source:

- existing average block time GraphQL query from the old home screen

### Price

Minimum:

- current token price

Optional:

- timestamp
- market cap

Legacy source:

- `token_price`

Recommended boundary:

- adapter method only

### Active validators

Minimum:

- active validator count

Optional:

- total validator count

Legacy source:

- validator aggregate queries

## Latest Blocks Table

Placement:

- left side
- width: `50%`

Minimum columns:

- height
- proposer
- tx count
- timestamp

Legacy source:

- latest blocks subscription/query

Recommended boundary:

- adapter method only

## Latest Transactions Table

Placement:

- right side
- width: `50%`

Minimum columns:

- hash
- type
- height
- success
- timestamp

Legacy source:

- latest transactions subscription/query

Recommended boundary:

- adapter method only

## Suggested Adapter Surface

The dashboard can be powered by:

```ts
subscribeToChainStats(onData)
getLatestBlocks(limit, onData)
getTransactions({ page: 1, limit })
```

If `subscribeToChainStats(...)` becomes too broad, it can later be split into smaller methods. For now the simplest target is:

- one chain-stats source for the `4` cards
- one latest blocks feed
- one latest transactions feed

## Hasura Structure And Types

For the dashboard, the legacy frontend uses Hasura-generated transport types such as:

- `BlocksListenerSubscription`
- `TransactionsListenerSubscription`
- `TokenPriceListenerSubscription`
- `AverageBlockTimeQuery`
- `ActiveValidatorCountQuery`

These come from:

- tracked table queries
- tracked table subscriptions
- aggregate queries

They are not final app models.

The home data layer should normalize them into stable dashboard data:

- latest block
- average block time
- current price
- active validator count
- latest block rows
- latest transaction rows

## Notes

- blocks and transactions do not need custom app APIs by default
- price also does not need its own app API by default
- the most likely future API candidate is a composed market summary, not raw home-table data
