# Tooltip — graph context (graphify query, budget 1500)

No existing Tooltip node in the graph: no `ui/tooltip.tsx`, no `/design-system/tooltip` page. Add the shadcn `tooltip` base (Base UI).

Reuse:
- `cn()` from `@/lib/utils` (rewrite shadcn's `import { cn } from "cn"`).
- `kbd.tsx` (`Kbd`) — if Figma tooltip shows a shortcut.
- `button.tsx` (`Button`, `ButtonIcon`) — trigger in previews; any tooltip action buttons via button cva variants.
- `badge.tsx` — if tooltip contains a badge/counter.
- `separator.tsx` (`Separator`) — any divider inside the tooltip.
- `avatar.tsx` (`Avatar`) — if a tooltip variant shows an avatar.
- `alert.tsx` `AlertIcon` — CSS mask icon pattern for single-color Figma icons (`bg-<token> mask-[url(/icons/x.svg)]`).
- Icons in `public/icons/` (e.g. `material-help.svg`, used as the Input help trigger — Input's help icon is a natural tooltip trigger).
- Preview page pattern: `src/app/design-system/avatar/page.tsx` (`Section()` helper) / `checkbox/page.tsx`.
- Tokens: `bg-base-900`, `text-background-0`-style design-token utilities (shadcn vars not mapped yet).
