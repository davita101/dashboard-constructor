# Input Group — graph context (graphify query, budget 1500)

`src/components/ui/input-group.tsx` already exists (shadcn input-group, extended for Input): `InputGroup` (`inputGroupVariants`), `InputGroupAddon` (`inputGroupAddonVariants`), `InputGroupInput`, `InputGroupText`, `InputGroupIcon`, `InputGroupButton`, `InputGroupTag`, `InputGroupKbd`, `InputGroupAvatar`, `InputGroupSwatch`. Extend it with variants/slots; do not duplicate.

Also reuse:
- `src/components/ui/input.tsx` (`inputVariants`, `inputSizeVariants`, `InputSize`/`InputShape`/`InputStatus`).
- `src/components/ui/double-input.tsx` (`DoubleInput`, `doubleInputVariants`: joined/horizontal/vertical stacking of inputs, 1px overlap pattern).
- `src/components/ui/button-group.tsx` (stacking/overlap pattern), `src/components/ui/separator.tsx` (`Separator`, `SeparatorGroup`), `src/components/ui/field.tsx` (`Field`, `FieldHeader`, `FieldLabel`, `FieldHint`, `FieldDescription`).
- `button.tsx` (`buttonVariants`), `kbd.tsx`, `avatar.tsx`, `color-swatch.tsx`, `badge.tsx`.
- Preview patterns: `src/app/design-system/input/page.tsx`, `src/app/design-system/double-input/page.tsx`.
- Icons in `public/icons/` as CSS masks.
