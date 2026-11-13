# Report 9f-3 Size/shape context

## Changed
- `src/components/ui/field-context.tsx` (new, "use client"): `FieldProvider`, `useFieldContext()` (null outside Field).
- `field.tsx`: Field wraps its div in `FieldProvider`; re-exports `useFieldContext`. Stays server-safe.
- `input-variants.ts` (new, no client): `inputSizeVariants`, `inputVariants`, types moved out of `input.tsx`.
- `input.tsx`: now "use client"; size/shape = prop ?? Field ?? default.
- `input-group.tsx`: InputGroup size/shape = prop ?? Join ?? Field ?? default; new `InputGroupContext`; Button/Tag/Avatar/Swatch inherit shape (Avatar pill -> circle). Sizes unchanged.
- `native-select.tsx`, `textarea.tsx`: import variants from `input-variants` (they may render in Server Components; a client `input.tsx` would break calling cva there).
- `scripts/field-context-smoke.mts` (new).
- `design/known-gaps.md`: removed the two fragments (Button Group line untouched).

## Decisions
- Hook context lives in its own client file; cva split out so server consumers keep working.
- Avatar has no `pill`; maps to `circle` when group is pill.
- Input defaults had no visible change: all Field usages pair size 40 with default Input.
- Consumers (auth-field, FormField, otp, navbar) not edited; still pass same props.

## Commands
- `pnpm exec tsc --noEmit`: PASS
- `pnpm lint`: PASS (0 errors, 1 pre-existing warning in command.tsx)
- `pnpm build`: PASS
- `pnpm exec tsx scripts/field-context-smoke.mts`: 4 PASS lines, exit 0
- grep hex/space-x/dark: in new files none.

## Undone
- ButtonGroup: not in repo, skipped.
