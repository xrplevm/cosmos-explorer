# Cosmos Explorer Agent Guide

## Repository

This is a pnpm/Turborepo monorepo for the XRPL EVM Sidechain Cosmos explorer.

- `apps/explorer`: Next.js 16 explorer
- `apps/playground`: UI playground
- `apps/callisto`: Go indexer application
- `packages/core`: transport- and UI-independent domain contracts
- `packages/adapters/callisto`: Callisto/Hasura GraphQL adapter
- `packages/juno`: reusable Go indexer library
- `packages/{config,price,ui,utils}`: shared TypeScript packages

Use Node.js 22+, pnpm 9+, and Go 1.23+.

## Working Rules

- Keep changes minimal and scoped; preserve existing architectural names and boundaries.
- Keep GraphQL response shapes inside `packages/adapters/callisto`; map them to core types before exposing them.
- Keep `packages/core` free of UI and transport concerns.
- Access explorer data through services composed in `apps/explorer/src/lib/services.ts`.
- Prefer server-side data access unless interactivity requires a client component.
- Treat loading, empty, and error states as first-class behavior; never swallow errors.
- Keep chain-specific runtime behavior in Callisto and reusable indexing primitives in Juno.
- Follow existing transaction-message variants under `apps/explorer/src/components/transaction-details/messages/`.
- Do not commit secrets or generated build output.

## Commands

```bash
pnpm install
pnpm dev:explorer
pnpm build
pnpm typecheck
pnpm lint
pnpm test
```

For Go changes, run the narrowest relevant checks in `apps/callisto` or `packages/juno`, then expand as needed. For TypeScript changes, build/typecheck the affected package and any downstream app. Copy `apps/explorer/.env.example` to `.env` for local development.

## Verification

Run focused checks first. Before handoff, report what ran and any checks that could not run. Never use destructive Git commands to discard unrelated work.
