# Accounts

An address's balances, delegations, rewards, unbonding and recent
transactions.

## Sub-features

- Balances, Delegated and Rewards cards; Account Details (withdraw address,
  unbonding); Balances, Delegations and Recent Transactions tables.

## How to get to it (user POV)

There is no account list. A person arrives from a validator's self-delegate
address, a transaction's sender or receiver, or by pasting an address into
the header search.

## Driving it with drive.mjs

`accounts`: from `/validators`, open the first validator, click its
self-delegate address, and wait for `Balances` and `Delegations`. The
journey fails if the page shows the error boundary (`Something went
wrong`).

## Gotchas

- A malformed address (a bad bech32 checksum) gets the generic error
  boundary, `Something went wrong`, from a 502 the GraphQL action raises,
  not an "invalid address" state. Drive real addresses taken from links;
  never type one by hand.
- Transaction pages link EVM-style `0x…` accounts as well as `ethm1…`.
