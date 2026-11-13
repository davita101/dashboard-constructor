# Commerce Constructor 7.7 — E-commerce Website

E-commerce site built from the **Commerce Constructor 7.7** Figma design system.

## Stack

- **Next.js** (App Router, TypeScript, `src/` dir)
- **Tailwind CSS v4** (CSS-first config; design tokens generated into `src/styles/`, imported by `src/app/globals.css`)
- **shadcn/ui** (components in `src/components/ui`, add with `npx shadcn@latest add <name>`)
- Package manager: `pnpm` (fall back to `npm` if unavailable)

## Workflow order

1. **Figma first** — components live in Figma (Commerce Constructor 7.7 file), bound to the existing variables. Figma is read only through TalkToFigma; the official Figma MCP/plugin and the Figma REST API are not used.
2. **Tokens → code** — generate Tailwind theme + CSS variables from the Figma variables export.
3. **Components → code** — implement each Figma component, reusing/extending shadcn/ui primitives.
4. **Pages** — compose pages from components only.

### Per-component checklist (mandatory, in order)

1. **Read Figma with TalkToFigma** (never the official Figma MCP or the REST API): `pnpm -s figma:spec <page-id> <slug>` reads the whole page through the TalkToFigma plugin (no LLM, no tokens) and writes `design/handoff/<slug>/figma.md` (every set and variant, layer tree, sizes, radius, padding/gap, typography, colors as existing tokens) plus one PNG per set in `img/`. For a single hex: `pnpm -s token:hex "#e6e6e6" "#000000@50"`; never guess a token. The plugin exports PNG only (no SVG): reuse icons from `public/icons/`. It does not expose stroke width, effects or auto-layout settings; read those from the images.
2. **Invoke the `shadcn` skill (Skill tool) before writing any component code — every component, every time, even if shadcn was used earlier in the session or the base is already installed.** Running the shadcn CLI alone does not count. Then run `pnpm dlx shadcn@latest docs <name>` and `pnpm dlx shadcn@latest search @shadcn -q <name>`; add the base with `pnpm exec shadcn add <name>` and fix its `cn` import.
   - Before writing, list every part of the Figma component and the shadcn component it maps to. A part with no shadcn match is built in shadcn style in `src/components/ui` (`cva` + `cn`), never as a styled `div`/`span` in a domain component.
3. **Write code** following the skill's rules (below) and the Component rule.
4. **Audit** against the rules: `pnpm exec tsc --noEmit`, `pnpm lint`, and grep the new files for `space-[xy]-`, `w-N h-N`, `dark:`, hex colors.
5. **Check in the browser** at `/design-system/<component>` against the Figma export (all variants, interactions, no console errors), then `pnpm build`.

shadcn rules that bit us before:
- Dividers use `Separator` (Figma `Divider-Horizontal`), never `border-b` divs or `<hr>`.
- `className` is for layout only. Colors, sizes, radii of a shadcn component go in its `cva` variants (add a variant/size to `button.tsx`), not in a consumer's `className`.
- Sub-parts of a component (icon, close, separator) are slots in the `ui/` file (`AlertClose`, `AlertSeparator`), so domain components just compose them.
- Variants of the same shape are variants of the shadcn component, not new wrappers: Profile and logo tiles are `Avatar` `frame` variants, not a styled `<span>` around `next/image`.
- "Toast" in shadcn means a Base UI notification (`toast` component). Figma's inline "toast message" alerts are `Alert`, not toasts.

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
- Map shadcn's expected vars (`--background`, `--foreground`, `--primary`, `--border`, `--radius`, …) onto the semantic tokens so shadcn components pick them up. **Done** (`globals.css`): shadcn vars reference the semantic tokens, so stock classes (`bg-primary`, `border-border`, `ring-ring`) follow the design, Light/Dark and `data-*` themes.
- Expose tokens to Tailwind via `@theme inline` so utilities like `bg-primary-500`, `text-base-900`, `rounded-r12` work.

## Component rule: shadcn/ui first (mandatory)

**Every UI component must be built on shadcn/ui.** No hand-rolled primitives.

- Before building anything, check the shadcn registry (`shadcn` skill / shadcn MCP in `.mcp.json`) for an existing component or block. If one exists, add it with `npx shadcn@latest add <name>` — don't reimplement.
- Domain components (`src/components/<domain>`) are compositions of shadcn primitives from `src/components/ui` (e.g. `ProductCard` = `Card` + `Badge` + `Button`).
- Customize shadcn components via tokens (CSS vars) and `cva` variants — not by duplicating or rewriting them.
- Need something shadcn doesn't have? Build it in the shadcn style: Radix/Base UI primitive + Tailwind + `cn()` + `cva`, placed in `src/components/ui`.
- Figma components map 1:1 to shadcn components where possible.

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
- Single-color icons that must follow a variant or dark mode: render the SVG as a CSS mask so the token sets the color — `bg-<token> mask-[url(/icons/x.svg)] mask-contain mask-center mask-no-repeat` (see `AlertIcon`).

## Known gaps

One line per component in `design/known-gaps.md`. Read only the lines for the components you touch (`grep "^- <Component>:"`); append new ones at the end.

## Skills to use

- `shadcn` (official, `npx skills add shadcn/ui`) — shadcn/ui components, CLI, `components.json`-aware
- TalkToFigma MCP (`.mcp.json`) — **always** use it to read Figma (see Per-component checklist)
- `frontend-ui-engineering`, `ui-styling`, `vercel:react-best-practices` — UI code quality
- `vercel:deploy` — deploy

## Commands

- `pnpm dev` — dev server
- `pnpm build` — production build (run to verify changes)
- `pnpm lint` — ESLint
- `pnpm exec shadcn add <name>` — add a shadcn component

Versions: Next.js 16 (read `node_modules/next/dist/docs/` before using unfamiliar APIs — see `AGENTS.md`), React 19, Tailwind v4. shadcn style `base-nova` on **Base UI** (`@base-ui/react`, not Radix); `cn()` comes from shadcn's `cn` package.
