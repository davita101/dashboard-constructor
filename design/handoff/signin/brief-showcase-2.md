# Brief: Sign In carousel slides 2-6, fill the panel (pass 4)

Only `src/components/auth/auth-showcase.tsx` and `src/components/auth/auth-showcase-slides.tsx` change (plus `design/page-additions.md`). Slide 1 (metric tiles), the photo, overlay, dots, autoplay and the fixed panel height stay exactly as they are. Existing design-system components are not edited. Read `design/style-decisions.md` first.

## Problem
Slides 2-6 show small components that float in the middle of a big photo panel (lots of empty photo around a 150-250px block). Slide 1 fills a 524x352 block at lg and 280x692 at 360. Every slide must read as the same weight as slide 1.

## Rules (from the UI/UX review)
1. **Same box as slide 1.** At lg the content block is 524px wide and fills about 352px of height (title row not included); at 360 it is 280px wide and fills up to 692px. Target: content uses at least ~85% of that box height and 100% of its width. Never taller than slide 1's block (the panel height is fixed, nothing may overflow or push the dots).
2. **Hierarchy.** Title (as today) plus a one-line subtitle under it on slides 2-6: `text-16 leading-24 text-white-alpha-80` (14/20 at 360), one short sentence, max ~45 characters. It sits inside the existing gap between title and content; do not move the title or the content block. Slide 1 stays as Figma draws it (no subtitle).
3. **Scale up, not out.** Use the larger variants/sizes of the components, or more items, instead of leaving air. Stretch rows to the full block width (`w-full`, flex column, 12px gap = the same gap as slide 1's tiles). Equal gaps between items; no item smaller than 40px high (touch/readability).
4. **Consistent rhythm.** Same 12px gap between items on every slide (24px between columns at lg, as the tile grid); same corner radius family (the components already carry it). No new colors, shadows or borders; the components are already white cards on the photo.
5. **Content, per slide** (placeholder copy, short and realistic):
   - 2 Tasks: 4 `TaskList` rows (mix of done / in progress / not started) filling the full width; if `TaskList` cannot be taller or wider, wrap rows in the existing task card container used in `/design-system/task`.
   - 3 Notifications: 4 notifications, full width, 12px gap. The notification icon currently renders as an empty ring: use an icon that exists in `public/icons` (grep for a bell/mail/check-circle `material-*.svg`); if none fits, keep it and note it. Different thumbnails: use different existing images from `public/images/` (avatars or activity images), not the same flower four times.
   - 4 Calendar: three day columns (as now) but with 3-4 events per column using the full and compact `CalendarEvent` variants so the block fills the height; or the full `EventCalendar` if a variant fits the box.
   - 5 Files: the `FileUploadCard` drop area on top (compact) plus 2-3 `FileUploadItem` rows (done, uploading with progress, done) so the whole box is used.
   - 6 Team: two `ProfileCard`s side by side at lg (each 250px like the slide 1 tiles) and stacked at 360, using the largest layout that fits the box; otherwise list-layout cards with 3 rows each.
6. **Responsive.** Check 360 and 1600, and 768 (stacked, centered, 640 max). At 360 stacked layouts may use the extra height up to 692px.
7. **Accessibility.** Keep text contrast at least 4.5:1 (white subtitle on the 20% black photo layer: check the `white-alpha` step you use; use `text-white` if alpha is too low on light photo areas). Decorative images in components get empty alt. Nothing becomes focusable that was not.

## Extras (log each in `design/page-additions.md`)
The one-line subtitles on slides 2-6 (Figma draws none). Nothing else; do not add a pause button.

## Checks
`pnpm exec tsc --noEmit`, eslint on changed files, `pnpm build`. Screenshot all six slides at 1600 and at 360 (a temporary `scripts/.ev.mjs` that clicks the dots; delete it afterwards). Report per slide the content block height (px) at lg. Confirm the panel height is identical on every slide. Do not commit or push.
