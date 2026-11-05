# Brief: Sign In (route /sign-in), pass 2

REPLACES the first brief. The first pass followed the wrong mobile frame. The mobile layout is the **Main (360)** frame (14056:126309), see `design/handoff/signin-main/responsive.md` ("Mobile outline") and `design/handoff/signin-main/img/mobile.png`. `design/style-decisions.md` was updated; read it first.

## Target
- >= lg (1024px): unchanged, the approved two-panel desktop (form left, carousel right). Do not touch its look.
- < lg: the 360 frame. One column, page padding 20px, 16px between the two panels:
  1. Form panel: white, radius 20, Sign-In-01 inside with 20px inset, including OR + Google/Facebook/Apple buttons (Figma 320x568 panel, form 280 wide).
  2. Photo panel: fixed 852px tall, radius 20, photo + 20% black layer. "New Features" 18/28 at 28px from the top, content inset 20px. The four tiles are stacked one per row, 280x164, 12px apart (the tile width follows the container). Dots (line, 32x4, 12 gap) 28px from the bottom.
  3. Panels are the full container width; above 360 wide they stay centered with `max-w-160` (640px).
- No header, no footer, no Sign-In-02 card on this page.

## Remove
- `src/components/auth/auth-mobile-header.tsx` and `auth-mobile-footer.tsx` (added in pass 1, now unused).
- The `template="card"` branch of `SignInForm` and every call that renders it, so `SignInForm` is rendered ONCE and the page has one form in the DOM. Keep the Clerk logic exactly as is.

## Reuse
`SignInForm` (open template), `AuthShowcase` (photo + carousel; make it responsive: padding, title size, one-column tiles, dots position below lg; the desktop look stays identical), `AuthPanel`. Tile = `ChartMetricCard size="tile"` (max-w-62.5 today; at 360 the tile is 280 wide, so allow it to grow in the single-column layout through a variant or the grid, not a className override of colors/sizes).

## Rules
Everything in `design/style-decisions.md`. Token classes only. Panel heights stay fixed (carousel never resizes the panel). No SVG writing. Extras: none beyond the existing Clerk error and loading states.

## Checks
`pnpm exec tsc --noEmit`, eslint on changed files, `pnpm -s audit:component`, `pnpm build`. Screenshots at 360 and 1600: `MSYS_NO_PATHCONV=1 pnpm -s shot /sign-in 360` (dev CSS may be stale; the build is the truth). Compare 360 with `design/handoff/signin-main/img/mobile.png` (Figma, scale 0.5) and 1600 with `design/handoff/signin-main/img/desktop.png`. Do not commit or push.
