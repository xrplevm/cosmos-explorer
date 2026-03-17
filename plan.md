# Cosmos Explorer — Implementation Plan

## Goals

- Build a Cosmos blockchain explorer from scratch
- Keep the existing backend; connect via a clean interface layer
- Easy to customize and deploy for any Cosmos chain
- Monorepo with clear package boundaries
- Shadcn-based design system with per-chain theming

---

## Monorepo Structure

```
cosmos-explorer/
├── apps/
│   ├── explorer/                  # Next.js 16 App Router
│   └── storybook/                 # Component explorer + visual testing
├── packages/
│   ├── core/                      # Pure TS interfaces — zero runtime deps
│   ├── config/                    # ChainConfig schema + Zod validation
│   ├── ui/                        # Shadcn design system + domain components
│   ├── hooks/                     # React hooks consuming IChainDataSource
│   ├── adapters/
│   │   ├── callisto/              # Generic Callisto/Hasura-backed GraphQL adapter
│   │   └── xrplevm/               # XRP EVM sidechain overrides
│   └── utils/                     # Pure format helpers (token, address, time)
├── turbo.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── package.json
```

---

## Package Dependency Graph

```
core (no deps)
  ↑
config   utils
  ↑         ↑
adapters/callisto
  ↑
adapters/xrplevm
  ↑
hooks ← core
  ↑
ui ← core
  ↑
apps/explorer ← all packages
apps/storybook ← ui, core
```

---

## Package Responsibilities

### `packages/core`

Pure TypeScript interfaces. Zero dependencies. Every other package depends on this.

**Naming rule:**

- service interfaces keep the `I` prefix
- domain model types do not use the `I` prefix

Examples:

- service interfaces: `IChainDataSource`, `IPriceService`
- domain types: `Block`, `Transaction`, `Price`, `Validator`

**Interfaces and types:**

- `Block`, `BlockDetail`
- `TransactionSummary`, `TransactionDetail`, `Message`
- `Validator`, `ValidatorDetail`, `ValidatorStatus`
- `Account`, `Delegation`, `Redelegation`
- `ChainStats`
- `Proposal`, `TallyResult`, `ProposalStatus`
- `TokenAmount`, `TokenPrice`
- `IChainDataSource` — the central seam between UI and backend
- `PaginationParams`, `PaginatedResult<T>`, `UnsubscribeFn`, `SearchResult`

**Domain error types (also in `packages/core/src/errors.ts`):**

`core` holds only the structural definitions — no runtime behavior:

```typescript
enum AppErrorCode {
  NOT_FOUND, NETWORK_ERROR, INVALID_INPUT, RATE_LIMIT, UPSTREAM_ERROR, UNKNOWN
}

type AppError = Error & { code: AppErrorCode; statusCode: number }
```

**`IChainDataSource` methods:**

```
getBlocks(params)                      → PaginatedResult<Block>
getBlockByHeight(height)               → BlockDetail | null
getLatestBlocks(limit, onData)         → UnsubscribeFn

getTransactions(params)                → PaginatedResult<TransactionSummary>
getTransactionByHash(hash)             → TransactionDetail | null
getTransactionsByBlock(height)         → TransactionSummary[]

getValidators()                        → Validator[]
getValidatorByAddress(address)         → ValidatorDetail | null

getAccount(address)                    → Account | null

getChainStats()                        → ChainStats
subscribeToChainStats(onData)          → UnsubscribeFn

getProposals(params)                   → PaginatedResult<Proposal>
getProposalById(id)                    → Proposal | null

search(query)                          → SearchResult
```

---

### `packages/config`

Chain configuration schema — Zod-validated at app startup.

**`ChainConfig` shape:**

```typescript
{
  adapterType: string;           // "callisto" | "xrplevm" | ...
  network: {
    chainId, chainName, chainEnv
    bech32Prefix, validatorPrefix, consensusPrefix
    primaryToken: { denom, displayDenom, exponent, coingeckoId? }
    votingPowerToken, additionalTokens
    genesis: { time, height }
    endpoints: { graphqlHttp, graphqlWs, cosmosRpc?, evmExplorer? }
  }
  branding: {
    title, logoPath, favicon?
    cssVariables: {
      light: CSSVariableOverrides   // Shadcn HSL CSS variables
      dark:  CSSVariableOverrides
    }
  }
  features: {
    proposals, accounts, validatorIdentity, evmSearch
  }
}
```

**Exports:** `loadChainConfig(raw)`, `validateChainConfig(raw)`, all types.

---

### `packages/utils`

Pure functions, no React, no external state. Only depends on `core` types.

- `formatToken(amount: TokenAmount)` — handles exponent math, locale formatting
- `formatAddress(address, options?)` — truncation, bech32 prefix detection
- `formatTimestamp(iso, format?)` — relative time, locale date, countdown
- `formatHash(hash, chars?)` — truncation helper
- `formatNumber(n)` — large numbers with commas / abbreviations

**Error scaffolding (also in `packages/utils/src/errors.ts`):**

All error behavior lives here. `utils` is the single source of truth for creating, checking, and displaying errors.

```typescript
// factory
createAppError(message, { code, statusCode?, cause? }): AppError

// domain factories
notFound(resource, identifier?)   → 404
networkError(message?, cause?)    → 503
invalidInput(message)             → 400
rateLimit()                       → 429
upstreamError(message, cause?)    → 502

// type guards
isAppError(error): error is AppError
hasErrorCode(error, code): error is AppError
isNotFoundError(e), isNetworkError(e), isInvalidInputError(e), isRateLimitError(e), isUpstreamError(e)

// display
formatErrorMessage(e): string   // user-safe, never exposes internals
```

Errors are checked by code, not by class. Adapters import factories from `utils`. Hooks surface them. UI displays them. Error handling is always present — never deferred.

---

### `packages/adapters/callisto`

Implements `IChainDataSource` against the Callisto-backed GraphQL backend.

**Structure:**

```
src/
├── client.ts              # Apollo Client factory (HTTP + WebSocket)
├── adapter.ts             # CallistoAdapter class
├── queries/
│   ├── blocks.graphql
│   ├── transactions.graphql
│   ├── validators.graphql
│   ├── account.graphql
│   ├── chain_stats.graphql
│   └── proposals.graphql
└── mappers/
    ├── block.mapper.ts
    ├── transaction.mapper.ts
    ├── validator.mapper.ts
    └── account.mapper.ts
```

Mappers translate raw GraphQL response types into core interfaces. GraphQL types never leave this package.

Raw Apollo/HTTP errors are caught inside the adapter and re-thrown as domain errors using the factories from `packages/utils`. A shared `mapApolloError(e)` utility inside the adapter handles this translation (network errors → `networkError()`, 429 → `rateLimit()`, etc.).

---

### `packages/adapters/xrplevm`

Extends `CallistoAdapter`. Overrides only what differs for the XRP EVM sidechain:

- `search()` — detects `0x...` EVM transaction hashes and routes to EVM explorer
- Any XRP EVM-specific field mappings

---

### `packages/hooks`

React hooks. No knowledge of GraphQL, REST, or specific backends. Receives `IChainDataSource` via context.

**Context:**

```typescript
DataSourceProvider  // wraps the app
useDataSource()     // returns IChainDataSource
```

**Hooks:**

- `useBlocks(pageSize)` — paginated + real-time subscription at top
- `useBlockDetail(height)`
- `useTransactions(pageSize)`
- `useTransactionDetail(hash)`
- `useValidators()`
- `useValidatorDetail(address)`
- `useAccount(address)`
- `useChainStats()` — polled, used in top bar
- `useProposals(pageSize)`
- `useSearch(query)`

Each hook returns `{ data, loading, error }` plus pagination helpers where applicable.

---

### `packages/ui`

Shadcn design system. Initialized with `npx shadcn@latest init`. Components accept only core interface types as props.

**Structure:**

```
src/
├── components/
│   ├── primitives/         # Shadcn base components
│   │   ├── button.tsx
│   │   ├── table.tsx
│   │   ├── badge.tsx
│   │   ├── card.tsx
│   │   ├── skeleton.tsx
│   │   ├── tooltip.tsx
│   │   ├── tabs.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── domain/             # Explorer-specific compound components
│   │   ├── BlocksTable.tsx
│   │   ├── TransactionsTable.tsx
│   │   ├── ValidatorsTable.tsx
│   │   ├── TokenAmount.tsx
│   │   ├── AddressChip.tsx
│   │   ├── TxHash.tsx
│   │   ├── BlockHeight.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── ValidatorStatus.tsx
│   │   ├── TimestampCell.tsx
│   │   ├── MessageTypeBadge.tsx
│   │   └── SearchBar.tsx
│   ├── layout/
│   │   ├── AppLayout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── TopBar.tsx
│   │   ├── Footer.tsx
│   │   └── PageContainer.tsx
│   └── error/
│       ├── ErrorBoundary.tsx   # Class component, wraps page sections
│       ├── ErrorState.tsx      # "Something went wrong" with retry button
│       └── NotFoundState.tsx   # 404-style empty state
└── styles/
    ├── globals.css         # Shadcn CSS variables + base styles
    └── theme.ts            # applyChainTheme() — runtime CSS variable injection
```

**Per-chain theming** — `applyChainTheme(light, dark)` injects the `CSSVariableOverrides` from `chain.json` into `:root` and `.dark` at app startup. No rebuild needed to change colors.

---

### `apps/storybook`

Storybook 8 app for developing and visually testing all `packages/ui` components in isolation. Depends only on `ui` and `core`.

**Structure:**

```
apps/storybook/
├── .storybook/
│   ├── main.ts           # Storybook config: Vite builder, addons
│   └── preview.tsx       # Global decorators: Tailwind CSS, theme provider, mock ChainConfig
├── src/
│   └── stories/
│       ├── primitives/   # One story file per shadcn primitive
│       │   ├── Button.stories.tsx
│       │   ├── Badge.stories.tsx
│       │   ├── Table.stories.tsx
│       │   └── ...
│       └── domain/       # One story file per domain component
│           ├── BlocksTable.stories.tsx
│           ├── TransactionsTable.stories.tsx
│           ├── ValidatorsTable.stories.tsx
│           ├── TokenAmount.stories.tsx
│           ├── AddressChip.stories.tsx
│           ├── StatusBadge.stories.tsx
│           └── ...
└── package.json
```

**Key points:**

- Uses **Vite** as the Storybook builder (fast HMR, no Next.js overhead)
- `preview.tsx` wraps all stories with Tailwind globals and a mock `ChainConfigContext` so theming works
- Stories use **mock data factories** that return objects matching core interfaces (e.g. `mockBlock()`, `mockValidator()`) — these factories live in `packages/core/src/mocks/` and are also reusable in unit tests
- Each domain component story covers: default state, loading skeleton, empty state, and edge cases (long moniker, zero txs, jailed validator, etc.)
- **Chromatic** or **Storybook Test** can be added later for visual regression testing

---

### `apps/explorer`

Next.js 16 + React 19 App Router. Wires all packages together.

**Structure:**

```
src/
├── app/
│   ├── layout.tsx                # Loads config → creates adapter → provides context + theme
│   ├── page.tsx                  # Dashboard: 4 top cards + latest blocks (50%) + latest txs (50%)
│   ├── blocks/
│   │   ├── page.tsx
│   │   └── [height]/page.tsx
│   ├── transactions/
│   │   ├── page.tsx
│   │   └── [hash]/page.tsx
│   ├── validators/
│   │   ├── page.tsx
│   │   └── [address]/page.tsx
│   ├── accounts/
│   │   └── [address]/page.tsx
│   └── proposals/
│       ├── page.tsx
│       └── [id]/page.tsx
├── bootstrap/
│   ├── adapter.ts                # Adapter factory registry
│   └── config.ts                 # loadChainConfig wrapper
└── chain.json                    # Chain configuration for this deployment
```

**Adapter factory:**

```typescript
const ADAPTER_REGISTRY = {
  callisto: (config) => new CallistoAdapter(createApolloClient(...)),
  xrplevm: (config) => new XrplevmAdapter(createApolloClient(...), config.network),
}

export function createAdapter(config: ChainConfig): IChainDataSource {
  return ADAPTER_REGISTRY[config.adapterType](config);
}
```

---

## Dashboard Requirements

The home page layout should be:

- top row: `4` cards
  - latest block
  - average block time
  - price
  - active validators
- second row:
  - latest blocks table on the left (`50%`)
  - latest transactions table on the right (`50%`)

This means the data layer must provide at least:

- latest block height
- average block time
- current price
- active validator count
- latest blocks feed
- latest transactions feed

The detailed legacy source mapping for those items is documented in:

- `docs/governance-explorer-blocks-transactions-accounts.md`
- `docs/price-api-design.md`
- `docs/home-dashboard-data-contract.md`
- `docs/hasura-structure.md`

The working implementation plan for the home page is split into:

- `docs/home.md`
- `docs/blocks.md`
- `docs/transactions.md`
- `docs/price.md`
- `docs/validators.md`

## Home Implementation Plan

The home page should be implemented as the first complete vertical slice.

### Home scope

- `4` top cards
- latest blocks table
- latest transactions table

### Recommended order

1. finalize core domain types for the home page
2. finalize adapter methods needed for the home page
3. implement Hasura queries and mappers
4. implement hooks for stats, blocks, and transactions
5. implement the home page UI and layout
6. add loading, empty, and error states
7. verify responsive behavior

Plain indexed reads for blocks and transactions should stay adapter-level by default, not become separate app HTTP APIs.

---

## Data Flow

```
chain.json
    ↓ loadChainConfig() + Zod validation
ChainConfig
    ↓ createAdapter()
CallistoAdapter  (implements IChainDataSource)
    ↓ DataSourceProvider
useBlocks() / useValidators() / useChainStats() / ...
    ↓
BlocksTable({ blocks: Block[] })   ← only core domain types
```

---

## State Management

React Context + custom hooks only. No Zustand/Redux.

| State | Location |
|-------|----------|
| `IChainDataSource` | `DataSourceContext` (all hooks) |
| `ChainConfig` | `ChainConfigContext` (branding, feature flags, token config) |
| Theme preference | `next-themes` |
| `ChainStats` | `ChainStatsContext` in root layout (shared by top bar + dashboard) |
| Page-local data | Hook state per page |

---

## Adding a New Chain

1. Copy `apps/explorer/` → `apps/new-chain-explorer/`
2. Update `chain.json` — endpoints, token config, bech32 prefix, branding CSS variables, feature flags
3. If the chain runs through Callisto: set `"adapterType": "callisto"` — done
4. If the chain has custom endpoints: add `packages/adapters/new-chain/` extending `CallistoAdapter`, override only differing methods
5. Register the adapter in the app's `bootstrap/adapter.ts`

**No changes to `core`, `ui`, or `hooks`.**

---

## Implementation Sequence

### Phase 1 — Foundation
- [ ] Initialize Turborepo with pnpm workspaces
- [ ] `tsconfig.base.json` shared TS config
- [ ] `packages/core` — all interfaces and `IChainDataSource`
- [ ] `packages/config` — `ChainConfig` types + Zod validation + loader
- [ ] `packages/utils` — token, address, timestamp, hash formatters

### Phase 2 — Adapter
- [ ] `packages/adapters/callisto` — Apollo client factory
- [ ] All `.graphql` query files
- [ ] Mapper functions (raw GraphQL → core interfaces)
- [ ] `CallistoAdapter` implementing all `IChainDataSource` methods
- [ ] `packages/adapters/xrplevm` extending `CallistoAdapter`
- [ ] Unit tests for mappers

### Phase 3 — Design System
- [ ] `packages/ui` — Tailwind + Shadcn init
- [ ] Install shadcn primitives: table, button, badge, card, skeleton, tabs, input, tooltip, dialog, dropdown-menu
- [ ] `globals.css` with default CSS variables
- [ ] `applyChainTheme()` runtime injection
- [ ] Mock data factories in `packages/core/src/mocks/` (`mockBlock()`, `mockTransaction()`, `mockValidator()`, etc.)
- [ ] All domain components (`BlocksTable`, `TransactionsTable`, `ValidatorsTable`, `TokenAmount`, `AddressChip`, `StatusBadge`, `TimestampCell`, etc.)
- [ ] Layout components (`AppLayout`, `Sidebar`, `TopBar`, `Footer`)
- [ ] `apps/storybook` — Storybook 8 + Vite setup with Tailwind + mock ChainConfig decorator
- [ ] Stories for all primitives
- [ ] Stories for all domain components (default, loading, empty, edge cases)

### Phase 4 — Hooks
- [ ] `packages/hooks` — `DataSourceProvider` + `useDataSource()`
- [ ] All data hooks with pagination and real-time subscriptions

### Phase 5 — App Wiring
- [ ] `apps/explorer` — Next.js 16 + React 19 scaffold
- [ ] `chain.json` for XRP EVM sidechain
- [ ] `bootstrap/adapter.ts` factory
- [ ] All pages wired with hooks + domain components
- [ ] Search with router-based navigation on result
- [ ] Theme toggle with `next-themes`

### Phase 6 — Polish
- [ ] Loading skeletons for all tables and detail views
- [ ] Error boundaries per page section
- [ ] Mobile-responsive layout
- [ ] SEO metadata per page
- [ ] E2E smoke tests with Playwright

---

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Monorepo | Turborepo + pnpm | Fast incremental builds, workspace protocol for local deps |
| UI | Shadcn + Tailwind | Full code ownership, CSS variable theming, no runtime overhead |
| State | React Context + hooks | Adapter handles subscriptions; no global store needed |
| Data layer | Interface + adapter pattern | Any backend swappable without touching UI |
| Config | `chain.json` per app | Self-contained deployment, Zod-validated at startup |
| GraphQL types | Contained in adapter | Prevents backend types from leaking into UI |
| App Router | Next.js 16 + React 19 | Server components for SEO, streaming for large tables |
| New chain | New app + optional adapter subclass | Zero changes to shared packages |
| Component dev | Storybook 8 + Vite | Isolated component development without running the full Next.js app |
