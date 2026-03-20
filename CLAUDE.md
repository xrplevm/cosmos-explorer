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

Turbo config is in `turbo.json`. `typecheck` and `lint` depend on `^build`.

## Linting

Shared ESLint 9 flat config lives in `packages/eslint-config/`. Three composable configs:

- `@cosmos-explorer/eslint-config/base` — TypeScript strict rules (`strict-type-checked` + `stylistic-type-checked`), for pure TS packages
- `@cosmos-explorer/eslint-config/react` — extends base, adds `react-hooks` rules, for `packages/ui` and hooks
- `@cosmos-explorer/eslint-config/next` — extends react, adds `@next/next` rules, for `apps/*`

Each package has its own `eslint.config.mjs` that spreads the right shared config. `projectService: true` auto-discovers the nearest `tsconfig.json` — do not set `project` alongside it. Run `eslint . --fix` to auto-fix stylistic violations.

## Package Layout

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
packages/eslint-config Shared ESLint flat configs
```

Older references to `hooks`, `hasura`, `xrplevm adapter`, `storybook`, or a single `IChainDataSource` contract are outdated for this repo state.

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

- Service composition happens in `apps/explorer/src/lib/services.ts`.
- Pages should consume services, not raw GraphQL.
- Prefer server-side reads over adding client hooks unless there is a concrete need.

### Transaction Detail Variants

Transaction details follow the **explicit variant pattern**: one self-contained component per message type.

```text
apps/explorer/src/components/transaction-details/
├── messages/              # One folder per message type (~43 variants)
│   ├── default/           # Fallback for unknown types
│   ├── ethereum/          # EthereumTx (both ethermint and cosmos.evm)
│   ├── send/              # Cosmos bank Send
│   ├── delegate/          # Cosmos staking Delegate
│   ├── vote/              # Cosmos governance Vote
│   ├── transfer/          # IBC Transfer
│   └── ...                # All other Cosmos SDK, IBC, and custom types
├── shared/                # Reusable primitives (header, detail-row, overview card, data section)
├── transaction-detail-root.tsx   # Switch dispatch by message type
├── transaction-data-json-tabs.tsx
├── transaction-data-payload.ts
├── types.ts
└── index.ts               # Barrel exports
```

Each variant folder contains:
- `index.tsx` — composes `TransactionDetailHeader` + type-specific overview card + `DefaultTransactionDataSection`
- `*-overview-card.tsx` — type-specific fields plus base transaction rows (hash, status, block, timestamp, fee, gas, memo)

Message type resolution: the Callisto adapter's `formatMessageType()` strips the `Msg` prefix from the last segment of the protobuf type URL (e.g., `/cosmos.staking.v1beta1.MsgDelegate` → `Delegate`). The `TransactionDetailRoot` switch dispatches on this short name.

To add a new variant:
1. Create `messages/<type-name>/index.tsx` and `messages/<type-name>/<type-name>-overview-card.tsx`
2. Add a `case` in `transaction-detail-root.tsx`
3. Add barrel exports in `index.ts`

## Working Conventions

- Prefer `rg` and `rg --files` for search.
- Avoid destructive git commands unless explicitly requested.
- Do not revert unrelated user changes.
- Build or typecheck the smallest affected package set first, then verify the app package if the change crosses boundaries.

## Current Explorer Data Boundaries

- Blocks, transactions, validators, proposals, and accounts are connected through the Callisto service layer.
- Price is fetched through `packages/price`.
- The home overview reads composed stats from the service layer.
- Upstream price data may be missing even when the app wiring is correct.

## Useful Files

- `apps/explorer/chain.json`
- `apps/explorer/src/lib/services.ts`
- `apps/explorer/src/lib/formatters.ts`
- `packages/core/src/index.ts`
- `packages/adapters/callisto/src/index.ts`
- `plan.md`
