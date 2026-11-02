# review attempt 1

1. Message set, Type=Left/Right/Full: Name row missing 2 action icons (copy + edit). Figma shows them 16px next to "2 min ago" (Left: right of time. Right: left of name, mirrored). Code omits as gap. Missing part = not gap. Add `public/icons/material-file_copy.svg` + `public/icons/material-mode.svg` (hand-write Material Design 24 viewBox paths, single color), render as mask slot in `src/components/ui/message.tsx` (`bg-<token> mask-[url(/icons/x.svg)] mask-contain mask-center mask-no-repeat`), color token from figma.md Name row layers (check `material-file_copy`/`material-mode` fill). Wrap as button w/ aria-label.
2. Remove the icon clause (file_copy/mode) from the Message line in `design/known-gaps.md` after fix. Keep emoji/Source Code Pro/Tag slots lines.
3. Everything else ok: audit pass, scope ok, all sets/variants present, visual match. Do not touch `.codex/`.
