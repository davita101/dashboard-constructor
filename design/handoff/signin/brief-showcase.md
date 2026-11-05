# Brief: Sign In carousel showcase slides + autoplay (pass 3)

Builds on the approved layout (pass 2). Only `src/components/auth/auth-showcase.tsx` (and small new files next to it, plus dependency changes) may change. The page, `SignInForm` and the panel sizes stay as they are. Read `design/style-decisions.md` first.

## 1. Six different showcases, one per slide
Slide 1 stays the metric tiles (title "New Features"). Slides 2-6 swap ONLY the content block; the photo, the 20% black layer, the title position, the dots and the fixed panel height are identical on every slide. Each slide has its own title (same text style as "New Features": 24/36 at lg+, 18/28 below lg) and a content block that fits the same box as slide 1:
- desktop (lg and up): about 524px wide, up to 352px tall (title, 80px gap, content);
- 360: 280px wide, up to 692px tall.
Content must never be taller than the slide 1 block at either size (the panel height is fixed, nothing may overflow or resize it).

| # | Title | Components (compose them like their design-system previews do) |
|---|---|---|
| 1 | New Features | metric tiles (exists) |
| 2 | Track Your Tasks | `src/components/task` (task card / list; see `src/app/design-system/task/page.tsx`) |
| 3 | Stay Notified | `src/components/ui/notification.tsx` (see `src/app/design-system/notification/page.tsx`) |
| 4 | Plan Your Week | `event-calendar.tsx` / `calendar-event.tsx` / `date-picker.tsx` (see their preview pages) |
| 5 | Share Files | `file-upload-card.tsx`, `file-upload-item.tsx` (see `src/app/design-system/file-upload/page.tsx`) |
| 6 | Meet Your Team | `profile-card.tsx` with avatars (see `src/app/design-system/profile/page.tsx`) |

Rules for these slides:
- Compose from existing components only. Copy the composition from the preview page, not the preview's page chrome. Do not edit those components. If one cannot fit the box, pick the smallest variant or a subset (e.g. two cards, not five); say so in your reply.
- Data is placeholder copy; keep it short and realistic. Images/avatars come from `public/images/` (existing files only).
- Each slide's content block is its own small component in the same file or a sibling file `auth-showcase-slides.tsx`. Keep the data-driven array of slides in `auth-showcase.tsx`: `{ title, photo, content }`.
- Photos: reuse the six existing `hero*.jpg`.
- Dots (6) stay pinned as today and reflect the active slide.

## 2. Autoplay every 2.5 seconds
- Add `embla-carousel-autoplay` (`pnpm add embla-carousel-autoplay`; version matching `embla-carousel-react`'s major) and pass `Autoplay({ delay: 2500, stopOnInteraction: false, stopOnMouseEnter: true })` as a plugin to `Carousel` (`plugins` prop exists).
- Loop is already on. Pause while the pointer is over the panel or focus is inside it (`stopOnMouseEnter`, `stopOnFocusIn`); resume afterwards.
- Do not autoplay when the user prefers reduced motion (`window.matchMedia("(prefers-reduced-motion: reduce)")`); create the plugin only when motion is allowed.
- `Carousel` lives in `src/components/ui/carousel.tsx` and already takes `plugins`; do not change its look. Only change it if the plugin cannot be passed through.
- Extras allowed: the reduced-motion rule and pause-on-hover/focus (log both in `design/page-additions.md`). Nothing else.

## Checks
`pnpm exec tsc --noEmit`, eslint on changed files, `pnpm -s audit:component` on new .tsx, `pnpm build`. Screenshots at 360 and 1600 with slide 1 and at least two other slides (click the dots via a script, e.g. a short script in `scripts/.ev.mjs` that you delete afterwards). Confirm the panel height is identical on every slide. Do not commit or push.
