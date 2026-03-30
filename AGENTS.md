# AGENTS.md

## Summary

This repository is a Turborepo monorepo for a Cosmos-style blockchain explorer targeting the XRPL EVM Sidechain testnet.

High-level structure:

- `apps/explorer`: production Next.js 16 app
- `apps/playground`: UI playground app
- `apps/callisto`: executable Go indexer application
- `packages/adapters/callisto`: TypeScript adapter layer backed by Callisto/Hasura GraphQL
- `packages/core`: domain contracts and service interfaces
- `packages/config`: chain config schema and validation
- `packages/utils`: shared runtime helpers
- `packages/ui`: shared UI components
- `packages/price`: price service
- `packages/juno`: reusable Go indexing library
- `packages/eslint-config`: shared ESLint flat configs

## Stack

- Monorepo: Turborepo + pnpm
- Frontend: Next.js 16 + React 19
- UI: Tailwind CSS v4 + shadcn/ui
- Data store: PostgreSQL
- GraphQL: Hasura on top of Callisto data
- Go indexing: Callisto app + Juno library

## Commands

Root commands:

```bash
pnpm install
pnpm dev
pnpm dev:explorer
pnpm dev:playground
pnpm dev:callisto
pnpm build
pnpm typecheck
pnpm lint
pnpm clean
```

Targeted package commands:

```bash
pnpm --filter @cosmos-explorer/core build
pnpm --filter @cosmos-explorer/explorer typecheck
pnpm --filter @cosmos-explorer/callisto-app build
pnpm --filter @cosmos-explorer/juno test
```

Direct Go commands:

```bash
cd apps/callisto && make build
cd apps/callisto && make lint
cd apps/callisto && make test-unit

cd packages/juno && go build ./...
cd packages/juno && golangci-lint run ./...
cd packages/juno && go test ./...
```

## Running Callisto Locally

First-time PostgreSQL setup:

```bash
docker run --name callisto-db \
  -e POSTGRES_USER=callisto -e POSTGRES_PASSWORD=password -e POSTGRES_DB=callisto \
  -p 5432:5432 -v ./apps/callisto/database/schema:/docker-entrypoint-initdb.d \
  -d postgres
```

Then:

```bash
pnpm start:callisto-db
pnpm build:callisto
pnpm start:callisto
```

Callisto configuration lives at `~/.callisto/config.yaml`. A local `go.work` file at the repo root can be used to resolve `packages/juno` from `apps/callisto` during development.

## Topology And Boundaries

- `apps/callisto` is the runtime application layer for the Go indexer.
- `packages/juno` is the reusable Go library layer.
- Keep generic parser, node, module, logging, and database primitives in Juno.
- Keep chain-specific runtime composition, schema ownership, and executable behavior in Callisto.
- Keep `packages/core` UI-agnostic and transport-agnostic.
- Do not leak GraphQL response shapes outside `packages/adapters/callisto`.
- Keep `packages/price` separate unless price data becomes Callisto-specific.
- In the explorer app, consume services from `apps/explorer/src/lib/services.ts` instead of raw GraphQL.

## Explorer Surface

Routes currently implemented by the explorer:

| Route | Description |
|-------|-------------|
| `/` | Dashboard with chain stats, blocks, and transactions |
| `/blocks` | Paginated block list |
| `/blocks/[height]` | Block detail |
| `/transactions` | Paginated transaction list |
| `/transactions/[hash]` | Transaction detail with variant dispatch |
| `/validators` | Validator list |
| `/validators/[address]` | Validator detail |
| `/account/[address]` | Account detail |
| `/proposals` | Governance proposal list |
| `/proposals/[id]` | Proposal detail |

Transaction details use explicit per-message variants under `apps/explorer/src/components/transaction-details/messages/`.

## Chain Configuration

The current deployment is configured through `apps/explorer/chain.json`.

- Chain: XRPL EVM Sidechain
- Environment: testnet
- Adapter: `callisto`
- GraphQL endpoint: `https://governance.testnet.xrplevm.org/v1/graphql`

## Agent Working Rules

### Editing Rules

- Keep changes minimal and scoped.
- Do not rename architectural concepts casually.
- Prefer targeted verification over repo-wide commands when possible.
- Do not treat Juno as an external dependency only; it now lives inside this monorepo.

### Search And Navigation

Key files:

- `apps/explorer/chain.json`
- `apps/explorer/src/lib/services.ts`
- `apps/explorer/src/lib/formatters.ts`
- `apps/explorer/src/lib/cosmos-message-address.ts`
- `apps/explorer/src/lib/ethereum-message-decode.ts`
- `packages/core/src/index.ts`
- `packages/adapters/callisto/src/mappers.ts`
- `apps/callisto/cmd/callisto/main.go`
- `packages/juno/cmd/juno/main.go`

### Linting

Shared ESLint config lives in `packages/eslint-config/`.

- `base.js`: pure TypeScript packages
- `react.js`: React component packages
- `next.js`: Next.js apps

Rules to keep in mind:

- Use `import { type X }` for type-only imports.
- Prefer `??` over `||` when nullish semantics are intended.
- Use `T[]` instead of `Array<T>`.
- Use `interface` instead of object `type` aliases where the rule requires it.
- Do not set `project` alongside `projectService: true`.

Next.js 16 removed `next lint`. The apps use `eslint .` directly.

### Explorer Data Boundaries

- Blocks, transactions, validators, proposals, and accounts come through the Callisto service layer.
- Price is fetched through `packages/price`.
- Missing price rows are not automatically an app bug.
- Prefer server-side reads unless client interactivity requires otherwise.

### Transaction Detail Variants

The transaction detail page uses the explicit variant pattern.

Structure:

```text
apps/explorer/src/components/transaction-details/
├── messages/
├── shared/
├── transaction-detail-root.tsx
├── types.ts
└── index.ts
```

Each message type variant has its own folder. To add one:

1. Create `messages/<name>/index.tsx`.
2. Create `messages/<name>/<name>-overview-card.tsx`.
3. Add the dispatch case in `transaction-detail-root.tsx`.
4. Export it from `index.ts`.

`formatMessageType()` strips the `Msg` prefix from protobuf type URLs before dispatch.

### Error Handling

Always include error handling when implementing any feature. Do not defer it to a polish phase. Every hook, adapter method, page, and component must handle and surface errors. No silent failures. No empty catch blocks. Error states are first-class citizens alongside loading and success states.

## Verification

When changing shared TypeScript contracts or adapters:

1. Build `@cosmos-explorer/core`.
2. Typecheck the affected package.
3. Typecheck `@cosmos-explorer/explorer` if app-facing contracts changed.

```bash
pnpm --filter @cosmos-explorer/core build
pnpm --filter @cosmos-explorer/callisto-app build
pnpm --filter @cosmos-explorer/juno test
pnpm --filter @cosmos-explorer/explorer typecheck
```

When changing Go indexer code:

1. Run the narrowest relevant command in `packages/juno`.
2. Run the narrowest relevant command in `apps/callisto` if the library change affects the app.
3. Prefer `go test ./...` in `packages/juno` and `make test-unit` in `apps/callisto` before broader repo checks.

## CI And Tooling

- `turbo.json` orchestrates build, lint, typecheck, test, and dev tasks across TypeScript and Go packages.
- Go projects expose `package.json` wrappers so Turbo can run them like the rest of the monorepo.
- `.github/workflows/lint.yml` runs TypeScript lint plus Go lint.
- `.github/workflows/test.yml` runs TypeScript build/typecheck plus Go unit tests.

## Current Notes

- Next.js apps use webpack bundler in this repo.
- The explorer is configured by `apps/explorer/chain.json`.
- The current chain is XRPL EVM Sidechain testnet.
- The GraphQL endpoint is Callisto-backed Hasura.
- Older references to `packages/hooks`, `packages/adapters/xrplevm`, `apps/storybook`, or `IChainDataSource` are outdated.
