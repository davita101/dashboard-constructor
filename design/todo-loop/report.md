# Report: 9b-1 fonts

## Changed
- `src/app/layout.tsx`: removed Geist_Mono. Added Playfair_Display (variable), Roboto (400/500/700), Merriweather (400/700), Ms_Madi (400), Source_Code_Pro, all latin + swap. Inter unchanged. All six `.variable` classes joined into `fontVariables`, put on `<html>`.
- `src/app/globals.css`: `:root` overrides for the 5 `--font-family-*` (`var(--font-x), "Name", <fallbacks from primitives.css>`). `--font-mono: var(--font-source-code-pro), ui-monospace, monospace`.

## Decisions
- `fontVariables` built from an array and joined, to keep the className short.
- Source Code Pro uses the default variable weight (no explicit weights).
- No design-system pages exist, so the font-sans part was skipped (as the task says).

## Commands
- `pnpm exec tsc --noEmit`: PASS
- `pnpm lint`: PASS (0 errors, 1 existing warning in `src/components/ui/command.tsx`, not mine)
- `pnpm build`: PASS
- `grep -rli geist src`: PASS (no matches)
- `grep -n "font-family-" src/app/globals.css`: PASS (5 families overridden)
- Built HTML (`.next/server/app`): `<html>` has 6 `*_variable` classes. PASS
- No hex colors, `space-[xy]-` or `dark:` added.

## Not done
- No browser check of switching `data-font`. I only confirmed the CSS and HTML output.
