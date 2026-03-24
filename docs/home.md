# Home Implementation Plan

> **Historical document** — This was the initial planning doc for the home page. The implementation is complete. See `apps/explorer/src/app/(home)/` for the current code. The architecture uses server-side service composition (`src/lib/services.ts`), not client-side hooks.

This document is the general implementation plan for the home page.

## Goal

Deliver the first usable dashboard with:

- `4` top cards
  - latest block
  - average block time
  - price
  - active validators
- latest blocks table on the left (`50%`)
- latest transactions table on the right (`50%`)

## Naming Rule

Use this consistently:

- service interfaces keep the `I` prefix: `IBlockService`, `IProposalService`, `IAccountService`
- domain model types do not use the `I` prefix: `Block`, `TransactionSummary`, `Price`, `Validator`

## Domain Docs

The home page depends on:

- `docs/blocks.md`
- `docs/transactions.md`
- `docs/price.md`
- `docs/validators.md`

## Hasura Structure And Types

The home page uses Hasura mostly through tracked table queries and subscriptions.

For the home scope, the relevant backend sources are:

- `block`
- `transaction`
- `token_price`
- validator aggregate queries
- average block time tracked views / tracked tables

The legacy frontend consumes generated GraphQL transport types such as:

- `BlocksListenerSubscription`
- `TransactionsListenerSubscription`
- `TokenPriceListenerSubscription`
- `AverageBlockTimeQuery`
- `ActiveValidatorCountQuery`

These are not final app models. They are operation-specific transport types generated from GraphQL documents.

That means the home adapter must map them into stable domain types such as:

- `Block`
- `TransactionSummary`
- `Price`
- `ChainStats`

If we let UI code consume raw Hasura-generated types directly, the home page becomes coupled to:

- GraphQL aliases
- nullable relationship structure
- weak scalar typing like `any`

## Deliverables

### Core

- `Block`
- `TransactionSummary`
- `Price`
- `ValidatorCount` or `ChainStats`

### Adapter

- latest block data
- average block time
- current price
- active validator count
- latest blocks feed
- latest transactions feed

### Server-side Services

- chain stats service for dashboard cards
- block service for latest blocks
- transaction service for latest transactions

### UI

- a four-card top row
- latest blocks table
- latest transactions table
- responsive layout

## Implementation Sequence (completed)

1. ~~finalize core domain types~~
2. ~~finalize the minimum adapter contract~~
3. ~~implement Callisto adapter data access~~
4. ~~map backend responses into domain types~~
5. ~~implement server-side service layer~~
6. ~~implement UI~~
7. ~~verify loading, empty, error, and responsive states~~

## Notes

- blocks and transactions should remain adapter-level reads
- price should also remain adapter-level by default
- only composed market summary data is a likely future API candidate
