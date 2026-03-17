# Blocks Domain Plan

This file covers the home-page requirements for the blocks domain.

## Home Responsibilities

Blocks power:

- latest block top card
- latest blocks table

## Required Data

### Latest block card

Minimum:

- height

Optional:

- hash
- timestamp

### Latest blocks table

Minimum columns:

- height
- proposer
- tx count
- timestamp

## Proposed Domain Types

```ts
export type Block = {
  height: number;
  hash: string;
  txs: number;
  timestamp: string;
  proposer: string;
};

export type BlockDetail = {
  overview: Block;
  signatures: string[];
  transactions: TransactionSummary[];
};
```

## Proposed Adapter Methods

```ts
getBlocks(params): Promise<PaginatedResult<Block>>
getBlockByHeight(height: number): Promise<BlockDetail | null>
getLatestBlocks(limit: number, onData: (blocks: Block[]) => void): UnsubscribeFn
```

## Legacy Source Mapping

From `../governance-explorer`:

- block list: GraphQL `BlocksListener` / `Blocks`
- block details: GraphQL `BlockDetails`

## Hasura Structure And Types

For blocks, Hasura is exposing tracked Postgres tables and their relationships.

### Main tracked tables

- `block`
- `pre_commit`
- `validator`
- `validator_info`
- `validator_description`

### Relevant metadata files

- `../governance-explorer/callisto2/hasura/metadata/databases/bdjuno/tables/public_block.yaml`
- `../governance-explorer/callisto2/hasura/metadata/databases/bdjuno/tables/public_pre_commit.yaml`
- `../governance-explorer/callisto2/hasura/metadata/databases/bdjuno/tables/public_validator.yaml`

### Relevant relationships

- `block -> validator`
- `block -> transactions`
- `block -> pre_commits`

### Generated frontend transport types

The frontend codegen produces types such as:

- `BlocksQuery`
- `BlocksListenerSubscription`
- `BlockDetailsQuery`

These are Hasura transport types shaped by the GraphQL selection set, not clean `Block` or `BlockDetail` models.

### Important type quirks

- `height` often comes through a broad scalar type
- `timestamp` is a transport scalar, not a normalized app value
- nested proposer information is nullable because the relationship is nullable

So the adapter should normalize block results into:

- `Block`
- `BlockDetail`

## Home Implementation Tasks

1. define `Block` and `BlockDetail` in `packages/core`
2. add block queries to the Callisto adapter
3. create block mappers
4. implement the latest blocks hook
5. implement the latest block card
6. implement the latest blocks table

## Notes

- the latest block card and table should share the same source when possible
- blocks do not require a dedicated app HTTP API
