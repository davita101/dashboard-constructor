# Input OTP — Figma handoff

- Page: `9402:26500` ("❖ Forms: Input OTP"), slug `input-otp`, route `/design-system/input-otp`, queue #24
- Component sets on the page:
  - `Input-OTP-Component` `9480:4753` — the single slot (Size × State, 18 variants)
  - `Input-OTP` `9483:1476` — the composite: Top label + 6 slots + Bottom text (Size, 3 variants)
  - `🎮 Playground` `11364:61078` — one `Input-OTP` XL instance on a #fafafa r40 card (nothing new)
- Source: TalkToFigma on channel `m5tvpzo1` (`set_focus` page → `get_document_info` currentPage = 9402:26500, `get_nodes_info` on both sets + playground, PNG exports).
- REST dump: not available (`FIGMA_TOKEN` not set), no `design/figma-dump/9402-26500`. Colors matched by hex to Light-mode tokens (same mapping `src/components/ui/input.tsx` already uses); spacing measured from absolute bounds; stroke weights measured from an 8x export.
- Target: shadcn `input-otp` registry item (package `input-otp`: `InputOTP` / `InputOTPGroup` / `InputOTPSlot` / `InputOTPSeparator`). Not installed yet (`input-otp` not in package.json).

## Exports (in this folder)

- `input-otp-component-set.png` — slot set, scale 1. Columns: Default, Filled, Active, Error, Succes, Disabled. Rows: XL60, L48, D40.
- `input-otp-set.png` — composite set, scale 1 (XL, L, D stacked).
- `slot-active-xl@8x.png` — `Size=Extra Large (60), State=Active`, scale 8 (480×544 = 60×68 → ring is 4px outside the 52×60 slot; slot border 1px).

## Variant axes

Slot set `Input-OTP-Component`:
- `Size`: Extra Large (60), Large (48), Default (40)   (no Small/Micro, unlike Input)
- `State`: Default, Filled, Active, Error, Succes (sic = success), Disabled

Composite set `Input-OTP`: `Size`: Extra Large (60), Large (48), Default (40). No State axis: state lives on each slot instance. Composite always shows slot 1 Filled ("1"), slot 2 Active (caret), slots 3–6 Default.

## Parts

```
Input-OTP (vertical stack, gap 12 all sizes)
  Top (h20, horizontal, gap 8)
    Label   TEXT "Label"  Inter Bold 700 12/20  #4d4d4d
    material-help INSTANCE 16×16 (y-centered, 8px right of label)
  Content  SLOT (horizontal, 6 × Input-OTP-Component, gap 8, no separator)
  Bottom (h20)
    Label   TEXT "Text Bottom"  Inter SemiBold 600 11/20  #808080
```
Label / bottom text x = 0 (flush left, no inset — differs from Input's Field, see Decisions).

Slot (`Input-OTP-Component`):
```
[Active | Error | Succes only] ring wrapper FRAME (same box + radius, no fill, stroke @20% opacity, 4px OUTSIDE)
  Content FRAME  fill, stroke 1px inside, radius
    Text TEXT  Inter SemiBold 600, center-aligned, one character
```

### Slot box by size

| Size | Slot W×H | Radius | Char size/lh | Caret glyph size/lh | Composite W (6 slots + 5×8) | Composite H |
|---|---|---|---|---|---|---|
| Extra Large (60) | 52×60 | 16 | 16/24 | 12/20 | 352 | 124 |
| Large (48) | 40×48 | 12 | 14/24 | 12/20 | 280 | 112 |
| Default (40) | 36×40 | 8 | 12/20 | 12/20 | 256 | 104 |

Composite H = 20 + 12 + slot + 12 + 20. Slot gap 8 at every size. Character is centered both ways (no padding; text box centered in slot).

### Colors per state (Light tokens)

| State | Fill | Stroke 1px inside | Ring (4px outside, 20%) | Text |
|---|---|---|---|---|
| Default (empty) | #ffffff `--background-0` | #e6e6e6 `--base-100` | none | empty (" "); #666666 `--base-600` if a placeholder is shown |
| Filled | #ffffff | #d9d9d9 `--base-150` (D40 composite instance shows #e6e6e6, see Gaps) | none | #010101 `--base-900` |
| Active (focus/caret) | #ffffff | #cccccc `--base-200` | #808080@20 `--base-alpha-20` | caret "\|" #010101 `--base-900` |
| Error | #ffffff | #dc2626 `--danger-600` | #ef4444@20 `--danger-alpha-20` | #dc2626 `--danger-600` |
| Succes | #ffffff | #16a34a `--success-600` | #22c55e@20 `--success-alpha-20` | #16a34a `--success-600` |
| Disabled | #fafafa `--background-20` | #e6e6e6 `--base-100` | none | #666666 `--base-600` (empty in Figma) |

Labels: Top label #4d4d4d `--base-700`, Bottom #808080 `--base-500`, help icon `bg-base-500` mask (same as `FieldLabelIcon`). Figma has no error/success color on the composite's Bottom text (no State axis on the composite); follow Input/Field (`FieldError` red, success green) — decision below.

`#d8b4fe` dashed border / r40 on the sets = Figma set decoration, not part of the component.

## Mapping onto shadcn input-otp

- `InputOTP` (OTPInput root, `containerClassName` = flex row) → Figma `Content` slot row. `maxLength={6}` is the Figma default (always 6 slots).
- `InputOTPGroup` → one group holding all 6 slots with `gap-2` (8px). Figma slots are separate boxes with full radius each, NOT the shadcn joined/collapsed-border style: remove shadcn's `-space-x-px`, `first:rounded-l / last:rounded-r`, `border-y border-r` and give every slot its own border + radius.
- `InputOTPSlot` → `Input-OTP-Component`. cva `size: "60" | "48" | "40"` (same keys as `Input`) for w/h/radius/text. States:
  - Default: no char, not active.
  - Filled: `char` present, not active.
  - Active: `isActive` from OTPInputContext → stroke base-200 + 4px base-alpha-20 ring; render the fake caret when `hasFakeCaret` (Figma shows a "|" glyph 12/20 #010101 — use the shadcn `animate-caret-blink` 1px bar, h ≈ 20/16/16px, `bg-base-900`; decision: real caret bar instead of a text glyph).
  - Error: root `aria-invalid` → read it via the group (`group-aria-invalid` or a `data-invalid` on the container) and apply danger tokens on every slot.
  - Success: a `status="success"` prop on `InputOTP` (mirrors `Input` `status`) → success tokens on every slot.
  - Disabled: root `disabled` → `has-disabled:` / `data-disabled` on the container: background-20 fill, base-100 stroke, base-600 text, `cursor-not-allowed`. No opacity change in Figma.
  - Priority (same as Input): Disabled > Error > Success > Active > Filled > Default.
- Ring rendering: Figma ring is 4px OUTSIDE the slot. Input.tsx draws its ring inside the box (inset shadow) because the input fills its width; for OTP slots use an outer ring (`ring-4 ring-(--otp-ring)` / `shadow-[0_0_0_4px_var(--otp-ring)]`) so the slot stays 52×60 and the gap stays 8 (ring overlaps into the gap; fine, it's 4 < 8). Decision: outside ring, matches Figma.
- Stroke 1px inside: `outline -outline-offset-1` or `border` with `box-border` (box size includes stroke).
- Slot props pattern: also expose a pinned `state` prop on `InputOTPSlot` (`"active" | "filled" | ...`) only if needed for the preview page; Input already uses `status="active"` for pinned previews — reuse that idea.
- `InputOTPSeparator`: not in Figma. Keep the shadcn export (uses `Separator`, project rule: dividers use Separator) but the preview should show the Figma layout (one group of 6, no separator) first; a 3+3 with separator demo is optional and flagged as non-Figma.
- Label/helper: wrap in existing `Field` + `FieldHeader` + `FieldLabel` + `FieldLabelIcon` + `FieldDescription` / `FieldError` (src/components/ui/field.tsx).

## Decisions (nobody to ask)

1. Slot count fixed at 6 in Figma → default `maxLength=6` in demos; component stays generic.
2. No separator in Figma → no separator in the default demo; `InputOTPSeparator` kept for API parity only.
3. Field typography differs from Input's Field: OTP label is 12/20 Bold at every size, bottom 11/20, gap 12 at every size, labels flush left (x = 0). Use `Field` with className overrides (`gap-3`, `[--field-px:0]`, label `text-12`, description `text-11`) or a `size`-independent OTP wrapper; do not change `fieldVariants`.
4. Error/success on the bottom text are not drawn in Figma; use `FieldError` (danger-600) / success-600 for consistency with Input.
5. Filled stroke = `--base-150` (#d9d9d9) per the slot set (source of truth), ignore the D40 composite's #e6e6e6 override.
6. Caret: animated 1px bar (shadcn) instead of the "|" text glyph.
7. Font: Inter in Figma → `font-default` (same as Input; see CLAUDE.md known gap on design fonts).

## Icons / assets

- `material-help` 16px → already at `public/icons/material-help.svg`, used via `FieldLabelIcon`. No new assets.

## Tokens used

| Hex | Token |
|---|---|
| #ffffff | `--background-0` |
| #fafafa | `--background-20` |
| #e6e6e6 | `--base-100` |
| #d9d9d9 | `--base-150` |
| #cccccc | `--base-200` |
| #808080 @20% | `--base-alpha-20` |
| #808080 | `--base-500` |
| #666666 | `--base-600` |
| #4d4d4d | `--base-700` |
| #010101 | `--base-900` |
| #dc2626 | `--danger-600` |
| #ef4444 @20% | `--danger-alpha-20` |
| #16a34a | `--success-600` |
| #22c55e @20% | `--success-alpha-20` |

Radius `rounded-r16/r12/r8`. Type `text-16/14/12/11`, `leading-24/20`, `font-semibold` / `font-bold`. Sizes: `w-13 h-15`, `w-10 h-12`, `w-9 h-10`, `gap-2`, `gap-3`. No missing tokens.

## Gaps

- No REST dump (`FIGMA_TOKEN` not set): Figma variable names, auto-layout padding/gap, layer visibility and stroke alignment not read. Gaps measured from bounds; ring = 4px outside @20% and slot stroke = 1px measured from the 8x export.
- Composite D40 slot 1 ("Input 1", Filled) has stroke #e6e6e6 while the slot set's D40 Filled is #d9d9d9 (instance override or Figma inconsistency). Decision 5.
- Default-state text color #666666 is on an empty " " layer — no placeholder glyph is shown anywhere in Figma; placeholder support is optional.
- No hover state in Figma. No Small/Micro sizes.
- Disabled shows empty slots only; disabled-with-value text color assumed `--base-600` (from the layer color).
- `Succes` is a typo in the Figma state name; code uses `success`.
