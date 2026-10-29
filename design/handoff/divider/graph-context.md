# Divider — graph context

Query: `Divider: which ui primitives, cva variants, icons and design-system pages already exist that this should reuse` (graphify BFS, budget 1500)

## Reuse

- `src/components/ui/separator.tsx` — shadcn `Separator` on Base UI (`@base-ui/react/separator`), `cn` from `@/lib/utils` already. Stock classes: `bg-border data-horizontal:h-px data-vertical:w-px`. No `cva` yet; `bg-border` is the unmapped shadcn var (does not follow design tokens). Extend it with a `cva` (color / thickness / style variants from Figma) instead of adding a new component.
- CLAUDE.md rule: "Dividers use `Separator` (Figma `Divider-Horizontal`), never `border-b` divs or `<hr>`." Divider is the Figma name for shadcn `Separator`.
- Consumers that must keep working: `src/components/ui/alert.tsx` (`AlertSeparator`), `src/components/ui/button-group.tsx` (ButtonGroup separator). Default variant must render like today's usage there (check both previews `/design-system/alert`, `/design-system/button-group`).
- Pattern references: `alert.tsx` (`alertVariants` cva + slots), `button.tsx` (cva sizes), `badge.tsx` (`BadgeDot`) — if Figma Divider has text/icon/button in the middle, build it as slots in `separator.tsx` (e.g. `SeparatorLabel`) composing `Badge`/`Button`, not a styled div in a domain component.
- `cn()` from `src/lib/utils.ts`.
- No `src/app/design-system/divider/` page yet; create it.
