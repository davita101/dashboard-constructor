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
- Calendar: shadcn `Calendar` (react-day-picker) is a date picker, so the Figma event scheduler is custom (`calendar-event.tsx`, `event-calendar.tsx`). Time pills use Badge `soft-border`, whose primary text is `primary-600` (Figma `-650`). Year view not built (its mini months live on another Figma page; likely shadcn `Calendar`). Mobile week view keeps the 40px time column (Figma narrows it).
- Tabs: the `pill` variant is Figma Switcher-Horizontal-Pilled-Group Small (32) Fill only, read from the Calendar page; build the full Switcher from its own Figma page. Trigger styles moved to a `cva` keyed by the list variant (via context).
- Input: colors are Figma hex matched to Light tokens (REST dump was rate limited, no variable names): stroke base-100/150/200, value base-900, placeholder base-700, ring base/danger/success-alpha-20, error danger-500 stroke + danger-600 text (Pilled Error uses #dc2626 in Figma), success success-600, disabled background-20 + base-300 (Figma uses #666 on Rounded S/Micro). Ring is a 4px inset shadow with the stroke moved 4px in (TalkToFigma gives no stroke weight). Disabled Top/Bottom fade is `opacity-50` (Figma opacity unreadable). Filled uses `:placeholder-shown`, so inputs need a placeholder. `material-help` is Material's `help` path (`public/icons/material-help.svg`), not the Figma vector. Field/InputGroup `size`/`shape` must match (no context); slot sizes (tag/button/kbd/avatar per input size) and addon paddings are guesses (Figma auto-layout paddings unreadable). `status="active"` pins the focus look for previews. Not built (components missing): Checkbox, Radio, Switcher, Select, Country flag, Payment card, Colors swatch slots.
- Checkbox: colors are Figma hex matched to Neutral Light tokens (no variable names): stroke base-100, checked primary-600 / base-900 (`primary-dark` stroke base-800), disabled base-30 fill + base-60 stroke, disabled glyph base-200 (guessed from export), card Active stroke base-alpha-50, card Dislabled background-20. Check glyph is Material `check` (`public/icons/material-check.svg`), minus is a hand-drawn rounded bar (`checkbox-minus.svg`), not the Figma vectors. Paddings/gaps (text gap 12, vertical gap 4, card p-2/p-3/p-4, card gap 20, links gap 16) and type (14/20 medium, links 12/20 semibold) are measured from exports. Figma disabled text is inconsistent (Checkbox-Text Horizontal #999, Vertical #808080; Card #808080): code uses base-400 for Text sets and base-500 for Card; Figma Checkbox-Text Dislabled Horizontal shows the default box, code always uses the disabled box. Card disabled media/links fade is `opacity-50` (Figma opacity unreadable); hidden Checkbox-Card media alternatives (avatar, badge, flag, button) are just children of `CheckboxCardMedia`. Keyboard focus on a checked box adds a base-alpha-20 ring (not in Figma).
- Radio: built like Checkbox (`radio-group.tsx` cva on shadcn `radio-group`, `radio-field.tsx` for Radio-Text / Radio-Text-Card, `radio-card.tsx`); Figma hex matched to Neutral Light tokens (no variable names, REST dump rate limited): stroke base-100, checked primary-600 / base-900 (dark stroke base-800), disabled base-30 + base-60, Additional Text base-400 (disabled base-300), card Active stroke base-alpha-50 like Checkbox (Figma #808080), disabled card background-20. Dot is 10/8px (stroke weight unreadable). Paddings measured from exports (text-card p-2 pill / p-3 r16, gap 12; card p-4 gap-5); Figma's horizontal text-card has ~20px right padding, code uses p-2. `Disabled checked` (base-200 dot) and the checked focus ring are not in Figma. Radio-Card media alternatives (avatar, badge, Visa, crypto, flag) are just children of `RadioCardMedia`. Input's Radio slot still not wired.
- Switcher: built like Checkbox/Radio (`switch.tsx` cva on shadcn `switch`, `switch-field.tsx` for Switcher-Text / Switcher-Text-Card, `switch-card.tsx`); Figma hex matched to Neutral Light tokens (no variable names, REST dump rate limited): Off base-100, On primary-600 / base-900 (dark stroke base-800), Off Disabled base-30 + base-60 with base-100 knob. On Disabled is track fill+stroke at 30% (`primary-alpha-30`; Primary Dark uses a `color-mix` of base-900 at 30%, Figma data says solid #010101 but the export is grey) and a 30% white knob read from the export, so the inner stroke shows a slightly darker edge. Stroke weight assumed 1px; the faint knob/track shadow in the export is not implemented (no effect data). Switcher-Card media/content gap is 20 (measured; spec said 16); disabled card links `opacity-30` and media `opacity-50` (Figma opacity unreadable). Figma Switcher-Text Dislabled Horizontal shows the plain Off switch; code always uses the disabled switch. Keyboard focus ring (base-alpha-20) is not in Figma. Input's Switcher slot still not wired.
- Text Area: `textarea.tsx` reuses Input's `inputVariants` for colors and states (Figma hex matched to Light tokens, REST dump 429, no variable names), so Filled stroke is base-150 and Error/Success text is danger-600/success-600 like Input (Figma keeps the box text and Bottom text grey on Text Area). Paddings measured from exports (Rounded p-5/p-4/p-3/p-3, Pilled XL p-5, L p-5, D/S p-4). Box min-heights are the Figma 200px-frame heights (128/136/144/152). Ring is Input's 4px inset shadow (stroke weight unreadable). The Figma 24px resize grip is the native `resize-y` handle (vector not exported, sits in the corner instead of ~16px in). Label/helper text uses Field sizes 60/48/40/32 (`textareaFieldSize`), so Default's Top/Bottom text is 11/20 (Figma 12/20). Disabled Top/Bottom fade is Field's `opacity-50` (Figma opacity unreadable). `ActivityForm` now adds `outline-none` to its borderless Textarea.
- Divider: `Separator` line is `base-150` and label `base-700` / icon `base-500`, from Figma hex matched to Neutral Light gray primitives (REST dump 429, no variable names). The 1px thickness and the 20px line-to-element gap are read from bounding boxes. `material-add-circle.svg` / `material-add.svg` are Material paths, not the Figma vectors. Button Icon's "+" uses Button's own text color (base-800), but Figma uses #808080. In a 180px frame, the Button Group type squeezes its lines to 0 (Figma keeps 1x1 stray "Line" rectangles there). The horizontal Button type is Rounded (r6) and the vertical one Pilled, as in the Figma export.
- Tooltip: colors are Figma hex matched to Neutral Light tokens (REST 429, no variable names): Default background-0 + base-100 stroke (an inset shadow so the arrow covers it) + base-700 text, Black base-900/80 (Figma black at 80%) + base-0 text, White background-0 + base-900 text and no arrow. The notch is a 6px rotated square (about 8 wide, 4 out), read from exports (not in node data). The `0 16px 32px` shadow-base drop shadow on Default/Black is guessed from the export (no effect data). Figma Arrow = Base UI `side` (Arrow=Bottom opens below, notch on top). 2 Lines rows use a fixed 20px label-to-number gap (Figma 99/89 widths differ per variant). `TooltipDot` has only the 600 shade of each color (Figma Dot also has 50–500, White, Black).
- Progress: `progress.tsx` (Line + Dot, cva on shadcn `progress`), `progress-circle.tsx` (Circular + Half, SVG arcs on Base UI Progress), `progress-percent.tsx` (track + Dot + always-open `Tooltip`), color list in `progress-colors.ts`. Figma hex matched to Light tokens (REST 429, no variable names): Line fill is a 700-to-600 gradient (`primary-dark` base-900 to base-700) measured from exports, track `<color>-alpha-10` (Dark base-100, Black/White alpha-30, read from Circular), Line label 600, arc 600, Circular/Half text 700 (only Primary verified). Arc stroke 2px and the 12 o'clock clockwise start / left-to-right half arc are read from exports (stroke weight and arc data unreadable). Line value label sits after the bar (gap 6/4 from the Playground), not over its end as in the component set. Percent tooltip shows the rounded value; Small dot is 6px (from export). Dot Hover/Active are a static `state` prop. `ActivityContent` progress now uses `color` (player track is primary-alpha-10, was base-100).
- Slider: `slider.tsx` (cva on shadcn `slider`, Base UI); Figma Style Dark is `variant="primary-dark"` like Progress. Figma hex matched to Neutral Light tokens (no REST dump, no variable names): thumb background-0 + primary-600 / base-800 stroke, Hover primary-600 / base-900, Active primary-800 / base-700; track primary-alpha-15 / base-alpha-15; range primary-600 / base-900 (track and range layers missing from node data, colors and 4px/2px thickness read from exports and Slider-Percent). Thumb stroke assumed 1px. Slider-Percent bubble is the Tooltip `default` style (stroke, arrow, shadow) always open with `sideOffset` 12 (gap and arrow estimated from the 52px Dot frame). Figma Range Small Primary uses solid filled dots instead of Runner instances; code always uses the Runner look. Close bubbles overlap as in Figma (no collision handling). Disabled `opacity-50` and the base-alpha-20 focus ring are not in Figma. Active = pressed/dragging.
- Steps: `steps.tsx` (no shadcn base; one `Step` with `layout` inline/tab/stacked/list/compact for Step-Component-01..04 and Group-05, slot colors as CSS vars, connectors are `Separator`). Figma hex matched to Neutral Light tokens (REST 429, no variable names): Selected 01 gradient primary-500 to 600 (`primary-dark` base-700 to 900) with a solid 1px accent stroke (Figma gradient stroke and stops unreadable), Default stroke base-100 / number base-800 / description base-500, Done 01 success-500 to 600 (green read from export), Disabled background-20 + base-50 stroke + base-200 text (Figma opacity unreadable), outline layouts stroke base-200, 04 description base-300, 03 description base-500, tab eyebrow base-400 / heading base-500 (Dark 700/800, line base-800). Paddings and gaps measured from exports (01 gap 20/20/16/12, group gaps 28/28/24/20, vertical 20, tab pt/pb 16 + gap 8 + px 8, 04 gap 24, dots gap 12, label gap 16); line weights read from exports (tab/compact 1px, stacked/list 2px). Number text is 12/16 semibold at every size. Check is Material `check`, the 8px dot is a plain circle (Figma vectors not exported). Steps-Dot Hover halo is a 4px primary-alpha-20 ring (from export). Figma colors the first Active step's right line (03 Lines=Right Line); the preview mirrors it, `StepSeparator reached` is set by the consumer. Group-02 Fill (1278x144, two rows?) is one stretched row.
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
