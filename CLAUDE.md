# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies (run from root)
pnpm install

# Develop all apps/packages in parallel
pnpm dev

# Develop a single app
pnpm --filter @cosmos-explorer/explorer dev
pnpm dev:playground  # UI component playground on port 3001

# Build everything (respects Turbo dependency order)
pnpm build

# Build a single package
pnpm --filter @cosmos-explorer/core build

# Type-check all packages
pnpm typecheck

# Lint all packages
pnpm lint

# Clean all build artifacts
pnpm clean
```

Turbo caches build outputs. Run `pnpm build` before `pnpm typecheck` or `pnpm lint` — both tasks `dependsOn: ["^build"]` so upstream packages must be compiled first.

`apps/explorer` dev server uses Turbopack (`next dev --turbopack`).

## Architecture

This is a Turborepo + pnpm monorepo. See `plan.md` for the full design rationale.

### Package layout

```
packages/core          → Pure TS interfaces, zero runtime deps
packages/config        → ChainConfig schema (Zod-validated)
packages/utils         → Pure format helpers (token, address, time)
packages/adapters/hasura   → IChainDataSource impl against BDJuno/Hasura GraphQL
packages/adapters/xrplevm  → Extends HasuraAdapter for XRP EVM specifics
packages/hooks         → React hooks consuming IChainDataSource via context
packages/ui            → Shadcn design system + domain components (raw TSX, no build)
apps/explorer          → Next.js 15 + React 19 App Router
apps/docs              → UI component playground (Next.js, port 3001)
```

All packages are `"private": true` and use `"type": "module"`. Internal deps use `workspace:*`.

### The central abstraction: `IChainDataSource`

Defined in `packages/core`, this interface is the only contract between the UI layer and any backend. The UI (hooks, components, pages) never imports from an adapter directly — it receives an `IChainDataSource` instance via `DataSourceProvider` context.

Adding a new chain means: new `chain.json` config + optionally a new adapter class. No changes to `core`, `ui`, or `hooks`.

### Dependency rule

GraphQL types are **contained inside adapter packages** and never exported. Adapter mappers translate raw Hasura responses into core interfaces before they cross the package boundary. If you find a GraphQL type referenced outside of `packages/adapters/*`, that's a violation of this rule.

### `packages/ui` design system

- **No build step.** Components are raw TSX files exported via subpath exports (e.g. `@cosmos-explorer/ui/button`). Consuming apps must add `@cosmos-explorer/ui` to `transpilePackages` in `next.config.ts`.
- **Tailwind v4 CSS-first config.** Theme lives in `packages/ui/src/styles/globals.css` using `@theme` blocks with oklch colors. No `tailwind.config.ts`.
- **Dark-mode-first.** Dark colors are the default `@theme` values; `.light` class overrides them. `next-themes` with `attribute="class"` handles toggling.
- **Consuming apps must import Tailwind themselves** and add `@source` to scan UI package files:
  ```css
  @import "tailwindcss";
  @import "tw-animate-css";
  @source "../../../../packages/ui/src";
  @import "@cosmos-explorer/ui/styles";
  ```
- **Adding a component:** create `packages/ui/src/components/ui/{name}.tsx`, add a subpath export in `package.json`, re-export from `src/index.ts`, and add a playground page in `apps/docs/src/app/components/{name}/page.tsx` + register in `apps/docs/src/lib/registry.ts`.
- **Radix + cva pattern.** Components use `@radix-ui/*` primitives, `class-variance-authority` for variants, and import `cn` from `../../lib/utils`.

### Per-chain theming

`ChainBrandingConfig.cssVariables` in `chain.json` holds oklch CSS variable overrides (e.g. `"primary": "0.646 0.222 41.116"`). These can be injected into `:root` at app startup — no rebuild required to change colors.

### TypeScript config

All packages extend `tsconfig.base.json` at the root. The base uses `"moduleResolution": "bundler"` and `"composite": true` for project references. Each package sets its own `outDir` and `rootDir`.

New packages added to `packages/adapters/*` must also be listed in `pnpm-workspace.yaml` under `packages/adapters/*` (already covered by the wildcard).

### Mock data

`packages/core/src/mocks/` contains factory functions (`mockBlock()`, `mockTransaction()`, etc.) that return objects satisfying core interfaces. These are used in both Storybook stories and unit tests. Keep them in sync with interface changes.
