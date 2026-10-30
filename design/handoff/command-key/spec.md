# Command Key — handoff spec

- Figma page: `9402:26499` ("❖ Command Key")
- Component sets:
  - `Command-Key` — `9478:1528` (360 variants, the single key cap)
  - `Command-Keys-Group` — `9499:1023` (24 variants, key + "+" + key … combo)
- Playground: `🎮 Playground` frame `11364:32244` (four `Command-Keys-Group` instances, Rounded/Default, sizes L/D/S/XS, 3 keys each: ⌘ + ⌥ + ⇧)
- Other page children (not components): `Base` rectangle `16235:214924` (page background), `Head-Design-System` instance `13785:121697` (page header).
- Slug: `command-key` → `/design-system/command-key`
- Source: TalkToFigma (`set_focus`, `get_document_info`, `get_nodes_info` on both sets + playground, PNG exports). Channel `m5tvpzo1`.
- REST dump: not available (`FIGMA_TOKEN` is not set in this environment), so no Figma token names, no auto-layout padding/gap values, no layer visibility, no stroke weight. Colors were matched by hex to Light-mode tokens; spacing measured from absolute bounds.

## Exports (in this folder)

- `command-key-set.png` — whole `Command-Key` set, scale 1 (rows: Default ×4 sizes, Black ×4, White ×4; White keys are invisible on the white canvas, they are made for dark backgrounds)
- `command-keys-group-set.png` — whole `Command-Keys-Group` set, scale 1
- `command-key-ctrl-large@8x.png` — `Type=Default, Corner=Pilled, Size=Large (32), Content=Ctrl`, scale 8 (used to measure stroke / gradient / shadow)
- `playground.png` — playground frame, scale 1

## Existing code to extend (do not create a parallel primitive)

`src/components/ui/kbd.tsx` (Kbd / KbdGroup, cva `size: "32" | "24" | "20" | "16"`, default `"20"`). Consumers: `src/components/ui/input-group.tsx` (`InputGroupKbd`) and `src/app/design-system/input/page.tsx` (`<KbdGroup><InputGroupKbd size=…>⌘</InputGroupKbd>…`). Keep the size keys and the default so those keep working.

## 1. `Command-Key` (9478:1528)

### Variant properties

| Figma property | Values | → Kbd cva |
|---|---|---|
| Type | `Default`, `Black`, `White` | `variant: "default" \| "black" \| "white"` (default `"default"`) |
| Corner | `Rounded`, `Pilled` | `shape: "rounded" \| "pill"` (default `"rounded"`) |
| Size | `Large (32)`, `Default (24)`, `Small (20)`, `Extra Small (16)` | `size: "32" \| "24" \| "20" \| "16"` (existing keys; default stays `"20"`) |
| Content | `Ctrl`, `Command ⌘`, `Shift ⇧`, `Alt ⌥`, `Ctrl ⌃`, `Win`, `Alt`, `Shift`, `Enter ↵`, `Arrow Left ←`, `Arrow Up ↑`, `Arrow Right →`, `Arrow Down ↓`, `Esc`, `Custom` (sample "S") | **not a cva variant**: it is just `children`. Decision: ship a small helper map (e.g. `kbdKeys = { cmd: "⌘", shift: "⇧", alt: "⌥", ctrl: "⌃", enter: "↵", left: "←", up: "↑", right: "→", down: "↓" }`) or let callers pass the glyph; plus a `glyph` boolean only needed for the Pilled square sizing (see below). |

All 3 × 2 × 4 × 15 = 360 combinations exist (verified count = 360).

### Glyphs: text, not icons

Every key (incl. ⌘ ⇧ ⌥ ⌃ ↵ ← ↑ → ↓) is a single **TEXT** layer in Inter Bold. No vector/icon instances anywhere in either set. Decision: render the Unicode characters as text (`⌘ U+2318`, `⇧ U+21E7`, `⌥ U+2325`, `⌃ U+2303`, `↵ U+21B5`, `← U+2190`, `↑ U+2191`, `→ U+2192`, `↓ U+2193`). Do **not** use lucide icons for them (the PM's lucide suggestion in graph-context.md does not match the design). No icon assets needed. Note: the site font must have these glyphs (Inter does); if Geist is still the loaded font (known gap) check ⌥ / ⌃ render, otherwise fall back to system font for those.

Text labels used: `Ctrl`, `Win`, `Alt`, `Shift`, `Esc`, custom single letter (`S`).

### Layout (container = the COMPONENT)

- Horizontal, content centered, height fixed by size. Text is centered (`textAlignHorizontal: CENTER`).
- Rounded: fixed horizontal padding per size, width hugs the text.
- Pilled: text labels get larger horizontal padding; single-glyph keys (⌘ ⇧ ⌥ ⌃ ↵ arrows, Custom "S") are **square** (width = height) with the glyph centered. Pilled Large/Default wrap the text in an extra `Center` FRAME (same size as the text; no visual effect — ignore).

| Size | Height | Font size / line-height | Rounded radius | Rounded padding-x | Pilled radius | Pilled padding-x (text keys) | Pilled glyph keys | Text box offset y |
|---|---|---|---|---|---|---|---|---|
| Large (32) | 32 | 12 / 20 | 8 → `rounded-r8` | 8 → `px-2` | 16 (= full) | 12 → `px-3` | 32×32 | 6 |
| Default (24) | 24 | 11 / 20 | 6 → `rounded-r6` | 6 → `px-1.5` | 12 (= full) | 8 → `px-2` | 24×24 | 2 |
| Small (20) | 20 | 9 / 16 | 6 → `rounded-r6` | 6 → `px-1.5` | 12 (> half → full) | 8 → `px-2` | 20×20 | 2 |
| Extra Small (16) | 16 | 9 / 16 | 4 → `rounded-r4` | 4 → `px-1` | 12 (> half → full) | 6 → `px-1.5` | 16×16 | 0 |

Measured widths (Rounded): L ⌘ 28, Ctrl 38, Shift 44, Win 40, Esc 38; D ⌘ 23, Ctrl 33; S ⌘ 21, Ctrl 29; XS ⌘ 17, Ctrl 25, S 14. Pilled: L Ctrl 46, Shift 52, Win 48, Alt 41, Esc 46; D Ctrl 35, Shift 42; S Ctrl 33; XS Ctrl 29.

Decision for cva:
- Pilled → `rounded-full`; Pilled glyph keys → `aspect-square px-0` (or `min-w-[h] px-0`), i.e. `size-8 / size-6 / size-5 / size-4`. Use a compound variant `shape: "pill", glyph: true`. Simpler alternative the builder may pick: Pilled always `min-w-<h>` with the padding above and `justify-center`; single-character children then come out within ±2px of the square (L "⌘" 12px text + 2×12 = 36 vs 32). Prefer the explicit `glyph` flag for fidelity.
- Rounded keeps `min-w-<h>`? **No**: Figma Rounded glyph keys are narrower than tall (L ⌘ 28×32, XS "S" 14×16). Rounded = padding only, no min-width.

### Colors per Type

| Type | Fill | Stroke | Text |
|---|---|---|---|
| Default | linear gradient top→bottom `#ffffff` → `#fafafa` → `--background-0` → `--background-20` (`bg-linear-to-b from-background-0 to-background-20`) | `#e6e6e6` 1px inside → `--base-100` (`outline -outline-offset-1 outline-base-100`, as the current Kbd does; or `border border-base-100`) | `#333333` → `--base-800` |
| Black | `#000000` @ 90% → `--black-alpha-90` | none | `#ffffff` → `--white` (`--base-0` / `--background-0` in Light) |
| White | `#ffffff` @ 90% → `--white-alpha-90` | none | `#000000` → `--black` |

Gray hex → token resolution: computed from `--default-neutral-gray-*` oklch in `src/styles/primitives.css` (gray-800 = #333333, gray-100 = #e6e6e6, gray-20 = #fafafa, gray-0 = #ffffff, gray-1000 = #010101) and mapped through `src/styles/color-mode.css` Light (`--base-N` / `--background-N` = `--default-gray-N`).

Decision on Black/White: they are fixed "on dark / on light media" styles, not theme-aware. Use the `--black-alpha-90` / `--white-alpha-90` / `--white` / `--black` tokens (they do not flip in dark mode), not `--base-*`. Default type uses `--base-*` / `--background-*` so it follows dark mode.

### Typography

Inter Bold (700), letter-spacing 0, centered, all sizes (`font-default font-bold`). Sizes: L `text-12 leading-20`, D `text-11 leading-20`, S `text-9 leading-16`, XS `text-9 leading-16`.

Exceptions in Figma (treat as inconsistencies, ignore): Pilled Default(24) `Ctrl` uses 10/16 (all other D keys 11/20); Pilled Default(24) Default-type arrows use 12/20.

### Effects

None: export of the Large Ctrl key at 8x is exactly 368×256 (= node bounds), so no drop shadow; the only depth is the white→#fafafa gradient + 1px #e6e6e6 inside stroke (measured 8px at 8x = 1px).

### States

None in Figma (no hover/focus/disabled/active/pressed). Kbd stays `pointer-events-none select-none` as today.

### Diff vs current `kbd.tsx` (what the builder must change)

| | Current | Figma |
|---|---|---|
| Fill | `bg-background-50` flat | gradient `background-0 → background-20` |
| Text color | `text-base-600` | `text-base-800` |
| Weight | `font-semibold` (600) | `font-bold` (700) |
| Size 32 | `text-11 leading-20 px-2 rounded-r8 min-w-8` | `text-12 leading-20 px-2 rounded-r8`, no min-w |
| Size 24 | `text-10 leading-16 px-1.5 rounded-r6 min-w-6` | `text-11 leading-20 px-1.5 rounded-r6`, no min-w |
| Size 20 | `text-10 leading-16 px-1 rounded-r6 min-w-5` | `text-9 leading-16 px-1.5 rounded-r6`, no min-w |
| Size 16 | `text-9 leading-16 px-1 rounded-r4 min-w-4` | `text-9 leading-16 px-1 rounded-r4`, no min-w |
| Variants | size only | + `variant` (default/black/white), `shape` (rounded/pill), `glyph` |

The current values came from the Input page's "Command Keys" slot (see input spec). The Command Key page is the source of truth for the primitive; the Input slot uses instances of this same component, so aligning to this spec is correct and not an API break (props unchanged, only visuals). `size` default stays `"20"`.

## 2. `Command-Keys-Group` (9499:1023)

### Variant properties

| Figma property | Values | → KbdGroup |
|---|---|---|
| Size | `Large (32)`, `Default (24)`, `Small (20)`, `Extra Small (16)` | `size` (same keys as Kbd; drives gap + "+" typography; pass down to children via context or let callers set it on each Kbd) |
| Style | `Default`, `Black`, `White` | `variant` (same as Kbd) |
| Corner | `Rounded`, `Pilled` | `shape` (same as Kbd) |

24 variants = 4 × 3 × 2.

### Structure

```
COMPONENT (hug)
  FRAME Content (horizontal)
    INSTANCE Command-Key          (key 1, e.g. ⌘)
    FRAME Key 2: TEXT "+" , INSTANCE Command-Key (⌥)
    FRAME Key 3: TEXT "+" , INSTANCE Command-Key (⇧)
    FRAME Key 4..6: TEXT "+" , INSTANCE Command-Key (no visible text sample)
```

- Keys 3–6 are optional slots, hidden by default (component width only covers key 1 + Key 2: e.g. L Rounded 74 = 28 + 4 + 9 + 4 + 29; Key 3–6 frames overlap at the same x, i.e. hidden). The playground turns Key 3 on (3 keys, 121 px wide at L). Max 6 keys.
- Decision: `KbdGroup` takes any number of `Kbd` children and inserts a `+` separator between them (e.g. a `KbdSeparator` / automatic via `[&>*+*]:before:content-['+']` or explicit `<KbdGroup keys={["⌘","⌥","⇧"]}>`). Keep plain `<KbdGroup><Kbd/><Kbd/></KbdGroup>` working without separators? The Input page uses `KbdGroup` with ⌘ K and Figma's Input slot shows no "+"; decision: separator is opt-in via a `separator` prop or `KbdSeparator` child, default none, so Input stays unchanged.

### Spacing / separator

| Size | Gap (key ↔ "+" ↔ key) | "+" text |
|---|---|---|
| Large (32) | 4 → `gap-1` | Inter Bold 12/20, 9 px wide |
| Default (24) | 4 → `gap-1` | Inter Bold 12/20 |
| Small (20) | 4 → `gap-1` | Inter Bold 12/20 |
| Extra Small (16) | 2 → `gap-0.5` | Inter Bold 9/16, 7 px wide |

"+" color: Default style `#010101` → `--base-900`; Black style `#ffffff` → `--white`; White style `#000000` → `--black`. Vertically centered with the keys.

Key fills inside the group follow the key's Type, except: White style group instances in Rounded (all sizes) and Pilled L/D are `#ffffff` 100% (not 90%). Decision: ignore, use `--white-alpha-90` everywhere.

## Preview page suggestion (`/design-system/command-key`)

Follow `src/app/design-system/button/page.tsx`: matrix of Type × Corner × Size with all 15 contents; Black/White rows on a dark surface (e.g. `bg-base-900` panel) since they are meant for dark backgrounds; a Group section with ⌘ + ⌥ + ⇧ for each size/style/corner (Black/White on dark surface too).

## Tokens used

| Hex | Token |
|---|---|
| `#ffffff` | `--background-0` (gradient top), `--white` (Black text / White fill base) |
| `#fafafa` | `--background-20` (gradient bottom) |
| `#e6e6e6` | `--base-100` (Default stroke) |
| `#333333` | `--base-800` (Default text) |
| `#010101` | `--base-900` (Default "+" separator) |
| `#000000` @90% | `--black-alpha-90` |
| `#ffffff` @90% | `--white-alpha-90` |
| `#000000` | `--black` |
| `#d8b4fe` | Figma component-set frame decoration (dashed border), not part of the component |

Radius: `rounded-r4/r6/r8`, `rounded-full`. Type: `text-9/11/12`, `leading-16/20`, `font-default`. No missing tokens.

## Gaps

- No REST dump (`FIGMA_TOKEN` not set): Figma variable/token names, auto-layout padding/gap, layer visibility (which group Key slots are hidden), and stroke weight/alignment could not be read. Padding/gap were measured from absolute bounds; stroke = 1px inside measured from an 8x export.
- Black/White types have no stroke; whether they are meant to switch in dark mode is not specified. Decision recorded above: fixed, not theme-aware.
- Black-style group "+" is white, so it is only visible on dark backgrounds (same as White-style keys). Assumed intentional.
- Figma inconsistencies (ignored, see above): Pilled D `Ctrl` 10/16 font; Pilled D Default-type arrows 12/20; White Pilled XS `Alt ⌥` is 22 wide instead of 16 square; White group instances at 100% opacity.
- No hover/focus/disabled states in the design.
- Geist vs Inter: glyph coverage for ⌥ / ⌃ / ↵ must be checked in the browser if the design fonts are still not loaded (known repo gap).
