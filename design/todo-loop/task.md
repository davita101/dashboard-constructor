# Task
Fix the "uncached data during prerendering … outside <Suspense>" dev log on `/dashboard/projects/new`.

## TODO item
- [ ] Supervisor browser check: `/dashboard/projects/new` logs on every load (dev, signed in): `Route "/dashboard/projects/new": Next.js encountered uncached data during prerendering or a navigation. fetch(...) or connection() accessed outside of <Suspense>` (component stack: DashboardLayout). Other dashboard routes are clean. (full line in design/backend/TODO.md)

## Goal
Loading `/dashboard/projects/new` (dev, signed in) prints no such error; `pnpm build` does not report it.

## Files
- `src/app/dashboard/projects/new/page.tsx` (awaits `searchParams` at page level, no Suspense, no `loading.tsx` of its own)
- `src/app/dashboard/projects/loading.tsx`, `src/app/dashboard/layout.tsx`, `src/app/dashboard/projects/page.tsx` (clean sibling for comparison), `src/app/dashboard/projects/[slug]/**` (how other dynamic routes avoid it)
- `src/lib/projects/data.ts` (`getNewProjectDetail`, `cachedNow`, `getProjects`)
- `src/components/projects/ProjectPageView.tsx` and what it renders (ProjectFormDialog, chat/settings reads)
- Next docs: `node_modules/next/dist/docs/` (cacheComponents, "uncached data", Suspense, `searchParams`)

## Steps
1. Run `pnpm dev`, request /new with the dev log visible, reproduce (a plain curl may be enough to see the server log; if not, rely on build output).
2. Find the uncached read: likely the `await searchParams` in the page (request-time data outside Suspense), or `getProjects()` (uses `getViewerId()` → auth()). Compare with `/dashboard/projects` page which is clean.
3. Fix minimal: e.g. move the request-time reads into an async child component wrapped in `<Suspense fallback={...}>` (reuse the existing skeleton/loading UI), or drop the `searchParams` await if `tab` is unused for a blank project, or cache with "use cache" + tag. Prefer the smallest change that keeps behavior identical.
4. Keep `/dashboard/projects/new` working: renders blank project form, `?tab=` still honored if it was.

## Acceptance
- `pnpm exec tsc --noEmit` clean; `pnpm lint` 0 errors; `pnpm build` succeeds and output has no "uncached data" / "outside of <Suspense>" message for /dashboard/projects/new.
- `pnpm dev` + request `/dashboard/projects/new` (and `/dashboard/projects`): dev server output shows no such message. Report what was observed.
- Grep changed files: no hex colors, `space-[xy]-`, `dark:`.

## Decisions
Smallest fix wins; no UI change. No Figma involved.

## Don't
- No schema/DB changes, no new UI, no changes to other routes beyond what the fix needs.
- Don't edit `.env.local`.
