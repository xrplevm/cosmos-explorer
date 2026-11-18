# Transactions

The transaction list and a transaction's detail, including its EVM view
when it carries an Ethereum transaction.

## Sub-features

- `/transactions`: Tx Hash, Type, Status, Messages, Block, Time.
- `/transactions/[hash]`: Cosmos hash, EVM tx hash and a link to the EVM
  explorer, status, block, timestamp, messages (one component per message
  type under `components/transaction-details/messages/`).

## How to get to it (user POV)

Click **Transactions** in the sidebar, then a hash.

## Driving it with drive.mjs

`transactions`: load `/transactions`, wait for the heading, click the first
hash, and wait for `Transaction Details`, the same hash, and a `Status`
label.

## Gotchas

- On testnet a page of recent transactions is nearly all `EthereumTx`
  (24 of 25 when this map was written), so the generic journey rarely
  shows a Cosmos-only message type. A change to a message variant needs a
  transaction of that type: find one on the network and drive its URL
  (reached through search, as a person would).
