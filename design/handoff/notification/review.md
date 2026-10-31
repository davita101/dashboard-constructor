# review attempt 1
1. known-gaps.md Notification line wrong. "link/progress colors use primary theme" = not a gap, Figma gives `blue-600`/`blue-alpha-20`. Icons "not drawn" false: `NotificationIcon` draws `material-default-icon.svg`. Rewrite line: only stroke width/effects/placeholder images. Keep one line.
2. Link primary (Notifications-01 Links, 02, 03, 05): Figma fill `blue-600`. `Link variant="primary"` uses `--primary-*`. Add Link variant (e.g. `blue`) in `link.tsx` with `--link-fg:var(--blue-600)`, use on page. No className colors.
3. Progress in 02: Figma stroke `blue-600` (track `blue-alpha-20`). Page uses `Progress` default (primary). Add `Progress` variant in `progress.tsx` with those tokens. Same for 03/04 avatar Story/Progress rings if drawn.
4. 04 Figma image (img/notifications-04.png): avatar shows no red badge/green status dot. Code shows both. Match image or confirm via tree; tree lists them, image hides → follow image, drop.
5. Re-run `pnpm -s audit:component`, `pnpm -s shot notification`.
