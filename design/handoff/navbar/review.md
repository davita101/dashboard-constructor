# review attempt 1: REJECTED

Audit ok, scope ok (message/* + link.tsx untracked/modified = other row, ignore), build not run yet. Layout/sizes/colors close. Fix icons:

1. Navigate-01 Desktop+Mobile Heading Outline-Button (12455:7403/12462:648) + Navigate-02 all 3 Outline-Button `material-sidebar`: shows dot placeholder `material-default-icon`. Figma = sidebar icon: 12x12 rounded rect r3 + vertical bar 1.3x9.3 at left, base-500/base-600. Create `public/icons/material-sidebar.svg` (hand-write, 16x16 viewBox), use via mask icon, color base-500.
2. Navigate-01 Desktop right side bell (notifications icon, shown in img/navigate-01.png before help): dot placeholder. Create `public/icons/material-notifications.svg` (Material bell path), use it.
3. Navigate-02 Desktop/Tablet/Mobile right side bell: same `material-notifications.svg`.
4. Navigate-02 Desktop counter pill "450": Figma shows star_2 icon (Material star-outline/stars) left of 450; code shows dot. Use `material-star` or new `material-stars.svg`.
5. Dropdown chevron / Navigate-02 `Icon` slots: confirm chevron-down arrow (img shows chevron), ok if already chevron.
6. `design/known-gaps.md` Navbar line: icons drawable → not gap. Remove sidebar/notifications/stars_2 claim. Keep only hidden-layer items (Back-Applications hidden, link icons/counters).
7. Re-run `pnpm -s audit:component`, `pnpm -s shot navbar`, compare to img/*.png.
