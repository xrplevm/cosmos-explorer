---
name: repo-topology
description: Current monorepo topology and package boundaries, including Callisto and Juno
type: project
---

The repository is a Turborepo monorepo for a Cosmos-style explorer.

Current high-level structure:

- `apps/explorer`: production Next.js explorer app
- `apps/playground`: UI playground app
- `apps/callisto`: executable Go indexer application
- `packages/juno`: reusable Go indexing library used by Callisto
- `packages/adapters/callisto`: TypeScript adapter layer over Callisto/Hasura GraphQL
- `packages/core`: UI-agnostic, transport-agnostic domain contracts

Go-specific guidance:

- `apps/callisto` owns runtime composition, schema, app commands, and chain-specific execution.
- `packages/juno` owns reusable parser, node, module, logging, and database primitives.
- A local `go.work` file at the repo root may be used to resolve `packages/juno` from `apps/callisto`.

Verification guidance:

- For Juno-only changes, start with `cd packages/juno && go test ./...`.
- For Callisto changes, use `cd apps/callisto && make test-unit` or the narrowest relevant target.
- For app-facing TypeScript contract changes, also verify `pnpm --filter @cosmos-explorer/explorer typecheck`.
