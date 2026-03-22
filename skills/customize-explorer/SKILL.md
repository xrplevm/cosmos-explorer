---
name: customize-explorer
description: Customize the Cosmos Explorer branding, theme, and configuration for any chain deployment. Use this skill when the user wants to change colors, apply a color preset, update the logo, modify the chain config, rebrand the explorer, or deploy for a new chain. Also triggers on questions about theming, presets, or the globals.css file.
user-invocable: true
---

# Customize Explorer

Rebrand and restyle the Cosmos Explorer for any chain deployment. Three things to customize: the **logo**, the **color preset**, and the **chain config**.

## Logo

Two SVG files control the logo across the entire app:

```
apps/explorer/public/network_logo_dark.svg   ← shown on dark backgrounds
apps/explorer/public/network_logo_light.svg  ← shown on light backgrounds
```

The `NetworkLogo` component (`apps/explorer/src/components/network-logo.tsx`) toggles between them by theme. To replace:

1. Drop new SVGs into `apps/explorer/public/`
2. If filenames differ, update `src` paths in `network-logo.tsx`
3. Update the `alt` text and `width`/`height` props to match the new SVG's `viewBox`

Logos render at `h-5` in the sidebar and `h-8` in the footer. Horizontal aspect ratio works best.

## Color Preset

All theme colors live in `packages/ui/src/styles/globals.css`. Read [references/colors.md](./references/colors.md) for the full token reference.

### Structure

```css
@theme { /* dark mode — the default */ }
.light { /* light mode overrides */ }
```

### Applying a preset

Pick one from `references/`:

| Preset | File | Primary |
|--------|------|---------|
| Violet | `preset-violet.css` | `rgb(121, 25, 255)` — current |
| Neutral | `preset-neutral.css` | white/black (no accent) |
| Blue | `preset-blue.css` | classic blue |
| Green | `preset-green.css` | emerald |
| Orange | `preset-orange.css` | warm orange |
| Red | `preset-red.css` | bold red |

Copy the dark mode values into `@theme { }` and light mode values into `.light { }`. Keep `@custom-variant`, `@layer base`, and `--radius-*` unchanged.

### Creating a custom preset from RGB

1. Convert your RGB to oklch (use [oklch.com](https://oklch.com))
2. Copy any preset file as a starting template
3. Replace the primary oklch value in `--color-primary` and `--color-sidebar-primary`
4. Derive the ring: same hue, lower lightness (~0.35 dark, ~0.60 light)
5. Derive chart ramp: same hue, lightness from 0.75 down to 0.38
6. Neutrals use hue ~285 (blue-gray tint) — keep or shift to complement your primary

### Critical rules

These rules exist because `--color-primary` is an accent color (violet, blue, etc.), not a neutral:

- **Table text, links, hashes, addresses** use `text-foreground` — never `text-primary`
- **Buttons, tooltips, timeline dots, badge defaults** use `text-primary` / `bg-primary`
- **Skeletons** use `bg-muted`, not `bg-primary`
- **Status badges** (green/red/blue/yellow) use hardcoded Tailwind colors — they don't change with the preset

If you add new components with links or clickable text, use `text-foreground hover:underline`, not `text-primary`.

## Chain Config

File: `apps/explorer/chain.json` — read [references/chain-config.md](./references/chain-config.md) for the full schema.

Key fields:

```jsonc
{
  "network": {
    "chainId": "...",
    "chainName": "Your Chain",
    "chainEnv": "mainnet",        // shown in sidebar
    "primaryToken": { "denom": "utoken", "displayDenom": "TOKEN", "exponent": 6 },
    "endpoints": { "graphqlHttp": "https://..." }
  },
  "branding": { "title": "...", "description": "..." },
  "links": { "github": "...", "discord": "...", "website": "...", "issues": "..." },
  "features": { "proposals": true, "accounts": true, "evmSearch": false }
}
```

## Full Deployment Checklist

When deploying for a new chain:

1. Replace logos in `apps/explorer/public/`
2. Apply a color preset (or create one) in `packages/ui/src/styles/globals.css`
3. Update `apps/explorer/chain.json` with endpoints, token, branding, links
4. `pnpm dev:explorer` — verify dark and light mode visually
5. `pnpm --filter @cosmos-explorer/explorer typecheck`
6. `pnpm build` — verify production build
