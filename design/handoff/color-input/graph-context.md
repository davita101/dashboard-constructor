# Color Input — graph context (graphify query, budget 1500)

Reuse candidates found in the graph:

- **Input** — `src/components/ui/input.tsx`: `inputVariants` (colors/states), `inputSizeVariants`, types `InputSize`, `InputShape`, `InputStatus`, `Input()`.
- **InputGroup** — `src/components/ui/input-group.tsx`: `inputGroupVariants`, `inputGroupAddonVariants`, `InputGroupAddon`, `InputGroupInput`, `InputGroupText`, `InputGroupIcon`, `InputGroupButton`, `InputGroupTag`, `InputGroupKbd`, `InputGroupAvatar`. Input page lists "Colors swatch" slot as not built: Color Input should add it here (a swatch slot) rather than a new wrapper.
- **Field** — `src/components/ui/field.tsx`: `Field`, `FieldHeader`, `FieldLabel`, `FieldLabelIcon` (Top/Bottom text, label help icon).
- **Input OTP** — `input-otp.tsx` (`inputOTPSlotVariants`) — pattern for per-size × state cva.
- **Textarea** — `textarea.tsx` reuses `inputVariants` + own size cva: same pattern for a color-specific size map.
- **Button** — `buttonVariants` (`button.tsx`) for any picker/trigger button.
- **Kbd** — `kbdVariants` (not likely needed).
- **Icons** — `public/icons/material-help.svg` (label help), `material-verified.svg`; masks via `AlertIcon` pattern.
- **Color lists** — `progress-colors.ts` (palette color list) may help for swatch color names.
- **Design-system pages** — `src/app/design-system/input/page.tsx` (`Section`, `StateField`, `SlotRow`, `states`), `input-otp/page.tsx` (Section/Caption pattern): copy layout for `/design-system/color-input`.
- Notes: Hex-to-token color matching (no variable names in TalkToFigma); shadcn vars not mapped to tokens — use design-token utilities.
