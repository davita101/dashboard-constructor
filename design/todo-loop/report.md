# Report 9b-2
Changed `src/app/globals.css`: shadcn `:root` vars now `var(--token)` refs; `.dark` block removed (tokens flip in color-mode.css). `--radius: var(--r-10)`.
Mapping: background→background-0, foreground/*-foreground→base-900, card/popover/sidebar→base-0, primary/ring→primary-500, primary-foreground→white, secondary/muted/accent→base-50, muted-foreground→base-500, destructive→danger-500, border/input→base-100, chart1-5→primary-200..600.
Vars used (all verified in color-mode.css/themes.css): background-0, base-0/50/100/500/900, primary-200..600, white, danger-500, r-10.
Decision: card = base-0 (white Light, gray-900 Dark, above background-0 gray-960). Clerk shadcn theme will now follow tokens.
Commands: tsc PASS; lint PASS (0 errors); build PASS; grep oklch/.dark in globals.css: no match.
CLAUDE.md "Not done yet" line updated.
