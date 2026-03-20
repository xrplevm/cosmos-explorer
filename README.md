# Cosmos Explorer

A Turborepo monorepo for a Cosmos blockchain explorer. The current deployment targets the **XRPL EVM Sidechain testnet**.

## Stack

| Layer | Technology |
|---|---|
| Monorepo | Turborepo + pnpm |
| Apps | Next.js 15 + React 19 |
| UI | Tailwind CSS v4 + shadcn/ui |
| Domain | TypeScript contracts in `packages/core` |
| Chain data | Callisto / Hasura GraphQL via `packages/adapters/callisto` |
| Price data | `packages/price` |

## Repository Layout

```text
apps/
  explorer/          Main Next.js explorer app
  playground/        UI playground app

packages/
  adapters/
    callisto/        Callisto-backed chain services
  config/            Chain config schema and validation
  core/              Domain types and service interfaces
  eslint-config/     Shared ESLint 9 flat configs
  price/             Price service implementation
  ui/                Shared UI components
  utils/             Shared helpers, errors, fetcher
```

## Architecture

The repo is split by domain and service boundaries.

- **`packages/core`** — transport-independent domain contracts (types, service interfaces, enums). Zero runtime code.
- **`packages/utils`** — shared runtime helpers: base fetcher, error factories/guards, keybase avatar resolution.
- **`packages/adapters/callisto`** — translates Callisto/Hasura GraphQL responses into core domain types.
- **`packages/price`** — price service, separate from Callisto because price is not a Callisto-specific concern.
- **`packages/config`** — Zod-validated chain configuration schema.
- **`packages/ui`** — shadcn/ui components with Tailwind CSS v4.
- **`apps/explorer`** — composes services on the server in `src/lib/services.ts` and renders pages.

## Explorer Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard: stats cards, latest blocks, latest transactions |
| `/blocks` | Paginated block list |
| `/blocks/[height]` | Block detail with transactions |
| `/transactions` | Paginated transaction list |
| `/transactions/[hash]` | Transaction detail with type-specific variant view |
| `/validators` | Validator list with voting power |
| `/validators/[address]` | Validator detail |
| `/account/[address]` | Account balances, delegations, and transactions |
| `/proposals` | Governance proposal list |
| `/proposals/[id]` | Proposal detail with tally results |

### Transaction Detail Variants

The transaction detail page renders a **dedicated component per Cosmos message type** (~43 variants covering Cosmos SDK, IBC, and custom messages). Each variant displays type-specific fields alongside common transaction metadata. Unknown types fall back to a generic JSON view.

## Getting Started

Prerequisites:

- Node.js 20+
- pnpm 9+

```bash
pnpm install
pnpm dev
```

## Commands

```bash
pnpm dev              # Start all apps in dev mode
pnpm dev:explorer     # Start only the explorer
pnpm dev:playground   # Start only the playground
pnpm build            # Build all packages and apps
pnpm typecheck        # Type-check everything
pnpm lint             # Lint everything
pnpm clean            # Clean build artifacts
```

Package-specific:

```bash
pnpm --filter @cosmos-explorer/core build
pnpm --filter @cosmos-explorer/callisto typecheck
pnpm --filter @cosmos-explorer/explorer typecheck
pnpm --filter @cosmos-explorer/explorer lint --fix
```

## Chain Configuration

The explorer is configured by `apps/explorer/chain.json`.

Current config:

- **Chain**: XRPL EVM Sidechain
- **Environment**: testnet
- **Adapter**: `callisto`
- **GraphQL endpoint**: `https://governance.testnet.xrplevm.org/v1/graphql`

## Turbo Pipeline

- `build` depends on `^build`
- `typecheck` depends on `^build`
- `lint` depends on `^build`
- `dev` is persistent and uncached

## Development Rules

- Keep `packages/core` free of UI and transport concerns.
- Keep GraphQL transport shapes inside adapter packages.
- Map external responses into domain types before they cross package boundaries.
- Pages consume services, not raw GraphQL.
- Prefer server-side data access unless there is a concrete client-side requirement.
