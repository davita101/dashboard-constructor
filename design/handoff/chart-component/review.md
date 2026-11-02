# review attempt 1 — REJECTED

Audit ok, scope ok, console clean. Fix:

1. Progress-Half-Chart-Component (9765:27240) + Progress-Chart-Component (9760:8671): Style=`Gray 50` missing. Add variant. Figma has it in both sets (all 8 Percent). Add gray-50 option (e.g. `ProgressColor` `gray` in `progress-colors.ts` + cva in `progress-circle.tsx`/`chart-parts.tsx`, tokens from figma.md via `pnpm -s token:hex`). Render on page. Missing variant is never a gap.
2. Amount-Component (9909:1325) + Progress-Card-Component (9928:21822): `material-trending_up`, `material-trending_down`, `arrow_downward` 16x16 icons missing, `ChartTrend` has empty slot. Add SVG to `public/icons/` (material 24px viewBox glyphs, same style as `material-arrow-upward.svg`), render via mask like `AlertIcon`. Missing icon is never a gap.
3. `design/known-gaps.md` Chart Component line: remove claims for Gray 50 and missing icons. Keep only: no vector geometry (sparkline/area/map approx), Chart-Dot Border=2 weight, Pie/Donut ring width.
4. Re-run `pnpm -s shot chart-component`, compare each set to `img/*.png` after fixes.
