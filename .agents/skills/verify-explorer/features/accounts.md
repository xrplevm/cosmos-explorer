# Accounts

An address's balances, delegations, rewards and unbonding.

## Sub-features

- Balances, Delegated and Rewards cards; Account Details (withdraw address,
  unbonding); Balances and Delegations tables.

## How to get to it (user POV)

There is no account list. A person arrives from a validator's self-delegate
address, a transaction's sender or receiver, or by pasting an address into
the header search.

## Driving it with drive.mjs

`accounts`: from `/validators`, open the first validator, click its
self-delegate address, and wait for what only the loaded page shows: the
address, `Unclaimed delegation rewards`, and no skeleton left in `main`.
The journey fails if the page shows the error boundary (`Something went
wrong`).

## Gotchas

- `loading.tsx` draws the same headings (`Balances`, `Delegated`,
  `Rewards`) over skeletons, so a check that waits for a heading passes on
  the loading state and photographs a skeleton. Wait for data.
- A malformed address (a bad bech32 checksum) gets the generic error
  boundary, `Something went wrong`, from a 502 the GraphQL action raises,
  not an "invalid address" state. Drive real addresses taken from links;
  never type one by hand.
- Transaction pages link EVM-style `0x…` accounts as well as `ethm1…`.
- The loading skeleton (`loading.tsx`) draws a `Recent Transactions` card
  the finished page never renders, so a section appears and then goes.
  Read the page once its data shows, not while it loads.
