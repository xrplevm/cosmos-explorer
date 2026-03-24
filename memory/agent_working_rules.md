---
name: agent-working-rules
description: Canonical working rules for coding agents in this repository
type: project
---

# Agent Working Rules

## Editing Rules

- Keep changes minimal and scoped.
- Do not rename architectural concepts casually.
- Prefer targeted verification over repo-wide commands when possible.
- Do not treat Juno as an external dependency only; it now lives inside this monorepo.

## Search And Navigation

- Prefer `rg` and `rg --files` for search.
- Key files:
  - `apps/explorer/chain.json`
  - `apps/explorer/src/lib/services.ts`
  - `apps/explorer/src/lib/formatters.ts`
  - `apps/explorer/src/lib/cosmos-message-address.ts`
  - `apps/explorer/src/lib/ethereum-message-decode.ts`
  - `packages/core/src/index.ts`
  - `packages/adapters/callisto/src/mappers.ts`
  - `apps/callisto/cmd/callisto/main.go`
  - `packages/juno/cmd/juno/main.go`
  - `plan.md`

## Linting

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

## Explorer Data Boundaries

- Blocks, transactions, validators, proposals, and accounts come through the Callisto service layer.
- Price is fetched through `packages/price`.
- Missing price rows are not automatically an app bug.
- Prefer server-side reads unless client interactivity requires otherwise.

## Transaction Detail Variants

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

## Current Notes

- Next.js apps use webpack bundler in this repo.
- The explorer is configured by `apps/explorer/chain.json`.
- The current chain is XRPL EVM Sidechain testnet.
- The GraphQL endpoint is Callisto-backed Hasura.
- Older references to `packages/hooks`, `packages/adapters/xrplevm`, `apps/storybook`, or `IChainDataSource` are outdated.
