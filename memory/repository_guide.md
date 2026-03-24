---
name: repository-guide
description: Canonical repository guide for architecture, commands, topology, and local development
type: project
---

# Repository Guide

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
- Dependabot monitors GitHub Actions, npm, and Go modules.
