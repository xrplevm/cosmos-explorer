# Blocks

The block list and a block's detail: height, hash, timestamp, proposer,
pre-commits and its transactions.

## Sub-features

- `/blocks`: table of Height, Block Hash, Txs, Proposer, Time.
- `/blocks/[height]`: overview card and the block's transactions table.

## How to get to it (user POV)

Click **Blocks** in the sidebar, then a height in the table.

## Driving it with drive.mjs

`blocks`: from `/`, click the sidebar's Blocks link, wait for the `Blocks`
heading, click the first height, and wait for `#<height>` (formatted with
thousands separators, e.g. `#8,660,158`) and `Block Hash`.

## Gotchas

- Navigation is client-side: wait for the URL to change
  (`page.waitForURL`), not for `networkidle`, which can settle before the
  route does.
- Most blocks have 0 transactions; that is a correct state, not an empty
  page.
