# CLAUDE.md

This file gives repository-specific guidance for Claude Code and similar coding agents.

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

Targeted commands:

```bash
pnpm --filter @cosmos-explorer/core build
pnpm --filter @cosmos-explorer/utils build
pnpm --filter @cosmos-explorer/callisto typecheck
pnpm --filter @cosmos-explorer/explorer typecheck
```

Turbo config is in [turbo.json](/home/doctor/Documents/Peersyst/xrp/sidechain/cosmos-explorer/turbo.json). `typecheck` and `lint` depend on `^build`.

## Linting

Shared ESLint 9 flat config lives in `packages/eslint-config/`. Three composable configs:

- `@cosmos-explorer/eslint-config/base` — TypeScript strict rules (`strict-type-checked` + `stylistic-type-checked`), for pure TS packages
- `@cosmos-explorer/eslint-config/react` — extends base, adds `react-hooks` rules, for `packages/ui` and hooks
- `@cosmos-explorer/eslint-config/next` — extends react, adds `@next/next` rules, for `apps/*`

Each package has its own `eslint.config.mjs` that spreads the right shared config. `projectService: true` auto-discovers the nearest `tsconfig.json` — do not set `project` alongside it. Run `eslint . --fix` to auto-fix stylistic violations.

## Actual Package Layout

```text
apps/explorer          Next.js explorer app
apps/playground        Next.js playground app

packages/core          Domain types and service interfaces
packages/config        Chain config schema
packages/utils         Shared helpers, fetcher, errors
packages/adapters/callisto
                       Callisto-backed chain services
packages/price         Price service implementation
packages/ui            Shared UI components
```

Older references to `hooks`, `hasura`, `xrplevm adapter`, or a single `IChainDataSource` contract are outdated for this repo state.

## Architecture Rules

### Core

- `packages/core` must stay transport-agnostic.
- Do not put page-level, home-level, or UI-specific types in `core`.
- Domain types should be named plainly: `Block`, `TransactionSummary`, `Price`, `ProposalDetail`.
- Service interfaces keep the `I` prefix: `IBlockService`, `IProposalService`, `IAccountService`.

### Adapters

- GraphQL queries, transport types, and mappers live inside `packages/adapters/callisto`.
- External transport shapes must be mapped to `core` types before crossing package boundaries.
- `packages/price` stays outside the Callisto adapter unless the data source genuinely becomes Callisto-specific.

### Explorer app

- Service composition happens in [apps/explorer/src/lib/services.ts](/home/doctor/Documents/Peersyst/xrp/sidechain/cosmos-explorer/apps/explorer/src/lib/services.ts).
- Pages should consume services, not raw GraphQL.
- Prefer server-side reads over adding client hooks unless there is a concrete need.

## Working Conventions

- Prefer `rg` and `rg --files` for search.
- Use `apply_patch` for manual file edits.
- Avoid destructive git commands unless explicitly requested.
- Do not revert unrelated user changes.
- Build or typecheck the smallest affected package set first, then verify the app package if the change crosses boundaries.

## Current Explorer Data Boundaries

- Blocks, transactions, validators, proposals, and accounts are connected through the Callisto service layer.
- Price is fetched through `packages/price`.
- The home overview reads composed stats from the service layer.
- Upstream price data may be missing even when the app wiring is correct.

## Useful Files

- [apps/explorer/chain.json](/home/doctor/Documents/Peersyst/xrp/sidechain/cosmos-explorer/apps/explorer/chain.json)
- [apps/explorer/src/lib/services.ts](/home/doctor/Documents/Peersyst/xrp/sidechain/cosmos-explorer/apps/explorer/src/lib/services.ts)
- [packages/core/src/index.ts](/home/doctor/Documents/Peersyst/xrp/sidechain/cosmos-explorer/packages/core/src/index.ts)
- [packages/adapters/callisto/src/index.ts](/home/doctor/Documents/Peersyst/xrp/sidechain/cosmos-explorer/packages/adapters/callisto/src/index.ts)
- [plan.md](/home/doctor/Documents/Peersyst/xrp/sidechain/cosmos-explorer/plan.md)
