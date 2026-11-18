# Explorer feature map

One file per user-facing feature. Each says what the feature is, how a
person reaches it, how `scripts/drive.mjs` drives it (the journey of the
same name) and what end state proves it works. Keep this index, the files
and the journeys in step: a page added to `apps/explorer/src/app/` gets a
file here and a journey in the same change.

| Feature | Route(s) | Journey |
|---|---|---|
| [Overview](overview.md) | `/` | `overview` |
| [Blocks](blocks.md) | `/blocks`, `/blocks/[height]` | `blocks` |
| [Transactions](transactions.md) | `/transactions`, `/transactions/[hash]` | `transactions` |
| [Validators](validators.md) | `/validators`, `/validators/[address]` | `validators` |
| [Accounts](accounts.md) | `/account/[address]` | `accounts` |
| [Proposals](proposals.md) | `/proposals`, `/proposals/[id]` | `proposals` |
| [Consensus](consensus.md) | `/consensus` | `consensus` |
| [Search](search.md) | the header search box | `search` |
| [Not found](not-found.md) | a detail route for something that does not exist | `not-found` |
