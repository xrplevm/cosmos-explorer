# AGENTS.md

Repository instructions for coding agents working in this repo.

## Summary

This is a Turborepo monorepo for a Cosmos-style blockchain explorer. The current deployment targets the XRPL EVM Sidechain testnet.

- `apps/explorer` — production Next.js 16 app (webpack bundler)
- `apps/playground` — UI playground Next.js 16 app (webpack bundler)
- `apps/callisto` — Go indexer app (Callisto)
- `packages/core` — domain contracts (types, service interfaces)
- `packages/adapters/callisto` — Callisto/Hasura GraphQL chain services (TypeScript)
- `packages/price` — price data service
- `packages/config` — chain config schema and validation
- `packages/utils` — shared runtime helpers (fetcher, errors, keybase)
- `packages/ui` — shared UI components (shadcn/ui + Tailwind)
- `packages/juno` — Go library (Juno)
- `packages/eslint-config` — shared ESLint 9 flat configs

Go packages have `package.json` wrappers for Turbo orchestration. Go requires Go 1.23+ and `golangci-lint`.

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

Go commands (requires Go 1.23+ and `golangci-lint`):

```bash
cd apps/callisto && make build
cd apps/callisto && make lint
cd apps/callisto && make test-unit
```

### Running Callisto locally

First-time database setup:

```bash
docker run --name callisto-db \
  -e POSTGRES_USER=callisto -e POSTGRES_PASSWORD=password -e POSTGRES_DB=callisto \
  -p 5432:5432 -v ./apps/callisto/database/schema:/docker-entrypoint-initdb.d \
  -d postgres
```

Then to run:

```bash
pnpm start:callisto-db   # Start the PostgreSQL container
pnpm build:callisto      # Build the binary
pnpm start:callisto      # Start the indexer
```

Config: `~/.callisto/config.yaml` (points to XRPL EVM Sidechain testnet by default). A `go.work` file (gitignored) at the repo root enables local resolution of the `packages/juno` dependency.

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
- `formatMessageType()` strips `Msg` prefix from protobuf type URLs (e.g., `MsgDelegate` → `Delegate`).

### `packages/price`

- Keep price logic outside Callisto unless the source truly becomes Callisto-specific.

### `apps/explorer`

- Consume services from `src/lib/services.ts`.
- Avoid direct GraphQL usage in pages and components.
- Default to server-side data access unless a client-side requirement is explicit.

## Transaction Detail Architecture

The transaction detail page uses the **explicit variant pattern** — one self-contained component per Cosmos message type.

```text
src/components/transaction-details/
├── messages/                     # ~43 variant folders
│   ├── default/                  # Fallback for unknown message types
│   ├── ethereum/                 # EthereumTx (ethermint + cosmos.evm)
│   ├── send/                     # Bank: Send
│   ├── delegate/                 # Staking: Delegate
│   ├── vote/                     # Governance: Vote
│   ├── transfer/                 # IBC Transfer
│   └── ...
├── shared/                       # Reusable primitives
│   ├── detail-row.tsx
│   ├── transaction-detail-header.tsx
│   ├── transaction-overview-card.tsx
│   ├── transaction-data-section.tsx
│   └── default-transaction-data-section.tsx
├── transaction-detail-root.tsx   # Switch dispatch
├── types.ts                      # Props, getPrimaryMessageType()
└── index.ts                      # Barrel exports
```

Each variant folder has:
- `index.tsx` — composition: header + overview card + data section
- `*-overview-card.tsx` — type-specific fields + base rows (hash, status, block, timestamp, fee, gas %, memo)

**To add a new message type variant:**
1. Create `messages/<name>/index.tsx` and `messages/<name>/<name>-overview-card.tsx`
2. Add `case "<ShortType>":` in `transaction-detail-root.tsx`
3. Export from `index.ts`

## Explorer Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard: stats cards + latest blocks + latest transactions |
| `/blocks` | Paginated block list |
| `/blocks/[height]` | Block detail |
| `/transactions` | Paginated transaction list |
| `/transactions/[hash]` | Transaction detail (variant dispatch) |
| `/validators` | Validator list |
| `/validators/[address]` | Validator detail |
| `/account/[address]` | Account detail (balances, delegations, transactions) |
| `/proposals` | Governance proposal list |
| `/proposals/[id]` | Proposal detail |

## Linting

### Shared config

ESLint is configured via `packages/eslint-config/` with three tiers:

| File | Used by |
|------|---------|
| `base.js` | Pure TypeScript packages (`core`, `utils`, `price`) |
| `react.js` | React component packages (`ui`) |
| `next.js` | Next.js apps (`explorer`, `playground`) |

Each package/app has its own `eslint.config.mjs` that spreads the relevant tier.

### Key rules

- `@typescript-eslint/strict-type-checked` + `stylistic-type-checked`
- `consistent-type-imports` — always use `import { type X }`
- `no-floating-promises` / `no-misused-promises`
- `prefer-nullish-coalescing` — use `??` not `||`
- `array-type` — use `T[]` not `Array<T>`
- `consistent-type-definitions` — use `interface` not `type` for object types

### Running lint

```bash
pnpm lint                                          # All packages
pnpm --filter @cosmos-explorer/explorer lint        # Single package
pnpm --filter @cosmos-explorer/explorer lint --fix  # Auto-fix
```

**Do not set `project`** alongside `projectService: true` — `projectService` auto-discovers `tsconfig.json`; setting both causes a conflict error.

## Editing Rules

- Keep changes minimal and scoped.
- Do not rename architectural concepts casually; keep naming aligned with the current plan and docs.

## Verification

When changing shared contracts or adapters:

1. Build `@cosmos-explorer/core`.
2. Typecheck the affected package.
3. Typecheck `@cosmos-explorer/explorer` if app-facing contracts changed.

```bash
pnpm --filter @cosmos-explorer/core build
pnpm --filter @cosmos-explorer/callisto typecheck
pnpm --filter @cosmos-explorer/explorer typecheck
```

## Key Files

| File | Purpose |
|------|---------|
| `apps/explorer/chain.json` | Chain configuration for deployment |
| `apps/explorer/src/lib/services.ts` | Service composition (DI root) |
| `apps/explorer/src/lib/formatters.ts` | Display formatters (timestamp, coin, price, etc.) |
| `apps/explorer/src/lib/cosmos-message-address.ts` | Extract addresses from message values |
| `apps/explorer/src/lib/ethereum-message-decode.ts` | Decode EVM transaction data |
| `packages/core/src/index.ts` | Core domain type exports |
| `packages/adapters/callisto/src/mappers.ts` | GraphQL → core type mappers |
| `plan.md` | Original implementation plan |

## CI

GitHub Actions workflows in `.github/workflows/`:

- **`lint.yml`** — TypeScript lint + Go lint (gated on `.go`/`.mod`/`.sum` diffs)
- **`test.yml`** — TypeScript build & typecheck + Go unit tests with coverage

Dependabot monitors `github-actions`, `npm`, and `gomod` weekly.

## Current Notes

- Next.js apps use webpack bundler (`--webpack` flag) due to Turbopack incompatibilities with `next-themes` and `@tabler/icons-react`.
- `next lint` was removed in Next.js 16. Both apps use `eslint .` directly with `{ ignores: ['.next/**', 'next.config.ts'] }`.
- The explorer is configured by `apps/explorer/chain.json`.
- The current chain is XRPL EVM Sidechain testnet.
- The GraphQL endpoint is Callisto-backed Hasura.
- Price rows may be absent upstream. Treat that as a data availability issue, not automatically as an app bug.
- Older references to `packages/hooks`, `packages/adapters/xrplevm`, `apps/storybook`, or `IChainDataSource` are outdated — these do not exist in the current repo.
