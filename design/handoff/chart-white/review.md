# review attempt 1

Audit/scope/sets ok. One visual diff:

1. All cartesian sets, `Lines=Grid` (and `Lines=Line` baseline/top line): grid lines render bright light-gray/white in `pnpm -s shot chart-white`. Figma stroke is `#ffffff@0.1` = `white-alpha-10` (near-invisible on black, see `img/column-type-2-white-chart.png`). `[&_.recharts-cartesian-grid_line]:stroke-white-alpha-10` in `chartContainerVariants` `white` not winning vs recharts default `stroke="#ccc"` attr/inline. Fix: make grid color actually apply — pass `stroke` prop on `CartesianGrid` from `theme` (`var(--white-alpha-10)` white / `var(--background-100)` default) or use `!stroke-white-alpha-10`. Verify via screenshot: grid lines must be faint like Figma.
2. Same check for `Lines=Line` horizontal axis line in `column-*`/`bar-*`: must be `white-alpha-10`, not bright.
