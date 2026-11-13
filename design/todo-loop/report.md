# Report 9f-2

## Changed
- `src/components/ui/avatar.tsx`: `Avatar` `progress?: number` prop (clamped 0-100, `data-progress`, decorative `avatar-progress` span, conic-gradient ring masked to 2px, track primary-alpha-20, arc primary-600, 12 o'clock clockwise; progress wins over `story`). New `AvatarCounter` slot (`data-slot="avatar-counter"`, wraps `Badge` red, `square-16`, `square-12` for avatar size <= 32 via a size context, `absolute -top-1 -right-1 z-10`), exported.
- `design/known-gaps.md`: removed "not implemented" parts (lines 5, 58), added assumed-position line.
- `design/backend/TODO.md`: noted no ContentCard in src.

## Decisions
- Ring inset is `-inset-0.75` (3px = 1px gap + 2px stroke, gives Figma 66px box on 60px avatar), not `-inset-1.5` as task text (that gives 72px).
- Size for counter via React context (Badge cva sizes cannot be switched by group-data).
- Rounded shape ring radius = `--avatar-r` + 3px.
- `shadcn` Skill tool not available in this session; no new shadcn component needed, built on existing `Badge`.

## Commands
- `pnpm exec tsc --noEmit` PASS (0 errors)
- `pnpm lint` PASS (0 errors, 1 known command.tsx warning)
- `pnpm build` PASS
- grep for hex / `space-[xy]-` in avatar.tsx: no hex or space-x/y; only match for `dark:` is the pre-existing fallback variant key `dark: "from-base-800..."` (not a Tailwind `dark:` modifier).
- No visual check (no design-system page, per task).
