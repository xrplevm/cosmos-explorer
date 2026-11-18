# Overview

The landing page: chain stats, active proposals, the latest blocks and the
latest transactions, refreshed every 5 seconds over the GraphQL websocket.

## Sub-features

- Stats cards; the active proposals widget; latest blocks and transactions
  tables, each row linking to its detail page.

## How to get to it (user POV)

Open the site, or click **Overview** in the sidebar.

## Driving it with drive.mjs

`overview`: load `/`, wait for the `Overview` heading, then for at least one
`/blocks/<height>` and one `/transactions/<hash>` link. Proves the page
rendered with live data, not just its skeletons.

## Gotchas

- The page streams through Suspense; a cold first render takes 10 to 20
  seconds. Wait on content, never on a fixed delay.
- The 5-second refresh keeps rewriting the tables, so read a link's `href`
  just before clicking it.
