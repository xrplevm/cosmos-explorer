# AGENTS.md

Repository instructions for coding agents working in this repo.

## Summary

This is a Turborepo monorepo for a Cosmos-style explorer. The current implementation is centered on:

- `apps/explorer` as the production app
- `packages/core` for domain contracts
- `packages/adapters/callisto` for chain data services
- `packages/price` for price data
- `packages/utils` for shared runtime helpers

## Commands

```bash
pnpm install
pnpm dev
pnpm dev:explorer
pnpm dev:playground
pnpm build
pnpm typecheck
pnpm lint
pnpm clean
```

Prefer targeted package commands when possible:

```bash
pnpm --filter @cosmos-explorer/core build
pnpm --filter @cosmos-explorer/callisto typecheck
pnpm --filter @cosmos-explorer/explorer typecheck
```

## Boundaries

### `packages/core`

- Keep it UI-agnostic.
- Keep it transport-agnostic.
- Organize by domain.
- Use plain type names for domain models.
- Use `I...Service` names for interfaces.

### `packages/adapters/callisto`

- Keep GraphQL queries, transport types, and mapping logic here.
- Do not leak GraphQL response shapes into app code.
- Convert all external data into `core` types.

### `packages/price`

- Keep price logic outside Callisto unless the source truly becomes Callisto-specific.

### `apps/explorer`

- Consume services from `src/lib/services.ts`.
- Avoid direct GraphQL usage in pages and components.
- Default to server-side data access unless a client-side requirement is explicit.

## Editing Rules

- Prefer `rg` for search.
- Use `apply_patch` for edits.
- Keep changes minimal and scoped.
- Do not rename architectural concepts casually; keep naming aligned with the current plan and docs.

## Verification

When changing shared contracts or adapters:

1. Build `@cosmos-explorer/core`.
2. Typecheck the affected package.
3. Typecheck `@cosmos-explorer/explorer` if app-facing contracts changed.

Typical sequence:

```bash
pnpm --filter @cosmos-explorer/core build
pnpm --filter @cosmos-explorer/callisto typecheck
pnpm --filter @cosmos-explorer/explorer typecheck
```

## Current Notes

- The explorer is configured by `apps/explorer/chain.json`.
- The current chain is XRPL EVM Sidechain testnet.
- The GraphQL endpoint is Callisto-backed Hasura.
- Price rows may be absent upstream. Treat that as a data availability issue, not automatically as an app bug.
