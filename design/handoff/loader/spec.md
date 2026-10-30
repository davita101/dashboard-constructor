# Loader — handoff spec

- Figma page: `9402:26498` ("❖ Loader")
- Component set: `Loader` — `9489:2491`
- Playground: `🎮 Playground` frame `11717:573514` (one `Loader` instance, Size=Large; no extra overrides)
- Slug: `loader` → `/design-system/loader`
- Source: TalkToFigma (`set_focus`, `get_document_info`, `get_nodes_info`, PNG exports measured with PIL). Channel `m5tvpzo1`.
- REST dump: not available (`FIGMA_TOKEN` not set in this environment), so no token names / arcData from Figma; colors matched by hex to Light-mode tokens, arc geometry measured from 4x/8x pixel exports.

## Exports (in this folder)

- `loader-set.png` — whole component set, scale 1
- `loader-large@4x.png` — Size=Large component incl. container + its (very faint) shadow, scale 4
- `loader-xs-ring@8x.png` — Extra Small inner ring frame, scale 8 (clean, transparent bg)

## Variant properties

| Property | Values |
|---|---|
| Size | `Large (48)`, `Default (36)`, `Small (32)`, `Extra Small (20)` |

No state/color/type variants. Only one color (primary).

| Variant | Component id | Container (outer) | Ring frame | Ring width (measured) |
|---|---|---|---|---|
| Size=Large (48) | 9489:2487 | 56×56 | 48×48 (`9489:2459`) | ≈4.8px (inner r ≈19.2, outer r 24) |
| Size=Default (36) | 9489:2488 | 44×44 | 36×36 (`9489:2467`) | ≈3.6px (inner r ≈14.4, outer r 18) |
| Size=Small (32) | 9489:2489 | 40×40 | 32×32 (`9489:2475`) | ≈3.2px (inner r ≈12.8, outer r 16) |
| Size=Extra Small (20) | 9489:2490 | 28×28 | 20×20 (`9489:2483`) | ≈2.5px (inner r ≈7.5, outer r 10) |

Ring width = 10% of ring diameter (Figma ellipse innerRadius ≈ 0.8) for L/D/S; XS is ≈ 12.5% (innerRadius ≈ 0.75). Measured ±0.15px from antialiased exports.

## Parts

1. **Container** (the COMPONENT itself)
   - Size = ring + 4px padding on every side (56 / 44 / 40 / 28).
   - Fill `#ffffff` → `--background-0` (white).
   - cornerRadius 56 → fully round (`rounded-full`).
   - Effect: a very soft drop shadow below the container. The export bounds grow from 56×56 to 257×137 (shadow reaches ~81px left/right/down, 0 up), but max alpha is ~3/255, so it is nearly invisible. Decision: use the lightest existing shadow (`--shadow-base`, e.g. `0 40px 80px var(--shadow-base)`) or omit; it has no visible effect at normal zoom.
2. **Ring frame** (`Large (48)` etc.), centered in the container, no fill. Children stacked at full frame size:
   - **`Base`** ELLIPSE (bottom of visual stack) — full 360° ring, fill `#3b82f6` @ 15% opacity → `--primary-500` at 15% (`color-mix(in oklab, var(--primary-500) 15%, transparent)` or `bg-primary-500/15`). Renders as `#e2ecfe` on white.
   - **`Load`** ELLIPSE (top) — arc segment, fill `#2563eb` → `--primary-600`. Same inner/outer radius as Base.
   - Layer order in the node list is `Load` then `Base`; visually Load sits on top of Base (verified in exports).

### Load arc geometry (measured)

- Angles below are measured clockwise from 12 o'clock.
- Visible arc runs from ≈225° (7:30, lower-left) clockwise over the top to ≈45° (1:30, upper-right): **≈180° sweep**, identical in all 4 sizes.
- Ends are rounded: at mid-radius the arc reaches 225.5° / 44.5°, at the inner/outer edges only ≈228.5° / ≈41.5°. So it's a ≈173° segment with rounded (semicircle-ish) caps.
- In Figma arcData terms (0 = 3 o'clock, clockwise): startingAngle ≈ 3π/4 (135°), endingAngle ≈ 7π/4 (315°) — inferred, not read.
- Decision for the build: draw it as an SVG `<circle>` stroke (r = (outer+inner)/2, stroke-width = ring width), `stroke-linecap="round"`, dash length so the visible sweep incl. caps = 180°, rotated so it starts at 225°. Base = a full circle with the same stroke. This reuses the arc approach from `src/components/ui/progress-circle.tsx` (see `graph-context.md`).

## States / animation

- None in Figma (no hover/disabled). The static design only shows one frame.
- Decision: spin the `Load` arc (or the whole ring frame) continuously clockwise (`animate-spin`, ~1s linear); keep Base and container static. Add `role="status"` + `aria-label="Loading"` (sr-only text). Respect `prefers-reduced-motion` (slow down or stop).

## Typography

None (no text layers).

## Icon assets

None. Pure geometry; no SVG assets needed (don't use lucide `Loader2Icon`; the design is a two-tone ring, not the lucide glyph).

## Tokens

| Hex | Token (Light, default theme = blue) |
|---|---|
| `#2563eb` | `--primary-600` (= `--default-blue-600`) |
| `#3b82f6` @15% | `--primary-500` @15% (= `--default-blue-500`) |
| `#ffffff` | `--background-0` |
| `#d8b4fe` (set border, dashed) | Figma component-set frame decoration, not part of the component |

## Gaps

- No REST dump (`FIGMA_TOKEN` missing): arcData (start/end angle, innerRadius) and the container's effect values could not be read; they were measured from exports (±1° / ±0.15px).
- XS ring width (≈2.5px) doesn't follow the 10% rule of the other sizes. Build it as measured, not as 2px.
- Shadow parameters are unknown (alpha ≤ ~1%); treat as optional.
- No dark-mode or color variants in the file. Using primary tokens means it follows the theme automatically.
