# Hasura Structure And Types

This document explains how Hasura is structured in `../governance-explorer`, what kinds of types it exposes, and how those types are consumed by the frontend.

## Big Picture

In the old project, Hasura is the GraphQL layer on top of:

- indexed Postgres tables from BDJuno / Callisto
- SQL functions
- Hasura actions backed by HTTP handlers

So the frontend is not talking directly to Postgres or directly to the chain. It is talking to Hasura, and Hasura is stitching together:

1. tracked tables
2. tracked SQL functions
3. action endpoints

## Directory Structure

The Hasura project lives here:

- `../governance-explorer/callisto2/hasura/`

Important files:

- `config.yaml`
  - local Hasura CLI project config
- `metadata/version.yaml`
  - metadata format version
- `metadata/databases/databases.yaml`
  - registered database sources
- `metadata/databases/bdjuno/tables/tables.yaml`
  - all tracked tables
- `metadata/databases/bdjuno/functions/functions.yaml`
  - tracked SQL functions
- `metadata/actions.yaml`
  - Hasura actions
- `metadata/actions.graphql`
  - action GraphQL schema

## Layer 1: Hasura Source Registration

The main source registration is in:

- `../governance-explorer/callisto2/hasura/metadata/databases/databases.yaml`

It defines one Postgres source:

- source name: `bdjuno`
- kind: `postgres`
- database URL from env: `HASURA_GRAPHQL_DATABASE_URL`

This is the root of everything else:

- tables are tracked under this source
- functions are tracked under this source

## Layer 2: Tracked Tables

Table registration starts here:

- `../governance-explorer/callisto2/hasura/metadata/databases/bdjuno/tables/tables.yaml`

This file is just a list of includes such as:

- `public_block.yaml`
- `public_transaction.yaml`
- `public_account.yaml`
- `public_validator.yaml`
- `public_token_price.yaml`
- `public_proposal.yaml`

Each table file defines:

- the table name and schema
- object relationships
- array relationships
- select permissions

### Example shape of a tracked table file

Using `public_block.yaml` as an example, a tracked table config usually contains:

- `table`
  - the physical Postgres table
- `object_relationships`
  - one-to-one / many-to-one links
- `array_relationships`
  - one-to-many links
- `select_permissions`
  - what columns the `anonymous` role can query

That means Hasura is not only exposing rows. It is also exposing graph navigation through relationships.

## Layer 3: Relationships

Relationships are defined per tracked table.

Example from `block`:

- `block -> validator`
- `block -> transactions`
- `block -> pre_commits`

Example from `proposal`:

- `proposal -> proposal_votes`
- `proposal -> proposal_tally_result`
- `proposal -> proposal_deposits`
- `proposal -> validator_status_snapshots`

Hasura relationships come in two main forms here:

### Foreign-key based relationships

Used when Postgres already has a direct FK.

Example:

- `transaction.height -> block.height`

### Manual relationships

Used when the relation is logical but not represented by a direct FK in the way Hasura expects for the target query.

Example:

- `proposal_deposit.height -> block.height`

This is why many table YAML files have a `manual_configuration` block.

## Layer 4: Permissions

Most tracked tables define `select_permissions` for the `anonymous` role.

This is important because the generated GraphQL schema the frontend sees is permission-aware.

Typical permission config includes:

- which columns are selectable
- whether aggregations are allowed
- row filter
- query limit

Example consequences:

- some tables allow `aggregate`
- some do not
- some tables expose only a subset of columns

So when you read the frontend GraphQL queries, you are seeing the schema after Hasura permissions have already shaped it.

## Layer 5: Tracked SQL Functions

Tracked functions are listed in:

- `../governance-explorer/callisto2/hasura/metadata/databases/bdjuno/functions/functions.yaml`

In this repo, one key function is:

- `messages_by_address`

Defined in Postgres here:

- `../governance-explorer/callisto2/database/schema/00-cosmos.sql`

Hasura exposes tracked SQL functions as queryable fields.

That is why the frontend can run:

- `messages_by_address(args: ...)`

This is not a table.
It is a database function that returns rows of the `message` table type.

## Layer 6: Hasura Actions

Actions are separate from tables and functions.

They are defined in:

- `../governance-explorer/callisto2/hasura/metadata/actions.yaml`
- `../governance-explorer/callisto2/hasura/metadata/actions.graphql`

Actions are used for data that is:

- procedural
- dynamic
- not already indexed into query-friendly tables
- or easier to fetch from live chain services

Examples:

- `action_account_balance`
- `action_delegation_reward`
- `action_delegation_total`
- `action_unbonding_delegation_total`
- `action_validator_commission_amount`

Each action defines:

- the GraphQL field name
- the webhook handler URL
- the argument types
- the output type

### Action handlers

Those handlers are not in Hasura. They live in the Callisto actions worker:

- `../governance-explorer/callisto2/modules/actions/handle_additional_operations.go`
- `../governance-explorer/callisto2/modules/actions/handlers/`

So the flow is:

1. frontend calls a GraphQL action
2. Hasura forwards to `ACTION_BASE_URL`
3. action worker executes Go handler
4. handler fetches live data or computed values
5. Hasura returns the result in GraphQL shape

## The Three Hasura Data Categories In Practice

When reading the frontend queries, separate them like this:

### Table-backed GraphQL

Examples:

- `block`
- `transaction`
- `proposal`
- `token_price`
- `validator`

### Function-backed GraphQL

Examples:

- `messages_by_address`

### Action-backed GraphQL

Examples:

- `action_account_balance`
- `action_delegation_total`
- `action_delegation_reward`

This distinction is critical because they behave differently operationally even though the frontend consumes them all via GraphQL.

## Frontend GraphQL Layout

The frontend GraphQL documents are under:

- `../governance-explorer/big-dipper-2.0-cosmos/packages/ui/src/graphql/general/`

Examples:

- `blocks.graphql`
- `transactions.graphql`
- `transaction_details.graphql`
- `proposal_details.graphql`
- `messages_by_address.graphql`
- `token_price.graphql`
- `market_data.graphql`
- `account_details_documents.ts`

This folder mixes:

- normal query documents
- subscription documents
- action documents written as raw GraphQL strings

## GraphQL Codegen Structure

Each app or package has a `codegen.yml`.

Example:

- `../governance-explorer/big-dipper-2.0-cosmos/apps/web-xrplevm/codegen.yml`

Typical codegen flow:

1. point codegen at a Hasura GraphQL schema URL
2. scan local GraphQL documents
3. generate TypeScript types
4. generate Apollo hooks

Plugins used:

- `typescript`
- `typescript-operations`
- `typescript-react-apollo`

That is how files like this are produced:

- `../governance-explorer/big-dipper-2.0-cosmos/packages/ui/src/graphql/types/general_types.ts`

## What The Generated Types Actually Look Like

Generated operation types are operation-specific, not domain-specific.

Examples from `general_types.ts`:

- `BlocksQuery`
- `TransactionsQuery`
- `TransactionDetailsQuery`
- `MarketDataQuery`
- `GetMessagesByAddressQuery`

These are shaped exactly like the GraphQL selection set.

### Example: `BlocksQuery`

The generated type contains exactly the nested fields selected in `blocks.graphql`, such as:

- `blocks`
  - `height`
  - `hash`
  - `timestamp`
  - `txs`
  - nested `validator`
    - nested `validatorInfo`
    - nested `validatorDescriptions`

This means the generated type is not a clean domain type like `Block`.
It is a transport type coupled to the GraphQL document.

### Example: `TransactionDetailsQuery`

It includes:

- `transaction`
  - `logs`
  - `hash`
  - `height`
  - `fee`
  - `gasUsed`
  - `gasWanted`
  - `success`
  - `memo`
  - `messages`
  - `rawLog`
  - nested `block.timestamp`

Again, this is a GraphQL transport shape, not an application-facing model.

## Generated Apollo Hooks

Codegen also generates hooks like:

- `useBlocksQuery`
- `useTransactionsListenerSubscription`
- `useMarketDataQuery`
- `useGetMessagesByAddressQuery`
- `useTransactionDetailsQuery`

These are thin wrappers over Apollo:

- query hooks for query operations
- subscription hooks for subscription operations
- lazy query hooks when applicable

The old frontend imports these generated hooks directly in screen hooks.

## Apollo Client Structure

Apollo setup is here:

- `../governance-explorer/big-dipper-2.0-cosmos/packages/ui/src/graphql/useApollo/index.ts`

Important behavior:

- HTTP batching for many standard queries
- WebSocket transport for subscriptions
- a split link for GraphQL subscriptions vs HTTP queries
- a separate profile GraphQL endpoint for Desmos profile operations
- optional fallback between environment variables, chain config, and localhost

So the frontend transport layer is more complex than "one GraphQL endpoint".

## Hasura Type Categories You Need To Keep In Mind

When people say "Hasura types" in this project, they usually mean one of these:

### Table row types in the GraphQL schema

Examples:

- `block`
- `transaction`
- `proposal`
- `validator`

These come from tracked Postgres tables.

### Aggregate types

Examples:

- `proposal_aggregate`
- `validator_status_aggregate`

These exist only where aggregations are allowed by Hasura permissions.

### Action types

Examples from `actions.graphql`:

- `ActionBalance`
- `ActionDelegationReward`
- `ActionDelegationResponse`
- `ActionRedelegationResponse`
- `ActionUnbondingDelegationResponse`

These are custom GraphQL types declared by Hasura action metadata, not by Postgres tables.

### Function result types

Example:

- `messages_by_address`

This is exposed as a field returning rows of a tracked table type.

### Generated TypeScript transport types

Examples:

- `BlocksQuery`
- `MarketDataQuery`
- `GetMessagesByAddressQuery`

These are generated from documents, not hand-designed models.

## Important Type Quirks In This Repo

### Many scalar values become `any`

In the generated TypeScript, fields like these are often `any`:

- JSON / JSONB columns
- custom Postgres types like `COIN[]`
- numeric values that codegen does not strongly map

Examples:

- `messages: any`
- `fee: any`
- `coins: any`
- `params: any`
- `height: any`

That is one of the biggest reasons the new explorer should not leak GraphQL transport types outside the adapter layer.

### Names are query-shaped, not domain-shaped

Generated names like:

- `proposalId`
- `marketCap`
- `operatorAddress`

come from aliases in the GraphQL documents.

So changing the query changes the generated type shape.

### Optionality mirrors GraphQL exactly

Generated fields often look like:

- `foo?: T | null`

because:

- GraphQL field may be nullable
- relationship may be absent
- selection may return empty arrays

This is another reason the adapter should normalize the data before it reaches UI components.

## Recommended Interpretation For The New Explorer

In the new project, treat Hasura-generated types as:

- transport-only
- local to the adapter package
- not reusable domain contracts

The adapter should convert:

- `BlocksQuery`
- `TransactionDetailsQuery`
- `MarketDataQuery`
- `GetMessagesByAddressQuery`

into clean domain types like:

- `Block`
- `TransactionSummary`
- `TransactionDetail`
- `Price`
- `ChainStats`

## Practical Mental Model

The simplest way to think about the old Hasura stack is:

1. Postgres schema defines raw data structures
2. Hasura metadata decides what is exposed and how relations are traversed
3. GraphQL documents decide the exact frontend payload shape
4. codegen creates TypeScript types and Apollo hooks from those documents
5. screen hooks reshape those transport types into UI-ready objects

That is why the new explorer should place a clean adapter boundary between Hasura and the rest of the app.
