# Cosmos Explorer — Theme Customization Plan

## Goal

Match the look and feel of the [shadcn v4 dashboard example](https://ui.shadcn.com/examples/dashboard) while keeping the explorer easy to re-theme per chain via `globals.css`.

The shadcn dashboard uses a violet preset as a base. Our brand violet is `rgb(121, 25, 255)` → `oklch(0.53 0.286 291.076)`. The plan below replaces the neutral gray palette with a blue-gray tinted palette using this violet as the primary accent, adjusts component-level styles, and aligns spacing/typography with the dashboard reference.

---

## Current vs Target

| Token | Current (dark) | Target (dark — shadcn violet) |
|-------|----------------|-------------------------------|
| `--background` | `oklch(0.145 0 0)` | `oklch(0.141 0.005 285.823)` |
| `--foreground` | `oklch(0.985 0 0)` | `oklch(0.985 0 0)` |
| `--card` | `oklch(0.17 0 0)` | `oklch(0.21 0.006 285.885)` |
| `--card-foreground` | `oklch(0.985 0 0)` | `oklch(0.985 0 0)` |
| `--primary` | `oklch(0.985 0 0)` (white) | `oklch(0.53 0.286 291.076)` (brand violet) |
| `--primary-foreground` | `oklch(0.205 0 0)` | `oklch(0.985 0 0)` |
| `--secondary` | `oklch(0.269 0 0)` | `oklch(0.274 0.006 286.033)` |
| `--secondary-foreground` | `oklch(0.985 0 0)` | `oklch(0.985 0 0)` |
| `--muted` | `oklch(0.269 0 0)` | `oklch(0.274 0.006 286.033)` |
| `--muted-foreground` | `oklch(0.708 0 0)` | `oklch(0.705 0.015 286.067)` |
| `--accent` | `oklch(0.269 0 0)` | `oklch(0.274 0.006 286.033)` |
| `--accent-foreground` | `oklch(0.985 0 0)` | `oklch(0.985 0 0)` |
| `--destructive` | `oklch(0.577 0.245 27.325)` | `oklch(0.704 0.191 22.216)` |
| `--border` | `oklch(0.269 0 0)` | `oklch(1 0 0 / 10%)` |
| `--input` | `oklch(0.269 0 0)` | `oklch(1 0 0 / 15%)` |
| `--ring` | `oklch(0.556 0 0)` | `oklch(0.38 0.189 293.745)` |
| `--chart-1..5` | warm/neutral | violet monochrome ramp |
| `--sidebar` | `oklch(0.145 0 0)` | `oklch(0.21 0.006 285.885)` |
| `--sidebar-primary` | `oklch(0.985 0 0)` | `oklch(0.606 0.25 292.717)` |
| `--radius` | `0.5rem (lg)` | `0.65rem` base |

Key differences:
- **Primary** shifts from white to **violet** — links, active states, and buttons get accent color
- **Borders** become semi-transparent white (`oklch(1 0 0 / 10%)`) instead of solid gray — softer, glassier look
- **Neutrals** gain a subtle blue-purple tint (hue 285–286) instead of pure gray
- **Card** background lifts slightly (0.17 → 0.21) for more contrast against the page
- **Destructive** lightens in dark mode for better readability
- **Charts** use a coordinated violet ramp instead of random warm colors
- **Radius** increases slightly for rounder cards and buttons

---

## Implementation Steps

### Step 1 — Replace color palette in `globals.css`

**File:** `packages/ui/src/styles/globals.css`

Replace the `@theme` block (dark-first defaults) and `.light` class with the shadcn violet preset values. Both light and dark palettes must be updated.

Dark mode values (in `@theme`):
```css
@theme {
  --color-background: oklch(0.141 0.005 285.823);
  --color-foreground: oklch(0.985 0 0);
  --color-card: oklch(0.21 0.006 285.885);
  --color-card-foreground: oklch(0.985 0 0);
  --color-popover: oklch(0.21 0.006 285.885);
  --color-popover-foreground: oklch(0.985 0 0);
  --color-primary: oklch(0.606 0.25 292.717);
  --color-primary-foreground: oklch(0.969 0.016 293.756);
  --color-secondary: oklch(0.274 0.006 286.033);
  --color-secondary-foreground: oklch(0.985 0 0);
  --color-muted: oklch(0.274 0.006 286.033);
  --color-muted-foreground: oklch(0.705 0.015 286.067);
  --color-accent: oklch(0.274 0.006 286.033);
  --color-accent-foreground: oklch(0.985 0 0);
  --color-destructive: oklch(0.704 0.191 22.216);
  --color-destructive-foreground: oklch(0.985 0 0);
  --color-border: oklch(1 0 0 / 10%);
  --color-input: oklch(1 0 0 / 15%);
  --color-ring: oklch(0.38 0.189 293.745);

  --color-chart-1: oklch(0.811 0.111 293.571);
  --color-chart-2: oklch(0.606 0.25 292.717);
  --color-chart-3: oklch(0.541 0.281 293.009);
  --color-chart-4: oklch(0.491 0.27 292.581);
  --color-chart-5: oklch(0.432 0.232 292.759);

  --color-sidebar: oklch(0.21 0.006 285.885);
  --color-sidebar-foreground: oklch(0.985 0 0);
  --color-sidebar-primary: oklch(0.606 0.25 292.717);
  --color-sidebar-primary-foreground: oklch(0.969 0.016 293.756);
  --color-sidebar-accent: oklch(0.274 0.006 286.033);
  --color-sidebar-accent-foreground: oklch(0.985 0 0);
  --color-sidebar-border: oklch(1 0 0 / 10%);
  --color-sidebar-ring: oklch(0.38 0.189 293.745);

  --radius-sm: 0.325rem;
  --radius-md: 0.488rem;
  --radius-lg: 0.65rem;
  --radius-xl: 0.975rem;
}
```

Light mode values (in `.light`):
```css
.light {
  --color-background: oklch(1 0 0);
  --color-foreground: oklch(0.141 0.005 285.823);
  --color-card: oklch(1 0 0);
  --color-card-foreground: oklch(0.141 0.005 285.823);
  --color-popover: oklch(1 0 0);
  --color-popover-foreground: oklch(0.141 0.005 285.823);
  --color-primary: oklch(0.541 0.281 293.009);
  --color-primary-foreground: oklch(0.969 0.016 293.756);
  --color-secondary: oklch(0.967 0.001 286.375);
  --color-secondary-foreground: oklch(0.21 0.006 285.885);
  --color-muted: oklch(0.967 0.001 286.375);
  --color-muted-foreground: oklch(0.552 0.016 285.938);
  --color-accent: oklch(0.967 0.001 286.375);
  --color-accent-foreground: oklch(0.21 0.006 285.885);
  --color-destructive: oklch(0.577 0.245 27.325);
  --color-destructive-foreground: oklch(0.985 0 0);
  --color-border: oklch(0.92 0.004 286.32);
  --color-input: oklch(0.92 0.004 286.32);
  --color-ring: oklch(0.702 0.183 293.541);

  --color-chart-1: oklch(0.811 0.111 293.571);
  --color-chart-2: oklch(0.606 0.25 292.717);
  --color-chart-3: oklch(0.541 0.281 293.009);
  --color-chart-4: oklch(0.491 0.27 292.581);
  --color-chart-5: oklch(0.769 0.188 70.08);

  --color-sidebar: oklch(0.985 0 0);
  --color-sidebar-foreground: oklch(0.141 0.005 285.823);
  --color-sidebar-primary: oklch(0.541 0.281 293.009);
  --color-sidebar-primary-foreground: oklch(0.969 0.016 293.756);
  --color-sidebar-accent: oklch(0.967 0.001 286.375);
  --color-sidebar-accent-foreground: oklch(0.21 0.006 285.885);
  --color-sidebar-border: oklch(0.92 0.004 286.32);
  --color-sidebar-ring: oklch(0.702 0.183 293.541);
}
```

**Verification:** `pnpm dev:explorer` — check dark and light mode visually.

---

### Step 2 — Audit primary-colored components

With `--primary` changing from white to violet, any component that used `bg-primary text-primary-foreground` expecting a white/black pair will now be violet/white. Audit and fix:

- **Sidebar active nav link** — currently uses `text-primary`. With violet primary this becomes a violet accent on the active link, which is desirable (matches shadcn dashboard sidebar).
- **Buttons** — `variant="default"` buttons become violet. This is the intended dashboard look.
- **Links/hashes** — `text-primary` on tx hashes and block links will turn violet. This matches the dashboard style where links have accent color.
- **CopyButton check icon** — uses `text-primary`, will become violet checkmark. Good.

Components that may need adjustment:
- **Home stat cards** — if any use `bg-primary` for background, they'll turn violet. Check `apps/explorer/src/app/page.tsx`.
- **Pagination** — active page button uses `bg-primary`. Violet active page is fine.

---

### Step 3 — Adjust card and border styles

The shadcn dashboard uses:
- Cards with slightly visible borders (the `oklch(1 0 0 / 10%)` border is very subtle)
- No heavy shadows on cards — flat with border separation
- Tables inside cards with clean dividers

Check that our `Card` component doesn't add extra shadows or borders that clash. The current shadcn Card component should inherit the new border color automatically.

---

### Step 4 — Sidebar alignment

The shadcn dashboard sidebar has:
- Background matching `--sidebar` (same as card in dark mode, slightly off-white in light)
- Active item highlighted with `--sidebar-accent` background and `--sidebar-primary` text
- Subtle border separator between sidebar and main content

Our sidebar already uses `bg-background` or similar. Verify it picks up the new sidebar tokens. If our sidebar uses hardcoded colors, switch to the `sidebar-*` tokens.

**File to check:** `apps/explorer/src/components/sidebar.tsx`

---

### Step 5 — Chart colors

The home page has charts (if any) that use `--chart-1` through `--chart-5`. The new values form a coordinated violet ramp instead of the current warm/neutral palette. No code changes needed — the CSS variables propagate automatically through the `chart` component.

---

### Step 6 — Typography and spacing fine-tuning

The shadcn dashboard uses:
- `font-sans` (Inter / system font stack)
- Tight tracking on headings (`tracking-tight`)
- Consistent `text-sm` for table cells and metadata
- `text-muted-foreground` for secondary text

Audit the explorer pages for:
- Any hardcoded `text-gray-*` or `text-zinc-*` classes that bypass the theme tokens
- Heading sizes consistent with the dashboard (page titles: `text-2xl font-bold tracking-tight`)

---

### Step 7 — StatusBadge color audit

The `StatusBadge` uses hardcoded Tailwind colors (`text-green-500`, `text-blue-500`, etc.) for status icons. These are intentionally outside the theme palette (they represent semantic status, not brand). No changes needed — they should look the same in both the neutral and violet themes.

---

## Verification Checklist

- [ ] Dark mode: background has a subtle blue-purple tint, not pure black
- [ ] Dark mode: cards are slightly lighter than the background
- [ ] Dark mode: borders are soft semi-transparent white lines
- [ ] Primary color (buttons, links, active states) is violet
- [ ] Light mode: clean white background with violet accents
- [ ] Sidebar: active item uses violet accent
- [ ] Charts: violet color ramp
- [ ] StatusBadges: still show green/red/blue/yellow status colors
- [ ] Radius: slightly rounder cards and inputs
- [ ] No hardcoded gray colors bypassing theme tokens
- [ ] `pnpm --filter @cosmos-explorer/explorer typecheck` passes
- [ ] `pnpm --filter @cosmos-explorer/explorer lint` passes (no errors)
