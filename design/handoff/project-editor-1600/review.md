# Fix pass: project page vs Figma 14061:76419 (browser check at 1600)

Apply exactly these. Figma layer data in `tree.txt` (line ranges given). Do not touch the sidebar or `ProjectMembersCard`.

1. **Stat tiles, small (`ProjectStatTile` default size)** — tree 224-369. Head (icon 20 + label 11/700) and value are **horizontally centered** in the tile. Today both are left-aligned.
2. **Stat tiles, wide (Project implementation, Deadline)** — head stays left with the more menu on the right; the **value is centered** horizontally and vertically in the remaining space. Today left-aligned.
3. **Project Stages item** (`ProjectStagesCard`, tree 394-~460, read the Stage item rows for sizes): layout is two rows split by a horizontal `Separator`:
   - top row: number badge in its own left cell (~40 wide), **vertical `Separator`**, then the stage name 11/700.
   - bottom row: left cell `flag` tasks · `group` members · `cloud` files; **vertical `Separator`**; right cell `alarm` start · `alarm` end. Icons 16 before each number (icons may be missing files, keep the paths).
   - The list is taller than the card: ScrollArea shows its scrollbar and the 5th item is cut at the bottom (card height stays 504; don't grow it).
4. **Latest events** (`[slug]/page.tsx`): pass **all** events + projects (same as the overview page), not only this project's. In Figma the list is full and scrolls, with several project groups. The card height must match the lower group (728, already `lg:h-182`).
5. **Events group head on this page** — Figma (tree, Latest events group head) shows logo 28 + name 11/700 + "7 Events" on **one line** (count after the name, base-500). If `ProjectEventsCard` stacks them, add a `groupHead="inline"` prop (default stays stacked so the overview page is unchanged) and use it here.

Check: `pnpm exec tsc --noEmit --incremental false`, eslint on changed files, `pnpm build`. Don't commit. Reply ≤8 lines.
