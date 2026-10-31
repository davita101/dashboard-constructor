# review attempt 1 — REJECTED

1. Command-Menu-Default: Checkbox checked fill blue. Figma: fill `base-900`, stroke `base-800` (black box, white check). Fix via Checkbox cva variant/props, not className.
2. Command-Menu-Controls: Switch on + Radio checked blue. Figma: black (`base-900`) switch track and black radio ring/dot. Fix in switch/radio cva variant.
3. Command-Menu-Profile-Type-1 (both Radius): missing row of 3 icon buttons (X, Instagram, Facebook; round, small, outline) between bio and Follow/Profile buttons. Add.
4. Command-Menu-Profile-Company-Type-1 (both Radius): missing row of 3 icon buttons (globe, mail, chat) between bio and Add Company/Profile buttons. Add.
5. Profile-Type-1/Company-Type-1 banner: Figma gradient image (green swoosh / orange-blue), code shows blue flower. Match per img/*.png if asset exists, else known-gaps line ok.
6. Icons: Search icon, Undo/Select All/Find icons, footer glyphs (↵ + Esc), Profile/Follow button icons show placeholder dot `material-default-icon`. Reuse any matching `public/icons/*` (`ls public/icons`); Search at least. Only truly absent glyphs may stay in known-gaps; list them concretely.
7. `.codex/` untracked in repo root, out of scope. Remove if builder made it (`git clean -fd .codex` only if untracked + not harness).
8. Re-check Corner=Pilled item radius, Active state outline vs img/command-component.png after fixes.
