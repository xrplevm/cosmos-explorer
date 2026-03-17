# Cosmos Explorer

Cosmos Explorer is a Turborepo monorepo for a chain explorer UI and the service packages that feed it. The current app target in this repository is the XRPL EVM Sidechain testnet explorer.

## Current Stack

| Layer | Technology |
|---|---|
| Monorepo | Turborepo + pnpm |
| Apps | Next.js 15 + React 19 |
| UI | Tailwind CSS v4 + shadcn/ui |
| Contracts | TypeScript domain contracts in `packages/core` |
| Chain data | Callisto / Hasura GraphQL |
| Price data | Separate price package |

## Repository Layout

```text
apps/
  explorer/      Main Next.js explorer app
  playground/    UI playground app

packages/
  adapters/
    callisto/    Callisto-backed chain services
  config/        Chain config schema and validation
  core/          Domain types and service interfaces
  price/         Price service implementation
  ui/            Shared UI components
  utils/         Shared helpers, errors, fetcher

docs/            Architecture and migration notes
plan.md          Implementation plan
```

## Architecture

The repo is split by domain and service boundaries.

- `packages/core` contains transport-independent contracts only.
- `packages/utils` contains shared runtime helpers such as the base fetcher and error handling.
- `packages/adapters/callisto` translates GraphQL responses into core domain types.
- `packages/price` is separate from Callisto because price is not treated as a Callisto-specific concern.
- `apps/explorer` composes services on the server in `src/lib/services.ts` and renders pages from those services.

Current connected explorer pages include:

- `/`
- `/blocks`
- `/blocks/[height]`
- `/transactions`
- `/transactions/[hash]`
- `/validators`
- `/validators/[address]`
- `/account/[address]`
- `/proposals`
- `/proposals/[id]`

## Getting Started

Prerequisites:

- Node.js 20+
- pnpm 9+

Install and run:

```bash
pnpm install
pnpm dev
```

Useful commands:

```bash
pnpm dev:explorer
pnpm dev:playground
pnpm build
pnpm typecheck
pnpm lint
pnpm clean
```

Package-specific examples:

```bash
pnpm --filter @cosmos-explorer/core build
pnpm --filter @cosmos-explorer/callisto typecheck
pnpm --filter @cosmos-explorer/explorer typecheck
```

## Chain Configuration

The active explorer instance is configured by [apps/explorer/chain.json](/home/doctor/Documents/Peersyst/xrp/sidechain/cosmos-explorer/apps/explorer/chain.json).

Current config highlights:

- `adapterType`: `callisto`
- chain: `XRPL EVM Sidechain`
- environment: `testnet`
- GraphQL endpoint: `https://governance.testnet.xrplevm.org/v1/graphql`

## Turbo Notes

Tasks are package tasks, not root implementation scripts. Root scripts delegate to Turbo only.

- `build` depends on `^build`
- `typecheck` depends on `^build`
- `lint` depends on `^build`
- `dev` is persistent and uncached

In practice, if a downstream package reads another package’s built output, build `core` first or run the normal Turbo pipeline.

## Development Rules

- Keep `packages/core` free of UI concerns.
- Keep GraphQL transport shapes inside adapter packages.
- Map external responses into domain types before they cross package boundaries.
- Prefer package-local scripts with `pnpm --filter ...`.
- Use `rg` for search.
- Use `apply_patch` for file edits.

## Related Docs

- [plan.md](/home/doctor/Documents/Peersyst/xrp/sidechain/cosmos-explorer/plan.md)
- [docs/home.md](/home/doctor/Documents/Peersyst/xrp/sidechain/cosmos-explorer/docs/home.md)
- [docs/hasura-structure.md](/home/doctor/Documents/Peersyst/xrp/sidechain/cosmos-explorer/docs/hasura-structure.md)
