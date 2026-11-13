# Task
Map shadcn CSS vars in `globals.css` to Figma Color Mode tokens (9b-2).

## TODO item
    - [ ] 9b-2 Map shadcn vars (`--background`, `--primary`, `--border`, `--radius`…) to Color Mode tokens in globals.css

## Goal
Stock shadcn classes (`bg-primary`, `border-border`, `ring-ring`, `bg-muted`, `text-muted-foreground`, `bg-card`, `bg-popover`, `bg-destructive`, `bg-sidebar`…) follow the design tokens, in Light and Dark and under `data-primary` / `data-gray` / `data-radius`. No hardcoded oklch left in the shadcn `:root` / `.dark` blocks.

## Files
- `src/app/globals.css` (only file to change, plus optional CLAUDE.md line "Not done yet" → done)
- Read: `src/styles/color-mode.css` (semantic tokens: `--primary-*`, `--background-*`, `--base-*`, `--danger-*`; Light on `:root`, Dark on `.dark`), `src/styles/themes.css` (`--r-*` radius vars), `src/styles/tailwind-theme.css`
- Read: `design/known-gaps-triage.md` line L5 for context

## Steps
1. Read color-mode.css names first (grep the exact `--background-*`, `--base-*`, `--primary-*`, `--danger-*`, white/black names). Never guess a name.
2. Replace the values in `:root` and `.dark` of globals.css with `var(--token)` references. Since color-mode.css already switches Light/Dark, the `.dark` block of shadcn vars can be removed (tokens flip themselves); keep nothing duplicated. Suggested mapping (adjust to real names):
   - `--background` → `var(--background-0)` or the page-bg token already used by `bg-background-20` on body (keep body class as is); `--foreground` → `var(--base-900)`
   - `--card`/`--popover` → white-ish surface token (same one Figma Card uses); `*-foreground` → `--base-900`
   - `--primary` → `var(--primary-500)`; `--primary-foreground` → white token
   - `--secondary`/`--muted`/`--accent` → `var(--base-50)` (or nearest); `--muted-foreground` → `var(--base-500)`; `--accent-foreground`/`--secondary-foreground` → `--base-900`
   - `--destructive` → `var(--danger-500)`; `--border`/`--input` → `var(--base-100)`; `--ring` → `var(--primary-500)` (or base-300)
   - `--chart-1..5` → primary/palette tokens that exist; `--sidebar*` → same as card/primary/accent/border mapping
   - `--radius` → `var(--r-10)` (so `data-radius` sharp/more follows); keep the `@theme inline` radius calc lines
3. Do not touch `@theme inline` names, `src/styles/*` (generated), or component files.
4. Run `pnpm dev`-free checks only (see Acceptance). If a page visibly relied on stock grey (e.g. Clerk card via `@clerk/ui/themes/shadcn.css`), accept; note in report.

## Acceptance
- `pnpm exec tsc --noEmit` passes; `pnpm lint` 0 errors; `pnpm build` passes.
- `grep -n "oklch" src/app/globals.css` → no match inside the `:root`/`.dark` shadcn var blocks (font/scrollbar parts untouched).
- Every `var(--x)` referenced in the new blocks exists in `src/styles/color-mode.css` or `primitives.css`/`themes.css` (check with grep, list in report).
- No hex colors, `space-[xy]-`, `dark:` added.
- `.dark` block gone or contains only vars that do not exist in color-mode.css.

## Decisions
- Single mapping, Light/Dark handled by tokens (no duplicate `.dark` values).
- `--radius` = `--r-10` so Radius theme works; shadcn calc radii keep derived values.
- Remaining unmapped components keep working since all shadcn var names stay defined.

## Don't
- No component edits, no new UI, no hand-editing generated styles, no design-system pages.
- Don't change `body` classes or fonts.
