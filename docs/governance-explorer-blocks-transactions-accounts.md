# Governance Explorer Blocks, Transactions, And Accounts Data Flow

> **Reference document** — This documents the legacy `../governance-explorer` data flow. The new explorer has reimplemented these features with server-side service composition instead of client-side hooks/subscriptions. See `packages/adapters/callisto/src/` for the current adapter and `apps/explorer/src/lib/services.ts` for service composition.

This document explains how `../governance-explorer` retrieves blocks, transactions, and account data today, and where that data actually comes from.

## High-Level Split

The old explorer uses three different backend access patterns:

1. Hasura table queries/subscriptions
   - blocks
   - transactions
   - block details
   - transaction details
   - token price tables
2. Hasura SQL functions
   - account transaction history via `messages_by_address(...)`
3. Hasura actions backed by HTTP handlers
   - account balances
   - delegation totals
   - rewards
   - undelegation totals
   - withdrawal address
   - staking lists

That distinction matters because not all "account data" is coming from indexed database tables.

## Blocks

### Core tables

The main schema is in `../governance-explorer/callisto2/database/schema/00-cosmos.sql`.

Relevant tables:

- `block`
  - `height`
  - `hash`
  - `num_txs`
  - `total_gas`
  - `proposer_address`
  - `timestamp`
- `pre_commit`
  - used for block signatures / validator participation
- `validator`
- `validator_info`
- `validator_description`

### Hasura exposure

Relevant metadata:

- `../governance-explorer/callisto2/hasura/metadata/databases/bdjuno/tables/public_block.yaml`
- `../governance-explorer/callisto2/hasura/metadata/databases/bdjuno/tables/public_pre_commit.yaml`
- `../governance-explorer/callisto2/hasura/metadata/databases/bdjuno/tables/public_validator.yaml`
- `../governance-explorer/callisto2/hasura/metadata/databases/bdjuno/tables/public_validator_info.yaml`

Important block relationships:

- `block -> validator` through `proposer_address`
- `block -> transactions`
- `block -> pre_commits`

### Frontend block list

GraphQL:

- `../governance-explorer/big-dipper-2.0-cosmos/packages/ui/src/graphql/general/blocks.graphql`

Two operations exist:

- `BlocksListener` subscription
- `Blocks` query

The home screen uses the subscription hook:

- `../governance-explorer/big-dipper-2.0-cosmos/packages/ui/src/screens/home/components/blocks/hooks.ts`

Behavior:

- subscribes to `block(order_by: {height: desc})`
- maps each block to:
  - `height`
  - `txs`
  - `hash`
  - `timestamp`
  - `proposer`

Important detail:

- the home page is live-updating through GraphQL subscription, not polling

### Frontend block details

GraphQL:

- `../governance-explorer/big-dipper-2.0-cosmos/packages/ui/src/graphql/general/block_details.graphql`

The detail page fetches:

- `block` row for the requested height
- all `transaction` rows at that height
- `pre_commit_aggregate`
- `pre_commit`

Hook:

- `../governance-explorer/big-dipper-2.0-cosmos/packages/ui/src/screens/block_details/hooks.ts`

Behavior:

- reads `router.query.height`
- sets `signatureHeight = height + 1`
- fetches block overview, signatures, and transactions in one query
- converts transaction messages with `convertMsgsToModels(...)`
- computes display message types with `convertMsgType(...)`

Returned detail structure:

- `overview`
  - `height`
  - `hash`
  - `txs`
  - `timestamp`
  - `proposer`
- `signatures`
  - operator addresses from pre-commits
- `transactions`
  - transaction list already converted into UI-ready message models

Important detail:

- signature data comes from the next height (`height + 1`), because pre-commits for block `N` appear in block `N + 1`

## Transactions

### Core table

In `../governance-explorer/callisto2/database/schema/00-cosmos.sql`:

- `transaction`
  - `hash`
  - `height`
  - `success`
  - `messages`
  - `memo`
  - `signatures`
  - `signer_infos`
  - `fee`
  - `gas_wanted`
  - `gas_used`
  - `raw_log`
  - `logs`

The schema also includes:

- `message`
- `message_type`

Those support filtered message-level lookups, especially for account transaction history.

### Hasura exposure

Relevant metadata:

- `../governance-explorer/callisto2/hasura/metadata/databases/bdjuno/tables/public_transaction.yaml`
- `../governance-explorer/callisto2/hasura/metadata/databases/bdjuno/tables/public_message.yaml`

### Frontend transaction list

GraphQL:

- `../governance-explorer/big-dipper-2.0-cosmos/packages/ui/src/graphql/general/transactions.graphql`

Operations:

- `TransactionsListener` subscription
- `Transactions` query

The home screen uses:

- `../governance-explorer/big-dipper-2.0-cosmos/packages/ui/src/screens/home/components/transactions/hooks.ts`

Behavior:

- subscribes to latest transactions ordered by `height desc`
- reads:
  - `height`
  - `hash`
  - `success`
  - `block.timestamp`
  - `messages`
  - `logs`
- extracts each message `@type`
- converts the message list into a summarized display type via `convertMsgType(...)`

Returned item shape:

- `height`
- `hash`
- `type`
- `success`
- `timestamp`
- `messages`

### Frontend transaction details

GraphQL:

- `../governance-explorer/big-dipper-2.0-cosmos/packages/ui/src/graphql/general/transaction_details.graphql`

Hook:

- `../governance-explorer/big-dipper-2.0-cosmos/packages/ui/src/screens/transaction_details/hooks.ts`

Behavior:

- reads `router.query.tx`
- queries one transaction by hash
- formats:
  - fee
  - gas used / wanted
  - memo
  - raw error text if failed
- converts messages through `convertMsgsToModels(...)`
- supports raw/formatted message toggling
- supports client-side message category filtering

Returned detail structure:

- `overview`
  - `hash`
  - `height`
  - `timestamp`
  - `fee`
  - `gasUsed`
  - `gasWanted`
  - `success`
  - `memo`
  - `error`
- `logs`
- `messages`

Important detail:

- fee formatting only uses the first fee coin in `fee.amount[0]`

## Accounts

Accounts are the most mixed area in the old project.

### Base account table

Schema:

- `../governance-explorer/callisto2/database/schema/01-auth.sql`

Core table:

- `account`
  - only stores `address`

This table is not enough for the full account page. Most of the interesting data is obtained through actions or functions.

### Account transactions: SQL function path

Database function:

- `../governance-explorer/callisto2/database/schema/00-cosmos.sql`
- `messages_by_address(addresses, types, limit, offset)`

Hasura function exposure:

- `../governance-explorer/callisto2/hasura/metadata/databases/bdjuno/functions/public_messages_by_address.yaml`

Frontend query:

- `../governance-explorer/big-dipper-2.0-cosmos/packages/ui/src/graphql/general/messages_by_address.graphql`

Account transactions hook:

- `../governance-explorer/big-dipper-2.0-cosmos/packages/ui/src/screens/account_details/components/transactions/hooks.ts`

Behavior:

- queries `messages_by_address(...)`
- passes the address as a Postgres text-array string like `{cosmos1...}`
- applies transaction type filters through the `types` argument
- requests `LIMIT + 1` rows to detect next page
- converts each message bundle into UI message models
- collapses message types into a display label via `convertMsgType(...)`

Important details:

- account transaction history is not a direct `transaction(where: ...)` query
- it is message-driven and then mapped back to transactions through the message relationship

### Account balances and staking totals: Hasura action path

Hasura actions are defined in:

- `../governance-explorer/callisto2/hasura/metadata/actions.yaml`
- `../governance-explorer/callisto2/hasura/metadata/actions.graphql`

Registered HTTP handlers:

- `../governance-explorer/callisto2/modules/actions/handle_additional_operations.go`

Handlers live under:

- `../governance-explorer/callisto2/modules/actions/handlers/`

Examples:

- `account_balance.go`
- `delegation_total.go`
- `delegator_reward.go`
- `delegator_withdraw_address.go`
- `unbonding_delegation_total.go`
- `delegation.go`
- `redelegation.go`
- `unbonding_delegations.go`

The actions worker exposes endpoints like:

- `/account_balance`
- `/delegation_reward`
- `/delegator_withdraw_address`
- `/delegation_total`
- `/redelegation`
- `/unbonding_delegation`
- `/unbonding_delegation_total`
- `/validator_commission_amount`

These are mounted behind Hasura `ACTION_BASE_URL`.

### Account detail GraphQL documents

Frontend action documents:

- `../governance-explorer/big-dipper-2.0-cosmos/packages/ui/src/graphql/general/account_details_documents.ts`

The account page uses:

- `action_account_balance`
- `action_delegation_total`
- `action_unbonding_delegation_total`
- `action_delegation_reward`
- `action_delegator_withdraw_address`
- `action_validator_commission_amount`
- `action_delegation`
- `action_redelegation`
- `action_unbonding_delegation`

### Account balance hook

Hook:

- `../governance-explorer/big-dipper-2.0-cosmos/packages/ui/src/screens/account_details/hooks.ts`

Supporting query wrappers:

- `../governance-explorer/big-dipper-2.0-cosmos/packages/ui/src/screens/account_details/utils.tsx`

Behavior:

- loads available balance, delegated balance, unbonding balance, rewards, and commission separately
- converts the account address to validator address when querying commission
- merges the results client-side
- formats the primary token summary:
  - available
  - delegated
  - unbonding
  - rewards
  - commission
  - total
- computes `otherTokens` by scanning balances, rewards, and commission for non-primary denoms
- optionally resolves IBC denoms client-side through `fetchParseIbcDenom(...)`

Important detail:

- the main account balance card is not a single backend response
- it is composed in the frontend from several action responses

### Account staking hook

Hook:

- `../governance-explorer/big-dipper-2.0-cosmos/packages/ui/src/screens/account_details/components/staking/hooks.ts`

Behavior:

- queries:
  - `action_delegation`
  - `action_redelegation`
  - `action_unbonding_delegation`
- also queries `validators` to get commission percentages
- formats delegation, redelegation, and unbonding rows client-side
- uses separate count queries for pagination totals

Returned sections:

- delegations
- redelegations
- unbondings

Important detail:

- validator commission shown on the account staking page is joined in the frontend from the validators query, not returned by the action directly

### Account overview

The overview UI logic itself is minimal:

- `../governance-explorer/big-dipper-2.0-cosmos/packages/ui/src/screens/account_details/components/overview/hooks.ts`

It mostly handles modal/copy interactions. The real data work is in the balance/staking/action hooks above.

## What This Means For A New Adapter

If we want parity with the old explorer, account support cannot be modeled as a single simple table read.

We will need to represent at least three sources:

1. indexed database reads
   - blocks
   - transactions
   - block details
   - transaction details
2. database function reads
   - account transaction history by address
3. dynamic action/API reads
   - balances
   - rewards
   - delegations
   - redelegations
   - undelegations
   - withdrawal address
   - validator commission amount

## Recommended API Boundary

Not every area needs a dedicated app HTTP API.

### Do not add a new app API for these by default

These are already indexed and queryable in a stable shape:

- block list
- block details
- transaction list
- transaction details

For these, the cleaner design is:

- adapter methods only
- no extra `/api/blocks` or `/api/transactions` layer unless we later need caching, auth, or backend hiding

### Add an adapter seam, but not necessarily an HTTP API, for account transactions

Account transaction history is backed by `messages_by_address(...)`, so it should be hidden behind a clean adapter method such as:

```ts
getAccountTransactions(address, params)
```

But that still does not require a separate app HTTP route if the app can talk to the backend adapter directly.

### Use an API boundary only where the backend contract is genuinely mixed or procedural

Accounts are the strongest case for a dedicated service boundary because the old implementation combines:

- SQL function reads
- Hasura actions
- live chain lookups through action handlers
- frontend-side aggregation

If we expose account data through a new API, it should be for composed account resources such as:

- account summary
- account staking summary
- account transactions

and not for raw pass-through table reads.

## Revised Recommendation

For this repo, the default should be:

- `blocks` and `transactions`: adapter methods only
- `accounts`: adapter methods first, optional API route only if we need to unify mixed sources or stabilize the contract for the frontend

That keeps the architecture smaller and avoids rebuilding a thin REST layer on top of data that is already normalized enough.

## Important Quirks To Preserve Or Deliberately Change Later

- Blocks and transactions on the home page are subscriptions, not normal polling queries.
- Block signatures are fetched with `signatureHeight = height + 1`.
- Account transaction history is message-based through `messages_by_address(...)`.
- Account balances are assembled client-side from multiple Hasura actions.
- Account commission queries first convert delegator address to validator address.
- Fee display in transaction details uses only the first fee coin.
- IBC denom decoding for account balances happens client-side after initial render.
