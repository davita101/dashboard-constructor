# Task
Load the six Figma fonts with next/font and wire them to `--font-family-*`, dropping Geist.

## TODO item
- [ ] 9b-1 Fonts: load Inter/Playfair Display/Roboto/Merriweather/Ms Madi/Source Code Pro via next/font onto `--font-family-*` (replace Geist) (no design-system pages exist: skip the font-sans part)

## Goal
Switching `data-font` / `data-display-font` on `<html>` (font-1..5 = Inter, Playfair Display, Roboto, Merriweather, Ms Madi) actually changes the rendered font; code snippets/message use Source Code Pro via `font-mono`. Geist Mono removed. Default look (Inter) unchanged.

## Files
- `src/app/layout.tsx` (next/font/google imports, className variables)
- `src/app/globals.css` (`:root` font-family overrides, `--font-mono`)
- read: `src/styles/primitives.css` (~1263), `src/styles/themes.css` (~1243), `node_modules/next/dist/docs/` font docs
- Do NOT hand-edit `src/styles/*` (generated).

## Steps
1. In layout.tsx replace Geist_Mono with Source_Code_Pro; add Playfair_Display, Roboto, Merriweather, Ms_Madi (weight "400" where required; Ms Madi has only 400; Roboto/Merriweather need explicit weights; use `display: "swap"`, subsets latin). Each gets a `variable` (`--font-playfair`, `--font-roboto`, `--font-merriweather`, `--font-ms-madi`, `--font-source-code-pro`). Add all variables to `<html>` className.
2. In globals.css extend the existing `:root` override block so each `--font-family-<name>` is `var(--font-x), "Name", <existing fallback stack>` (same pattern as Inter; fallbacks copied from primitives.css).
3. `--font-mono: var(--font-source-code-pro), ui-monospace, monospace` in `@theme inline`.
4. Only load weights actually needed to keep payload small (Roboto 400/500/700, Merriweather 400/700, Playfair variable, Inter as-is).

## Acceptance
- `pnpm exec tsc --noEmit` clean; `pnpm lint` 0 errors; `pnpm build` passes.
- `grep -rn "geist" -i src` returns nothing.
- `grep -n "font-family-" src/app/globals.css` shows all 5 families overridden.
- Built CSS/HTML of `/` references the 5 new font variable classes on `<html>` (check `.next` output or dev HTML).
- No hex colors, `space-[xy]-`, `dark:` added.

## Decisions
- Split 9b: shadcn var mapping is 9b-2 (visual risk, own task).
- `font-sans` on design-system page main skipped: no design-system routes exist in src/app.
- Source Code Pro replaces Geist Mono as `--font-mono` (Figma Message/Code Snippet use it).

## Don't
- Don't edit generated `src/styles/*`, don't touch shadcn var mapping, don't create design-system pages, don't change the default font (Inter).
