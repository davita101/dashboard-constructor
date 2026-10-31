# review attempt 1

Audit ok, scope ok, all sets present. Fix icons:

1. Icons-Component 15620:540399: only 3 of 5 icons. Figma row: local_phone, mail, chrome_reader_mode, account_box, account_balance_wallet. Add local_phone (first, purple-ish) and account_balance_wallet (last, green) as 24x24. Missing icon = missing part, not gap. Write standard Material 24px SVG paths yourself into `public/icons/material-local-phone.svg`, `public/icons/material-account-balance-wallet.svg`. Colors per `figma.md`/img tokens.
2. List-Item-Component Level 2/3/4 (5081:15236): arrow cell empty. Figma shows subdirectory_arrow_right (grey, left of item, indent grows per level). Write `public/icons/material-subdirectory-arrow-right.svg` (Material path), render as mask in arrow cell.
3. User-Component 5085:554: chevron should be keyboard_arrow_up/down. Write `public/icons/material-keyboard-arrow-up.svg` and `-down.svg` (Material paths) if expand-less/more differ; else keep.
4. Delete the "Sidebar (parts): material icons ..." line in `design/known-gaps.md` once icons added (icons are not a gap). Keep only true gaps (stroke/effects) if any.
5. Re-run `pnpm -s audit:component` and `pnpm -s shot sidebar-component`.
