# Counter: Figma handoff

- Page: `9402:27553` ("❖ Forms: Counter"), slug `counter`, route `/design-system/counter`, queue #25
- Component sets on the page:
  - `Counter-Button` `9440:765`: compact stepper (40 variants, 1460x520)
  - `Counter-Input-Pilled` `15848:89546`: field stepper, pill box (30 variants, 1520x1152)
  - `Counter-Input-Rounded` `15893:566329`: field stepper, rounded box (30 variants, 1820x1152)
  - The page also has 3 `🎮 Playground` frames (`11364:33253`, `16137:484`, `16137:603`), a `Head-Design-System` instance and 3 `Base` rectangles. These are docs and backgrounds, not part of the component.
- Reference PNGs (scale 1, transparent background, so dark viewers show it black):
  - `design/handoff/counter/counter-button.png`. Columns: Pilled 60/48/40/32/24, then Rounded 60/48/40/32/24. Rows: Default, Hover Remove, Hover Add, Disabled.
  - `design/handoff/counter/counter-input-pilled.png` and `counter-input-rounded.png`. Columns: 60/48/40/32/24. Rows: Default, Filled, Active, Error, Succes, Disabled.
- Source: TalkToFigma (`get_nodes_info` plus PNG exports). `pnpm figma:fetch 9402-27553` failed with "FIGMA_TOKEN is not set", so there is no `design/figma-dump/9402-27553`. Token names are matched by hex to the Light tokens already used by `input.tsx`, `button.tsx` and the Input spec.

## Decision: numeric stepper (not a count badge)

Counter is a numeric stepper: `−` / value / `+`. Every variant is `material-remove` + Text "0" + `material-add`. It is not a count badge.

`counterSize` in `src/app/design-system/button/page.tsx:35` does NOT match this page. That map is the Button page's "Counter" slot (`ButtonCounter` = a `Badge` square pill after a button label, `button.tsx:155`). It belongs to Button and stays as it is. The Forms: Counter page needs a new `src/components/ui/counter.tsx`.

Build plan (shadcn primitives):

| Part | Figma | Maps to |
|---|---|---|
| `Counter` (root, `role="group"`, holds value/min/max/step, controlled + uncontrolled) | Counter-Button component frame | `@base-ui/react/number-field` (`NumberField.Root` / `Group` / `Decrement` / `Input` / `Increment`), already installed (`@base-ui/react ^1.9.0`, the same lib the repo's shadcn primitives use). It handles value/min/max/step, keyboard and disabled-at-limit, with `counterVariants` cva on the Group. |
| `CounterDecrement` / `CounterIncrement` | `material-remove` / `material-add` (Counter-Button); `Outline-Button` instances (Counter-Input) | `Button`. Counter-Button: `variant="bare"` + icon size + `text-base-700 hover:text-primary-600`. Counter-Input: `variant="outline"` `size="icon-*"` with the same `shape` as the box. |
| `CounterValue` | Text "0" | `NumberField.Input` in both. Counter-Button: borderless, auto width (`field-sizing-content`), styled as plain text. Counter-Input: InputGroup control, centered text. |
| Field wrapper (Counter-Input only) | Top (Label + help icon + "Add Text"), Bottom ("Add Text Bottom") | `Field`, `FieldHeader`, `FieldLabel`, `FieldLabelIcon`, `FieldHint`, `FieldDescription`/`FieldError` from `field.tsx`, the same as Input |
| Counter-Input box | `Input` frame + `Active` ring frame | `InputGroup` (same box, sizes and states as Input) with the buttons as start/end addons |

cva variants: `size: "60" | "48" | "40" | "32" | "24"` (Figma Extra Large / Large / Default / Small / Micro), `shape: "pill" | "rounded"` (Figma `Corner=Pilled|Rounded` on Counter-Button; set name on Counter-Input), plus `appearance: "button" | "input"` (or two exports `Counter` and `CounterField`; the builder decides). Counter-Input states reuse InputGroup's `status` (default/active/success) + `aria-invalid` + `disabled`.

## Variant axes

- Counter-Button: `Size` = Extra Large (60), Large (48), Default (40), Small (32), Micro (24); `State` = Default, Hover Remove, Hover Add, Disabled; `Corner` = Rounded, Pilled. 5x4x2 = 40.
- Counter-Input-Pilled / -Rounded: `Size` = same 5; `State` = Default, Filled, Active, Error, Succes (sic), Disabled. 5x6 = 30 each.
- Figma has no Focus state for Counter-Button and no "min/max reached" variant anywhere. Decisions:
  - Focus-visible on the −/+ buttons: Button's own 4px outline (`outline-base-alpha-20`).
  - At min, the `−` button gets `disabled`; at max, `+` does. Each uses the per-button disabled look below (icon `base-200`). The rest stays enabled.
  - Default `min = 0`, `max = Infinity`, `step = 1`. The value never goes below min.

## Counter-Button (compact stepper)

Tree: `Component` (horizontal, items centered) > `material-remove` (INSTANCE) > `Text` "0" > `material-add` (INSTANCE).
Box: fill `#ffffff` `--background-0`, 1px stroke `#e6e6e6` `--base-100` (inside), height = size.

| Size | H | Radius Rounded | Radius Pilled | Padding x Rounded / Pilled | Gap icon to value | Icon | Value text | W Rounded / Pilled (value "0") |
|---|---|---|---|---|---|---|---|---|
| 60 | 60 | 16 `rounded-r16` | 36 (full) | 16 / 20 | 12 | 24 | Inter 12/20 Bold | 113 / 121 |
| 48 | 48 | 12 `rounded-r12` | 32 (full) | 12 / 16 | 12 | 24 | 12/20 Bold | 105 / 113 |
| 40 | 40 | 8 `rounded-r8` | 32 (full) | 10 / 12 | 8 | 20 | 11/20 Bold | 84 / 88 |
| 32 | 32 | 8 `rounded-r8` | 32 (full) | 8 / 10 | 8 | 20 | 10/16 Bold | 79 / 83 |
| 24 | 24 | 6 `rounded-r6` | 32 (full) | 8 / 8 | 4 | 16 | 10/16 Bold | 63 / 63 |

Pilled radius can be `rounded-r32` (or `rounded-full`); Input pill uses `rounded-r32`. Letter-spacing 0 (`tracking-default`). The width hugs the content: the value grows with its digits.

Colors (Light):

| State | Box fill | Stroke | Value text | Icons | Shadow |
|---|---|---|---|---|---|
| Default | `#ffffff` background-0 | `#e6e6e6` base-100 | `#666666` base-600 | `#4d4d4d` base-700 | ~0 1px 2px `--shadow-base` (1px faint line under the box in the export) |
| Hover Remove | same | same | same | `−` `#2563eb` primary-600; `+` base-700 | bigger soft drop shadow: gray `#808080` ~10% alpha (= `--shadow-base`), about 12px down, ~32px blur, ~16px spread to the sides. Approx `shadow-[0_12px_32px_0_var(--shadow-base)]`. |
| Hover Add | same | same | same | `+` primary-600; `−` base-700 | same as Hover Remove |
| Disabled | `#fafafa` background-20 | `#e6e6e6` base-100 | node says `#666666`, export renders ~`#cecece`: use base-300 | export ~`#d6d6d6`: use base-200 (same as Button outline `data-disabled:text-base-200`) | none |

Hover is per button (the hovered icon turns primary-600) but the whole box gets the shadow. Implement it as `has-[button:hover:not(:disabled)]:shadow-[...]` on the root and `hover:text-primary-600` on each button. Assumption: Active (press) = hover look. Figma has none.

## Counter-Input (field stepper)

Tree (both sets):
```
Component (vertical; Figma width Pilled 240, Rounded 300; in code: w-full / fit to parent)
  Top: Label TEXT "Label" (Bold, #4d4d4d base-700) + material-help icon | right: TEXT "Add Text" (SemiBold, #999999 base-400)
  Input frame (H = size, fill, 1px stroke)         <- wrapped in "Active" frame (ring) for Active/Error/Succes
    Outline-Button (start) > Icon (material-remove)
    Text "0" (centered)
    Outline-Button (end)   > Icon (material-add)
  Bottom: TEXT "Add Text Bottom" (SemiBold, #999999 base-400)
```
The Top/Bottom rows and the vertical gaps (XL 16, L 12, D 8, S 8, Micro 4) are identical to Input: reuse `Field` exactly as `/design-system/input` does. Label text sizes: 12/20 (60, 48), 11/20 (40), 10/16 (32), 9/16 (24). Help icon 16 (60/48/40) or 12 (32/24). Label inset x: Pilled 32/24/20/16/12, Rounded 20/16/12/12/8. These match Input's `--input-px` per shape, so the Field label inset already lines up.

Box and buttons per size:

| Size | Box H | Box radius Rounded / Pilled | Button inset (all sides) | Button size | Button radius Rounded / Pilled | Icon | Button = existing `Button size` | Value text |
|---|---|---|---|---|---|---|---|---|
| 60 | 60 | 16 / 32 | 10 | 40 | 8 / full | 20 | `icon-40` (size-10, r8, icon 5) | 12/20 Bold |
| 48 | 48 | 12 / 32 | 8 | 32 | 8 / full | 16 | `icon-32` (size-8, r8, icon 4) | 12/20 Bold |
| 40 | 40 | 8 / 32 | 6 | 28 | 6 / full | 14 | `icon-28` (size-7, r6, icon 3.5) | 11/20 Bold |
| 32 | 32 | 8 / 32 | 4 | 24 | 6 / full | 12 | `icon-24` (size-6, r6, icon 3) | 10/16 Bold |
| 24 | 24 | 6 / 32 | 4 | 16 | 4 / full | 12 Rounded, 16 Pilled (Figma; see Gaps) | `icon-16` (size-4, r4, icon 3) | 10/16 Bold |

The buttons are the `outline` Button: fill gradient `#ffffff` to `#fafafa` (background-0 to background-20), stroke gradient `#ededed` to `#e6e6e6` (bound variables `VariableID:3876:14031` / `3876:14028`, matching `outline`'s `before:from-background-70 before:to-background-100`). Pilled uses `shape="pill"`, Rounded `shape="rounded"`. The button radii above equal the existing `icon-*` sizes, so no new Button sizes are needed. The value is centered between the buttons. The value font is **Bold 700**, while Input's text is SemiBold 600, so override with `font-bold`.

Colors per state (Input frame / ring / value). They match `inputVariants` / `inputGroupVariants`:

| State | Fill | Stroke (1px) | Ring (outer "Active" frame stroke, ~4px at 20%) | Value |
|---|---|---|---|---|
| Default | `#ffffff` background-0 | `#e6e6e6` base-100 | none | `#666666` base-600 (Input uses base-700 for placeholder: here the "0" is a real value, so use base-600) |
| Filled | `#ffffff` | `#d9d9d9` base-150 | none | `#010101` base-900 |
| Active (focus) | `#ffffff` | `#cccccc` base-200 | `#808080` = base-alpha-20 | `#010101` base-900 |
| Error | `#ffffff` | `#dc2626` danger-600 (Input uses danger-500 `#ef4444`, see Gaps) | `#ef4444` = danger-alpha-20 | `#dc2626` danger-600; bottom text danger-600 per Input |
| Succes | `#ffffff` | `#16a34a` success-600 | `#22c55e` = success-alpha-20 | `#16a34a` success-600 |
| Disabled | `#fafafa` background-20 | `#e6e6e6` base-100 | none | node `#666666`, export faded: use base-300 (like Input disabled). Buttons render faded too (outline `data-disabled`). |

Default vs Filled: Figma Default shows "0" in base-600 and Filled in base-900. Decision: Default = value equals the default/min with no user change (render `text-base-600`). Filled = after the user changes it (base-900). If that's too fiddly, always use base-900 for a value and base-600 only for the placeholder. The builder picks and notes it.

## States summary

- Counter-Button: Default, Hover per button (icon primary-600 + box shadow), Disabled (whole control). Focus-visible = Button outline ring (decided). Min/max reached = that button disabled (decided).
- Counter-Input: Default, Filled, Active (focus-within ring), Error (`aria-invalid` / `Field data-invalid`), Success (`status="success"`), Disabled. No hover state in Figma; the inner outline Buttons keep their own hover/active styles.
- Keyboard (decided, not in Figma): ArrowUp/ArrowDown on the value step by `step`, Home/End jump to min/max; typed input is clamped on blur.

## Icons / assets

- `material-add`: exists at `public/icons/material-add.svg`.
- `material-help` (label icon): exists at `public/icons/material-help.svg`.
- `material-remove` (the minus): **missing** from `public/icons/`. `checkbox-minus.svg` is the checkbox glyph, not this one. Get it from `pnpm figma:fetch 9402-27553` assets once FIGMA_TOKEN is set, or add the Material Symbols "remove" SVG (24px, `currentColor`) as `public/icons/material-remove.svg`. It is a plain horizontal bar matching `material-add`'s stroke weight.

## Gaps

- No REST dump (FIGMA_TOKEN not set): token names are matched by hex, not read; auto-layout padding, stroke weights and effects are not exposed. The paddings and gaps above were measured from absolute positions.
- Hover shadow (Counter-Button) is estimated from the PNG alpha (gray ~10%, ~12px y, ~32px blur). The exact effect is not readable, and no existing shadow token matches. Propose `--shadow-base` with an arbitrary `0 12px 32px` until the dump gives the real effect.
- Icon colors (base-700 / primary-600 / disabled ~base-200) and Disabled text (~base-300) were sampled from the export: the instance children (icon vectors) are empty via TalkToFigma.
- Counter-Input Error inner stroke is `#dc2626` (danger-600) in both sets, while `input.tsx` uses danger-500. Follow `input.tsx` for consistency (the ring dominates visually) unless the reviewer wants exact Figma.
- Micro (24) icon inside the 16px button: Pilled 16px icon, Rounded 12px. Treat as a Figma inconsistency and use `icon-16`'s 12px icon for both.
- Disabled opacity of Top/Bottom labels is not readable (the export shows the block faded); use Field `data-disabled` as Input does.
- Ring (Active frame) stroke weight is not exposed; Input renders it as a 4px inset ring at 20%. Reuse that.
- Playground frames were not inspected (docs only).
