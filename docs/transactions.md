# Transactions Domain Plan

> **Historical document** — This was the initial planning doc for the transactions domain. The implementation is complete. See `packages/core/src/` for domain types, `packages/adapters/callisto/src/` for the adapter, and `apps/explorer/src/app/transactions/` for the pages.

This file covers the home-page requirements for the transactions domain.

## Home Responsibilities

Transactions power:

- latest transactions table

## Required Data

Minimum columns:

- hash
- type
- height
- success
- timestamp

## Proposed Domain Types

```ts
export type TransactionSummary = {
  hash: string;
  height: number;
  type: string;
  success: boolean;
  timestamp: string;
  messageCount: number;
};

export type TransactionDetail = {
  hash: string;
  height: number;
  timestamp: string;
  fee: TokenAmount | null;
  gasUsed: number;
  gasWanted: number;
  success: boolean;
  memo: string;
  error: string;
  messages: Message[];
  logs: unknown;
};
```

## Proposed Adapter Methods

```ts
getTransactions(params): Promise<PaginatedResult<TransactionSummary>>
getTransactionByHash(hash: string): Promise<TransactionDetail | null>
getTransactionsByBlock(height: number): Promise<TransactionSummary[]>
```

## Legacy Source Mapping

From `../governance-explorer`:

- transaction list: GraphQL `TransactionsListener` / `Transactions`
- transaction detail: GraphQL `TransactionDetails`

## Hasura Structure And Types

For transactions, Hasura exposes both tracked tables and tracked SQL functions.

### Main tracked data sources

- `transaction`
- `message`
- `message_type`
- `messages_by_address(...)`

### Relevant metadata files

- `../governance-explorer/callisto2/hasura/metadata/databases/bdjuno/tables/public_transaction.yaml`
- `../governance-explorer/callisto2/hasura/metadata/databases/bdjuno/tables/public_message.yaml`
- `../governance-explorer/callisto2/hasura/metadata/databases/bdjuno/functions/public_messages_by_address.yaml`

### Generated frontend transport types

The frontend codegen produces types such as:

- `TransactionsQuery`
- `TransactionsListenerSubscription`
- `TransactionDetailsQuery`
- `GetMessagesByAddressQuery`

These are query-specific transport types, not domain models.

### Important type quirks

- `messages` is usually generated as `any`
- `fee` is usually generated as `any`
- `logs` is usually generated as `any | null`
- nested `block.timestamp` must be read through relationships

So transaction domain code should map Hasura results into:

- `TransactionSummary`
- `TransactionDetail`

## Home Implementation Tasks (completed)

1. ~~define transaction types in `packages/core`~~
2. ~~add transaction queries to the Callisto adapter~~
3. ~~create transaction mappers~~
4. ~~implement server-side transaction service~~
5. ~~implement the latest transactions table~~

## Notes

- the home page needs only transaction summaries
- transactions do not require a dedicated app HTTP API
