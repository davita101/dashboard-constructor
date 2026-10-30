# Double Input — graph context (graphify query, budget 1500)

Reuse, do not re-create:
- `src/components/ui/input.tsx`: `Input`, `inputVariants` (colors/states), `inputSizeVariants`, types `InputSize`, `InputShape`, `InputStatus`.
- `src/components/ui/input-group.tsx`: `InputGroup` (`inputGroupVariants`), `InputGroupAddon` (`inputGroupAddonVariants`), `InputGroupInput`, `InputGroupText`, `InputGroupIcon`, `InputGroupButton`, `InputGroupTag`, `InputGroupKbd`, `InputGroupAvatar`, `InputGroupSwatch`.
- `src/components/ui/field.tsx`: `FieldHeader`, `FieldHint` (Top/Bottom text, sizes 60/48/40/32).
- `src/components/ui/separator.tsx`: `Separator` for any divider between the two inputs.
- `src/components/ui/button.tsx` (`buttonVariants`, `ButtonCounter`), `src/components/ui/kbd.tsx` (`kbdVariants`), `src/components/ui/color-swatch.tsx`, `src/components/ui/input-otp.tsx` (pattern for split fields with a style context), `src/components/ui/textarea.tsx`.
- Icons in `public/icons/` (e.g. `material-help.svg`), rendered as CSS masks per CLAUDE.md.
- Preview pattern: `src/app/design-system/input/page.tsx` (`StateMatrix`), `src/app/design-system/color-input/page.tsx`.
- `cn()` from `@/lib/utils`.
