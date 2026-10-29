# Checkbox — graph context

Source: `graphify query` (BFS, budget 1500) + file listing. The graph is stale (no nodes for
`input.tsx` / `field.tsx` / `input-group.tsx`), so those were added from a directory scan.

## No existing checkbox

- No `src/components/ui/checkbox.tsx`. Add shadcn `checkbox` (Base UI) as the base.

## Reuse

- `src/components/ui/label.tsx` — `Label` for the checkbox text.
- `src/components/ui/field.tsx` — `Field`, `FieldLabel`, `FieldDescription`, `FieldHint`, `FieldError`
  (`fieldVariants` cva) for label + description layouts next to the box.
- `src/components/ui/input.tsx` / `input-group.tsx` (`inputGroupAddonVariants`) — Input left
  "Checkbox slot" is pending (CLAUDE.md Known gaps: Input). Expose a size that fits the addon.
- `src/components/ui/separator.tsx` — `Separator` for any divider in group layouts.
- `src/components/ui/badge.tsx`, `button.tsx` — cva pattern to copy (variants keyed by size/shape,
  token utilities like `bg-primary-500`, `outline-base-200`, `rounded-r4`).
- `src/lib/utils.ts` — `cn` (must be used instead of `cn` package import).
- Icon mask pattern: `AlertIcon` in `alert.tsx` / `VerifyIcon` (`verifyIconVariants`,
  `verify-icon.tsx`) — `bg-<token> mask-[url(/icons/x.svg)] mask-contain` for single-color glyphs.

## Icons in `public/icons/`

No check / minus (indeterminate) glyph exists yet. Available: material-close, material-help,
material-expand-*, material-chevron-right, material-verified, etc. Save Figma check / minus
vectors into `public/icons/` if the spec provides them.

## Design-system pages

Existing previews: accordion, activity, alert, avatar, badge, banner, breadcrumb, button,
button-group, calendar, input. Use `src/app/design-system/input/page.tsx` / `badge/page.tsx`
as the layout template for `src/app/design-system/checkbox/page.tsx`.
