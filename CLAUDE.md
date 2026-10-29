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
3. **Components → code** — implement each Figma component, reusing/extending shadcn/ui primitives. Link with `figma:figma-code-connect` (needs the official Figma MCP).
4. **Pages** — compose pages from components only.

### Per-component checklist (mandatory, in order)

1. **Read Figma with TalkToFigma** (`mcp__TalkToFigma__*`) — always, not the official Figma MCP. `get_document_info` → `get_nodes_info` on the component sets → `export_node_as_image` for visual reference. For token names, layout and padding use the dump in `design/figma-dump/<page-id>/tree.txt` (`pnpm figma:fetch <node-id>`, needs `FIGMA_TOKEN`); icon SVGs are in its `assets/`.
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
- Single-color icons that must follow a variant or dark mode: render the SVG as a CSS mask so the token sets the color — `bg-<token> mask-[url(/icons/x.svg)] mask-contain mask-center mask-no-repeat` (see `AlertIcon`).

## Known gaps (update when fixed)

- shadcn vars not mapped to tokens (see Mapping rules).
- Fonts not loaded: `layout.tsx` still loads Geist; Inter / Playfair Display / Roboto / Merriweather / Ms Madi need `next/font` wired to `--font-family-*`.
- Figma icon SVGs have a hardcoded fill (`#808080`), so they don't follow dark mode.
- Avatars: Figma "Progress" ring and the "Badge-Square-Pilled" counter overlay are not implemented (TalkToFigma gives no arc/stroke-weight data; `Badge size="square-12"` now exists to build the overlay). Story ring assumes a 2px stroke.
- Badge: token names were recovered by matching Figma hex values to Light-mode tokens (TalkToFigma gives no variable names), so a shade could be a same-hex neighbour. Icons and the dot use the text color (Figma icons are one shade off: `-50` on solid, `-600` on soft). Shadows assume `Shadows/<color>/1` on solid styles only. Badge-Square-Rounded 60 uses 14/24 text (Figma: 11/20) and Badge-Icon-Rounded 16 uses r6 (Figma: r4).
- `VerifyIcon` uses Material's `verified` path (`public/icons/material-verified.svg`) because TalkToFigma can't export the vector; badge colors assume the palette's 500 shade. Verify both against Figma when the official MCP or `FIGMA_TOKEN` is available.
- TalkToFigma doesn't report layer visibility or stroke weights: check exports to see which layers are on by default.
- Code Connect not set up (TalkToFigma can't do it; needs the official Figma MCP).
- No blur or effect-shadow tokens: the 15px backdrop blur (Figma background blur 30) and the `0 1px 2px` shadow on `--shadow-<color>` for `Shadows/<color>/1` are unverified literals in `button.tsx` / `alert.tsx`.
- Breadcrumb: Figma Breadcrumb-Group shows every item as Default; `BreadcrumbTrail` renders the last item as Selected (current page). The Arrow `Active` state has no usage in Figma, so the trail never picks it. Icon glyphs are `base-500` on Base badges (Figma `#808080`).
- Button: shadows are `Shadows/<color>/1` on every state (Figma uses `/3` on a few Hover variants). Figma's Icon-type 16 uses r6; `icon-16` uses r4 (Round type). `ButtonCounter` takes the badge size and style explicitly (map per variant/size is in `/design-system/button`). Figma names two soft sets wrongly (`Danger-Button` 11696:366102 = `danger-soft`, `Success-Soft-Button` 11698:377667 = `warning-soft`).
- Button Group: group `size`/`shape` must match its Buttons' (no context). Items overlap by 1px everywhere; Figma's Rounded Type=Default 60 uses a 1px gap instead (group 10px narrower). Not added with `shadcn add` (it would overwrite `separator.tsx`); `ButtonGroupText` from upstream is left out (not in Figma).
- `ActivityIcon` Deadline check mark is hand-drawn from a PNG export (TalkToFigma exports SVG as PNG); swap in the Figma vector when the Figma MCP is available.

## Skills to use

- `shadcn` (official, `npx skills add shadcn/ui`) — shadcn/ui components, CLI, `components.json`-aware
- `figma:figma-use`, `figma:figma-generate-library` — build components/variables in Figma
- TalkToFigma MCP (`.mcp.json`) — **always** use it to read Figma (see Per-component checklist)
- `figma:figma-design-to-code` — implement Figma nodes in code (official Figma MCP only)
- `figma:figma-code-connect` — map Figma components to code
- `frontend-ui-engineering`, `ui-styling`, `vercel:react-best-practices` — UI code quality
- `vercel:deploy` — deploy

## Commands

- `pnpm dev` — dev server
- `pnpm build` — production build (run to verify changes)
- `pnpm lint` — ESLint
- `pnpm exec shadcn add <name>` — add a shadcn component

Versions: Next.js 16 (read `node_modules/next/dist/docs/` before using unfamiliar APIs — see `AGENTS.md`), React 19, Tailwind v4. shadcn style `base-nova` on **Base UI** (`@base-ui/react`, not Radix); `cn()` comes from shadcn's `cn` package.
