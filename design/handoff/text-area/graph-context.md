# Text Area — graph context (graphify query, 2026-10-29)

Query: "Text Area: which ui primitives, cva variants, icons and design-system pages already exist that this should reuse" (BFS, budget 1500). Start nodes: `Textarea()` / `textarea.tsx`.

## Reuse

- `src/components/ui/textarea.tsx` — stock shadcn `Textarea` (base-nova). Still uses shadcn default classes (`border-input`, `ring-ring`, `text-muted-foreground`) **and `dark:` variants** → must be rewritten onto design tokens with `cva`, like `input.tsx`. No preview page yet.
- `src/components/ui/input.tsx` — `inputVariants` (shape/status: stroke base-100/150/200, ring base/danger/success-alpha-20 as 4px inset shadow, disabled background-20 + base-300, filled via `:placeholder-shown`) and `inputSizeVariants`. Text Area should share these color/status/shape rules (same Forms family) — reuse or mirror the keys (`shape`, `size`, `status`).
- `src/components/ui/field.tsx` — `Field`, `FieldHeader`, `FieldLabel`, `FieldLabelIcon`, `FieldHint`, `FieldDescription`, `FieldError`, `fieldVariants` (`FieldSize`). Use for label / helper / error / counter text around the textarea.
- `src/components/ui/input-group.tsx` — `inputGroupVariants`, `inputGroupAddonVariants` (addons: buttons, kbd, tags, avatar). Use if Figma text area has inner toolbar/footer slots (shadcn InputGroup supports `InputGroupTextarea`).
- `src/components/ui/label.tsx`, `kbd.tsx` (`kbdVariants`), `button.tsx` (`buttonVariants`, `ButtonIcon`), `badge.tsx` (tags), `avatar.tsx`, `separator.tsx`.
- Icons in `public/icons/`: `material-help.svg` (label help icon used by Field), `material-attachment.svg`, `material-mood.svg`, `material-mic-none.svg`, `material-close.svg`, `material-info2.svg`. Render via CSS mask (see `AlertIcon`).

## Preview pages to copy layout from

- `src/app/design-system/input/page.tsx` (closest sibling), also `checkbox/`, `radio/`, `switcher/`.

## Known gaps relevant

- Input colors are hex-matched to Light tokens (no variable names). Same caveat likely for Text Area.
