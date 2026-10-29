# Switcher — graph context

Query: "Switcher: which ui primitives, cva variants, icons and design-system pages already exist that this should reuse" (graphify BFS, budget 1500)

## No `switch` primitive yet
`src/components/ui/switch.tsx` does not exist → add shadcn `switch` (Base UI) and extend with `cva`.

## Closest siblings to mirror (same pattern, same tokens)
- `src/components/ui/checkbox.tsx` — cva sizes/colors on shadcn checkbox (checked primary-600 / base-900, disabled base-30 + base-60, stroke base-100).
- `src/components/ui/checkbox-field.tsx` — `checkboxFieldVariants`, `CheckboxField`, `CheckboxFieldContent`, `CheckboxFieldTitle`, `CheckboxFieldDescription` (Text layout: gap 12, 14/20 medium).
- `src/components/ui/checkbox-card.tsx` — card variant (p-2/p-3/p-4, Active stroke base-alpha-50, disabled background-20).
- `src/components/ui/radio-group.tsx` — `radioGroupItemVariants`, `RadioColor`, `RadioSize`, `RadioGroupIndicator`.
- `src/components/ui/radio-field.tsx` — `radioFieldVariants`, `RadioField*` slots.
- `src/components/ui/radio-card.tsx` — `RadioCard` + `RadioCardMedia`.
- `src/components/ui/label.tsx`, `field.tsx`, `separator.tsx` — reuse for labels/dividers.
- `src/components/ui/input-group.tsx` — Input has a pending "Switcher" slot (Known gaps: Input).
- `cn()` from `@/lib/utils`.

## Design-system pages to copy structure from
- `src/app/design-system/checkbox/page.tsx`
- `src/app/design-system/radio/page.tsx`

## Icons available (`public/icons/`)
material-check.svg, checkbox-minus.svg, material-close.svg, etc. Use CSS mask pattern (see AlertIcon) if the Switcher knob has an icon.
