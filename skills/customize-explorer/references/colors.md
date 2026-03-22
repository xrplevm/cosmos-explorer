# Color Token Reference

All tokens defined in `packages/ui/src/styles/globals.css`.

## Token Map

| Token | Used for |
|-------|----------|
| `--color-primary` | Buttons (`variant="default"`), active timeline dots, focus rings, tooltips, badge default variant |
| `--color-primary-foreground` | Text on primary-colored backgrounds |
| `--color-foreground` | Body text, table links, tx hashes, addresses, proposers |
| `--color-muted-foreground` | Secondary text, timestamps, labels, inactive sidebar items |
| `--color-card` | Card backgrounds (slightly lifted from page background in dark mode) |
| `--color-background` | Page background |
| `--color-border` | Card borders, dividers, table lines. In dark mode use semi-transparent white for a glassy look |
| `--color-input` | Input field borders (slightly more visible than border) |
| `--color-secondary` | Secondary button background, code blocks |
| `--color-accent` | Hover highlights, sidebar active background |
| `--color-muted` | Skeleton loading backgrounds, subtle backgrounds |
| `--color-destructive` | Error states, failed status badges, destructive buttons |
| `--color-ring` | Focus ring around interactive elements |
| `--color-chart-1..5` | Chart series colors — should form a coordinated ramp from primary hue |
| `--color-sidebar` | Sidebar background |
| `--color-sidebar-primary` | Sidebar active item accent |
| `--color-sidebar-accent` | Sidebar hover/active background |
| `--color-sidebar-border` | Sidebar border separator |
| `--radius-sm/md/lg/xl` | Border radius scale. Base `lg` of 0.65rem gives rounded cards and buttons |

## Generating an oklch Ramp

Given a primary color `oklch(L C H)`:

```
ring (dark):   oklch(0.35  C*0.66  H)
ring (light):  oklch(0.60  C*0.87  H)
chart-1:       oklch(0.75  C*0.63  H)
chart-2:       oklch(0.60  C*0.87  H)
chart-3:       oklch(L     C       H)   ← same as primary
chart-4:       oklch(0.45  C*0.84  H)
chart-5:       oklch(0.38  C*0.70  H)
```

These are approximate — adjust chroma to taste. The goal is a monochromatic ramp that looks cohesive in charts.
