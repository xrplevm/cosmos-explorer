# @cosmos-explorer/ui

Shadcn-based design system for the Cosmos Explorer. Dark-mode-first, Tailwind v4, oklch palette.

## Components

| Component     | Import                              |
| ------------- | ----------------------------------- |
| Avatar        | `@cosmos-explorer/ui/avatar`        |
| Badge         | `@cosmos-explorer/ui/badge`         |
| Button        | `@cosmos-explorer/ui/button`        |
| Card          | `@cosmos-explorer/ui/card`          |
| Chart         | `@cosmos-explorer/ui/chart`         |
| Dialog        | `@cosmos-explorer/ui/dialog`        |
| Dropdown Menu | `@cosmos-explorer/ui/dropdown-menu` |
| Input         | `@cosmos-explorer/ui/input`         |
| Label         | `@cosmos-explorer/ui/label`         |
| Popover       | `@cosmos-explorer/ui/popover`       |
| Scroll Area   | `@cosmos-explorer/ui/scroll-area`   |
| Select        | `@cosmos-explorer/ui/select`        |
| Separator     | `@cosmos-explorer/ui/separator`     |
| Sheet         | `@cosmos-explorer/ui/sheet`         |
| Skeleton      | `@cosmos-explorer/ui/skeleton`      |
| Table         | `@cosmos-explorer/ui/table`         |
| Tabs          | `@cosmos-explorer/ui/tabs`          |
| Tooltip       | `@cosmos-explorer/ui/tooltip`       |
| Utilities     | `@cosmos-explorer/ui/lib/utils`     |
| Styles        | `@cosmos-explorer/ui/styles`        |

## Usage in a Next.js app

### 1. Add the dependency

```json
{
  "dependencies": {
    "@cosmos-explorer/ui": "workspace:*"
  }
}
```

### 2. Configure `next.config.ts`

```ts
const nextConfig: NextConfig = {
  transpilePackages: ["@cosmos-explorer/ui"],
};
```

### 3. Set up CSS

```css
/* app/globals.css */
@import "tailwindcss";
@import "tw-animate-css";
@source "../../../../packages/ui/src";
@import "@cosmos-explorer/ui/styles";
```

The `@source` path must be relative from your CSS file to `packages/ui/src` so Tailwind scans the component files for class names.

### 4. Import components

```tsx
import { Button } from "@cosmos-explorer/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@cosmos-explorer/ui/card";
```

## Adding a new component

1. Create `src/components/ui/{name}.tsx` following the Radix + cva pattern
2. Add a subpath export in `package.json`
3. Re-export from `src/index.ts`
4. Add a playground page at `apps/playground/src/app/components/{name}/page.tsx`
5. Register it in `apps/playground/src/lib/registry.ts`

## Theming

The design tokens live in `src/styles/globals.css` as a Tailwind v4 `@theme` block using oklch colors. Dark values are the defaults; `.light` class overrides them. To customize colors per-chain, override the CSS variables at runtime on `:root`.

## Playground

```bash
pnpm dev:playground
```

Opens the component showcase at `http://localhost:3001`.
