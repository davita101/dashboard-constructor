# Commerce Constructor 7.7 — E-commerce Website

E-commerce site built from the **Commerce Constructor 7.7** Figma design system.

## Stack

- **Next.js** (App Router, TypeScript, `src/` dir)
- **Tailwind CSS v4** (CSS-first config; design tokens generated into `src/styles/`, imported by `src/app/globals.css`)
- **shadcn/ui** (components in `src/components/ui`, add with `npx shadcn@latest add <name>`)
- Package manager: `pnpm` (fall back to `npm` if unavailable)

## Workflow order

1. **Figma first** — build components in Figma (Commerce Constructor 7.7 file), bound to the existing variables. Use skills `figma:figma-use` and `figma:figma-generate-library`.
2. **Tokens → code** — generate Tailwind theme + CSS variables from the Figma variables export.
3. **Components → code** — implement each Figma component with `figma:figma-design-to-code`, reusing/extending shadcn/ui primitives. Link with `figma:figma-code-connect`.
4. **Pages** — compose pages from components only.

## Design tokens

Source of truth: Figma variables. Never hardcode colors, spacing, radii, or font sizes — always use tokens.

Pipeline: `design/tokens/figma-variables.json` (Figma export) + `design/tokens/figma-composites.json` (alpha/shadow colors the export omits, read via Plugin API) → `pnpm tokens` (`scripts/build-tokens.mjs`) → `src/styles/` (generated, don't hand-edit):
- `primitives.css` — palette `--default-*` (OKLCH like shadcn, converted from Figma hex; 4 decimals = exact round-trip), `--font-family-*`, `--font-size-*`, `--weight-*`, `--space-*`, `--opacity-*`, `--max-width-*`
- `themes.css` — `data-primary`, `data-gray`, `data-radius`, `data-leading`, `data-tracking`, `data-stroke`, `data-font`, `data-display-font`, `data-font-style` on `<html>` (first Figma mode = default)
- `color-mode.css` — semantic colors, `:root` Light / `.dark` Dark (`--primary-500`, `--base-900`, `--danger-alpha-20`, `--shadow-primary`, …)
- `tailwind-theme.css` — utilities: `bg-primary-500`, `text-base-900`, `rounded-r12`, `text-16`, `leading-24`, `font-display`, `max-w-desktop`. Spacing uses Tailwind's default 4px scale (`p-4` = 16px).
- `tokens.css` — entry, imported in `src/app/globals.css`

Re-export from Figma → overwrite `figma-variables.json` → `pnpm tokens`.

Collections in the export (W3C-style `$value` / `$type`, aliases as `{name}`):

| Collection | Modes | Notes |
|---|---|---|
| Color Mode | Light, Dark | Semantic layer: `primary-*`, `background-*`, `base-*` (+ `base-alpha-*`), `danger/warning/success/info-*`, palette colors, `shadow-*` |
| Primary Colors | Blue, Pink, Indigo, Emerald, Lime, Purple, Sky, Orange, Yellow, Fuchsia | Brand theme switch → `default-primary-25…950` |
| Gray Theme | Neutral, Blue, Yellow, Purple, Emerald, Lime Gray | Gray switch → `default-gray-0…1000` |
| Default Colors | Value | Raw palette primitives |
| Fonts / Default Font / Display Font | Font 1–5 | Inter, Playfair Display, Roboto, Merriweather, Ms Madi |
| Font Size | — | 8 → 128 |
| Font Line Height | Default, +4, +8, +12 | |
| Font Weight | Default, Italic | Light → Black |
| Letter Spacing | Default, +1, +2, +3 | |
| Spacing | Value | `Base Spacing/*` |
| Radius | Default, Sharp, More | `R 0` → `R 72` |
| Stroke | 1–10 | |
| Opacity | — | 0 → 95 |
| Max Width | — | Desktop/Tablet 1128, Mobile 696 |

Mapping rules for code:
- Primitives → CSS vars on `:root`; semantic Color Mode → `:root` (Light) and `.dark` (Dark).
- Theme modes (Primary Colors, Gray Theme, Radius, fonts) → `data-*` attributes on `<html>` (e.g. `data-primary="indigo"`, `data-gray="blue"`, `data-radius="sharp"`).
- Map shadcn's expected vars (`--background`, `--foreground`, `--primary`, `--border`, `--radius`, …) onto the semantic tokens so shadcn components pick them up. **Not done yet** — shadcn's defaults in `globals.css` are still active, so stock shadcn classes (`bg-primary`, `border-border`, `ring-ring`) don't follow the design yet. Until mapped, style components with design-token utilities (`bg-primary-500`, `text-base-800`, `outline-base-100`).
- Expose tokens to Tailwind via `@theme inline` so utilities like `bg-primary-500`, `text-base-900`, `rounded-r12` work.

## Component rule: shadcn/ui first (mandatory)

**Every UI component must be built on shadcn/ui.** No hand-rolled primitives.

- Before building anything, check the shadcn registry (`shadcn` skill / shadcn MCP in `.mcp.json`) for an existing component or block. If one exists, add it with `npx shadcn@latest add <name>` — don't reimplement.
- Domain components (`src/components/<domain>`) are compositions of shadcn primitives from `src/components/ui` (e.g. `ProductCard` = `Card` + `Badge` + `Button`).
- Customize shadcn components via tokens (CSS vars) and `cva` variants — not by duplicating or rewriting them.
- Need something shadcn doesn't have? Build it in the shadcn style: Radix/Base UI primitive + Tailwind + `cn()` + `cva`, placed in `src/components/ui`.
- Figma components map 1:1 to shadcn components where possible (link with Code Connect).

## Conventions

- Components: `src/components/ui` (shadcn primitives), `src/components/<domain>` (product, cart, checkout, layout).
- One component per file, PascalCase filename, named export.
- Server Components by default; add `"use client"` only when needed.
- Use `cn()` from `@/lib/utils` for class merging; variants via `cva`. shadcn CLI generates `import { cn } from "cn"` — rewrite it to `@/lib/utils`, whose `cn` knows the token font sizes (otherwise `text-16` is dropped next to `text-base-900`).
- Figma strokes are inside the box: use `outline -outline-offset-1 outline-<token>` instead of `border` when the element's size must match Figma.
- Component previews live at `src/app/design-system/<component>/page.tsx`.
- Accessible by default: semantic HTML, keyboard support, visible focus, alt text.
- Responsive: mobile-first, container max width from `Max Width` tokens.
- Icons: use the Figma icon asset (download via `get_design_context`, save to `public/icons/`), not a lucide look-alike, when the design specifies one.

## Known gaps (update when fixed)

- shadcn vars not mapped to tokens (see Mapping rules).
- Fonts not loaded: `layout.tsx` still loads Geist; Inter / Playfair Display / Roboto / Merriweather / Ms Madi need `next/font` wired to `--font-family-*`.
- Figma icon SVGs have a hardcoded fill (`#808080`), so they don't follow dark mode.
- `ActivityIcon` is missing Figma types Start Date, Deadline, Avatar Image, Avatar Text (not fetched: Figma MCP rate limit). Rounded corner at 24/20px uses `r6` — unverified against Figma.

## Skills to use

- `shadcn` (official, `npx skills add shadcn/ui`) — shadcn/ui components, CLI, `components.json`-aware
- `figma:figma-use`, `figma:figma-generate-library` — build components/variables in Figma
- `figma:figma-design-to-code` — implement Figma nodes in code
- `figma:figma-code-connect` — map Figma components to code
- `frontend-ui-engineering`, `ui-styling`, `vercel:react-best-practices` — UI code quality
- `vercel:deploy` — deploy

## Commands

- `pnpm dev` — dev server
- `pnpm build` — production build (run to verify changes)
- `pnpm lint` — ESLint
- `pnpm exec shadcn add <name>` — add a shadcn component

Versions: Next.js 16 (read `node_modules/next/dist/docs/` before using unfamiliar APIs — see `AGENTS.md`), React 19, Tailwind v4. shadcn style `base-nova` on **Base UI** (`@base-ui/react`, not Radix); `cn()` comes from shadcn's `cn` package.
