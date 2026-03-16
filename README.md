# Cosmos Explorer

A modular, customizable blockchain explorer for Cosmos chains. Built with Next.js 16, React 19, Turborepo, and Shadcn/ui.

## Features

- Chain-agnostic architecture — deploy for any Cosmos chain by editing a single `chain.json`
- Per-chain theming via CSS variable overrides (no rebuild required)
- Real-time block and stats updates via GraphQL subscriptions
- Blocks, transactions, validators, accounts, and governance pages
- Design system with Storybook for isolated component development

## Stack

| Layer | Technology |
|-------|-----------|
| Monorepo | Turborepo + pnpm |
| App | Next.js 16 (App Router) + React 19 |
| UI | Shadcn/ui + Tailwind CSS v4 |
| Components | Storybook 8 (Vite) |
| Data | GraphQL / Hasura (BDJuno) |
| Language | TypeScript 5 |

## Monorepo Structure

```
apps/
  explorer/       Next.js app for a specific chain deployment
  storybook/      Component explorer and visual testing

packages/
  core/           TypeScript interfaces only — the contract layer
  config/         ChainConfig schema with Zod validation
  ui/             Shadcn design system + domain components + charts
  hooks/          React hooks consuming IChainDataSource
  utils/          Pure format helpers (tokens, addresses, timestamps)
  adapters/
    hasura/       IChainDataSource implementation for BDJuno/Hasura
    xrplevm/      XRP EVM sidechain adapter (extends hasura)
```

## Getting Started

**Prerequisites:** Node.js 20+, pnpm 9+

```bash
# Install dependencies
pnpm install

# Start all apps in development mode
pnpm dev

# Start only the explorer
pnpm --filter @cosmos-explorer/explorer dev

# Start only Storybook
pnpm --filter @cosmos-explorer/storybook dev
```

## Chain Configuration

Each explorer deployment is configured by `apps/explorer/src/chain.json`. This file controls endpoints, token display, bech32 prefixes, branding colors, and feature flags.

```json
{
  "adapterType": "hasura",
  "network": {
    "chainId": "examplechain-1",
    "chainName": "Example Chain",
    "chainEnv": "mainnet",
    "bech32Prefix": "cosmos",
    "validatorPrefix": "cosmosvaloper",
    "consensusPrefix": "cosmosvalcons",
    "primaryToken": {
      "denom": "uatom",
      "displayDenom": "ATOM",
      "exponent": 6
    },
    "endpoints": {
      "graphqlHttp": "https://hasura.example.com/v1/graphql",
      "graphqlWs": "wss://hasura.example.com/v1/graphql"
    }
  },
  "branding": {
    "title": "Example Chain Explorer",
    "logoPath": "/logo.svg",
    "cssVariables": {
      "light": { "primary": "220 90% 50%" },
      "dark":  { "primary": "220 90% 65%" }
    }
  },
  "features": {
    "proposals": true,
    "accounts": true,
    "validatorIdentity": true,
    "evmSearch": false
  }
}
```

CSS variable values use the oklch/HSL format expected by Shadcn (e.g. `"220 90% 50%"`). Changes take effect without a rebuild.

## Deploying for a New Chain

1. Copy `apps/explorer/` to a new directory (e.g. `apps/osmosis-explorer/`)
2. Update `chain.json` with the new chain's endpoints, token config, and branding
3. If the chain runs BDJuno, set `"adapterType": "hasura"` — no other changes needed
4. If the chain requires custom data fetching, create `packages/adapters/new-chain/` extending `HasuraAdapter` and override only the methods that differ
5. Register the new adapter in `apps/new-chain-explorer/src/bootstrap/adapter.ts`

No changes to `packages/core`, `packages/ui`, or `packages/hooks` are required.

## Architecture

### The Interface Layer (`packages/core`)

All data flows through `IChainDataSource` — a single TypeScript interface that every adapter implements. The UI never imports from an adapter directly.

```
chain.json → ChainConfig → adapter factory → IChainDataSource
                                                    ↓
                                          DataSourceProvider (React context)
                                                    ↓
                                    useBlocks() / useValidators() / ...
                                                    ↓
                                    BlocksTable({ blocks: IBlock[] })
```

### Adapter Pattern

Adapters translate backend-specific types (GraphQL responses) into core interfaces. GraphQL types never leave the adapter package.

```
HasuraAdapter implements IChainDataSource
    ↑ extends
XrplevmAdapter  (overrides search() for 0x EVM tx hashes)
```

### Per-Chain Theming

`packages/ui` uses Shadcn CSS variables. `applyChainTheme()` injects the `cssVariables` from `chain.json` into `:root` and `.dark` at app startup. The default theme is dark; `.light` class overrides are provided for light mode.

## Development

```bash
# Build all packages (required before typecheck/lint)
pnpm build

# Type-check everything
pnpm typecheck

# Lint everything
pnpm lint

# Clean all build artifacts
pnpm clean

# Build a single package
pnpm --filter @cosmos-explorer/core build
```

Turbo caches build outputs. `typecheck` and `lint` both `dependsOn: ["^build"]`, so upstream packages must be compiled first.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard — chain stats, latest blocks, latest transactions |
| `/blocks` | Paginated block list with real-time updates |
| `/blocks/[height]` | Block detail — transactions, signers |
| `/transactions` | Paginated transaction list |
| `/transactions/[hash]` | Transaction detail — messages, logs, gas |
| `/validators` | Active validator set with voting power |
| `/validators/[address]` | Validator detail — delegations, performance |
| `/accounts/[address]` | Account balances, delegations, rewards |
| `/proposals` | Governance proposals |
| `/proposals/[id]` | Proposal detail with tally |
