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

## Skills

Skills live in `.agents/skills/<name>/`; `.claude/skills/<name>` is a relative symlink to each one, so every agent finds the same files. Keep the two in step: a skill added, renamed or removed changes both, and a symlink must never point at a missing directory.

- **Project skills** are written for this repo and edited here: `verify-explorer`.
- **Vendored skills** come from other repositories and are pinned in `skills-lock.json` (source and content hash): `grilling`, `turborepo`, `vercel-composition-patterns`, `vercel-react-best-practices`, `web-design-guidelines`. Update them from their source rather than editing them in place, so the lock stays true.

For Next.js itself there is no skill: read the docs bundled with the installed version, `node_modules/next/dist/docs/` (resolve it from `apps/explorer` with `node -p "require.resolve('next/package.json')"`), which match the version the explorer runs. Upgrade Next.js with `npx @next/codemod@latest upgrade`.

A skill with scripts carries its own evals; run them after changing it (for `verify-explorer`: `node --test .agents/skills/verify-explorer/evals/scripts.test.mjs`).

## Verification

Run focused checks first. Before handoff, report what ran and any checks that could not run. Never use destructive Git commands to discard unrelated work.

For a change the explorer shows (`apps/explorer`, the TypeScript packages it uses, its Docker image or the Node version), also run the `verify-explorer` skill: it builds the explorer as production does, drives its pages against a real network and keeps screenshots as evidence. It does not cover the indexer (`apps/callisto`, `packages/juno`), whose changes are verified by their Go checks.
