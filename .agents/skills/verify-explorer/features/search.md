# Search

The header search box (`Search block, tx, address...`), on every page.

## Sub-features

- A block height opens `/blocks/<height>`.
- A Cosmos tx hash opens `/transactions/<hash>`.
- An `ethm1…` address opens `/account/<address>`.

## How to get to it (user POV)

Type into the box in the header and press Enter.

## Driving it with drive.mjs

`search`: takes a real height from `/blocks`, a real hash from
`/transactions` and a real address from a validator's page, searches each
from `/`, and checks it lands on the matching detail page with its content
(`Block Hash`, `Transaction Details`, `Balances`).

## Gotchas

- The block and transaction lists also have their own boxes (`Height or
  hash...`, `Search by tx hash...`); this journey covers the header one.
