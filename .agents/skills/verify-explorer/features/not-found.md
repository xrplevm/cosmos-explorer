# Not found

What a detail route shows for something that does not exist.

## Sub-features

- `/blocks/<height>` past the chain head: `Block not found`, an
  explanation, and `Back to Blocks`.

## How to get to it (user POV)

A stale link, a mistyped URL, or a height the indexer has not reached.

## Driving it with drive.mjs

`not-found`: load `/blocks/999999999999` (the one journey that uses a
made-up URL, since that is the feature) and wait for `Block not found` and
`Back to Blocks`. Its report line records the HTTP status.

## Gotchas

- It answers HTTP 200, not 404 (a soft 404): crawlers index it as a page.
  The journey records the status rather than failing on it; change that
  when the app returns 404.
