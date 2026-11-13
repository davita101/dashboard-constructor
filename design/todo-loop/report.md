# Report 6b-2

## Changed
- `src/components/dashboard/widgets/catalog.tsx`
  - `CartesianCardPreview`: with `useWidgetData()` set and kind in line / line-area / line-step / line-gradient / column-1 / 2 / 3 / 6, it passes `points` (income, cost per month) and `seriesLabels` (Income, Cost). Legend becomes Income (purple) / Cost (orange), the tones of the first two palette series. Other kinds and the picker keep the demo data and legend.
  - `RadialCardPreview`: with data set, donut and pie get `values` = [new, inWork, done, failed], `total` = sum and `totalLabel` = "Tasks". Legend is the four statuses.
  - `progress`: one ring per status, value = count ÷ total (0 when total is 0). Vertical legend, same colours as the rings.
  - `progress-half`: `RadialChart` has no data props for it, so it keeps the demo data. Not wired.
- `messages/en.json`: added `widgets.data.cost` and `widgets.data.status.{new,inWork,done,failed}`.

## Decisions
- Tones match the slice colours by index. Donut and progress use blue, green, orange, sky. Pie starts with purple (its own `pieColors`), so its legend is purple, green, orange, sky.
- Only `en.json` has `widgets` / `widgets.data`. de, es, fr and ka have no such keys, so no translation was added there.
- All-zero data: donut and pie draw no slices (already handled), progress rings have value 0, cartesian is zero-filled.

## Commands
- `pnpm exec tsc --noEmit`: PASS (no errors)
- `pnpm lint`: PASS (0 errors, 1 existing warning in `command.tsx`)
- `pnpm build`: PASS
- `curl /dashboard` returns 307 (auth redirect).

## Not done
- No visual check in the browser: `/dashboard` needs a login, which I don't have. Picker and demo are unaffected, because without data every new prop is `undefined` and the old defaults apply.
- No hex, `space-[xy]-` or `dark:` in the new code.
