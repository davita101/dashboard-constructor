# Radio — graph context (graphify query)

No `radio` nodes exist in the graph yet. Closest existing pattern to mirror is Checkbox (Figma Radio sets are the Checkbox sets' siblings):

- `src/components/ui/checkbox.tsx` — `Checkbox()`, `CheckboxSize`, `CheckboxColor` (cva sizes/colors, Base UI primitive). Mirror its size/color/disabled/focus-ring variant keys and token choices for `RadioGroupItem`.
- `src/components/ui/checkbox-field.tsx` — `CheckboxField`, `checkboxFieldVariants`, `CheckboxFieldContent/Title/Description` (Text sets: horizontal/vertical orientation). Radio-Text should follow the same shape (`RadioField*`) or reuse generic slots.
- `src/components/ui/checkbox-card.tsx` — `CheckboxCard`, `CheckboxCardContent/Title/Description/Icon/Media/Links/Link`. Radio-Card should follow the same slot structure.
- `src/app/design-system/checkbox/page.tsx` — preview page pattern (`Section`, `states`, `statuses`, `orientations` arrays). Copy for `/design-system/radio`.
- `cn()` from `src/lib/utils.ts`.
- Input (`ui/input.tsx`, Field/Label) has a pending Radio slot (see CLAUDE.md Known gaps: Input).

shadcn base: `radio-group` (Base UI). Check CLAUDE.md Checkbox Known gaps for token mapping decisions to stay consistent.
