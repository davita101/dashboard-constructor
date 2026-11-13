# Task
9c-1: shared token-colored mask `Icon` component; replace ad-hoc inline mask spans in 5 files.

## TODO item
  - [ ] 9c Icon dark mode: shared token-colored mask Icon component replacing hardcoded #808080 `<img>` icons

## Goal
Finding: no `<img src=/icons/...>` remains. Icons already render as CSS masks (`bg-current mask-...`) in many places, so dark mode works. What is left: ~20 copies of the same mask recipe (inline `<span className="size-4 bg-base-500 mask-[url(...)] ...">`, `maskIcon` const in chart-metric). Add one shared `Icon` in `src/components/ui/icon.tsx` and use it in the inline-span sites below. Existing `ButtonIcon`, `InputGroupIcon`, `EmptyIcon` etc. stay as they are (they are slots). Pixel output must not change.

## Files
- new `src/components/ui/icon.tsx`
- `src/components/ui/chart-metric.tsx` (const `maskIcon`, spans at ~84, 387, 409, 511, 514, 567, 589, 592)
- `src/components/ui/chart-parts.tsx` (~267, ~311-315)
- `src/components/ui/breadcrumb.tsx` (~152, ~198)
- `src/components/ui/native-select.tsx` (~33)
- `src/components/ui/field.tsx` (~90)
- `design/known-gaps.md` (lines 5-7)

## Steps
1. `icon.tsx`: `Icon({ src, size, className, style, ...props }: React.ComponentProps<"span"> & { src: string; size?: ... })`. Renders `<span data-slot="icon" aria-hidden className={cn("shrink-0 bg-current mask-contain mask-center mask-no-repeat", iconVariants({size}), className)} style={{ maskImage: `url(${src})`, WebkitMaskImage: `url(${src})`, ...style }} />`. `cva` sizes: 4 → `size-4`, 5 → `size-5`, 6 → `size-6`; no default size (callers may pass className with a size or var). Color = `bg-current`, caller sets `text-*` (or `bg-<token>` via className; `cn` merges).
2. Replace the inline mask spans in the 5 component files with `<Icon src=... />`, keeping the exact same size and color classes (translate `bg-X` to className `bg-X`, it overrides bg-current). Dynamic classes using arbitrary-value masks (chart-parts ternaries) become `src` ternaries. Remove `maskIcon` const in chart-metric if unused.
3. Do not touch `checkbox.tsx`, `alert.tsx` (they use CSS-var colors in pseudo/variant contexts; fine as is).
4. `design/known-gaps.md`: delete lines "shadcn vars not mapped…", "Fonts not loaded…", "Figma icon SVGs have a hardcoded fill…" (fixed by 9b-1, 9b-2 and the mask approach). Add at end: `- Icon: all glyphs render as CSS masks (token color, dark-mode safe); some components still have their own mask slot (ButtonIcon, InputGroupIcon, …) instead of the shared Icon.`
5. `pnpm exec tsc --noEmit && pnpm lint && pnpm build`.

## Acceptance
- `pnpm exec tsc --noEmit` clean; `pnpm lint` 0 errors (known command.tsx warning ok); `pnpm build` ok.
- `grep -rn "mask-\[url" src/components/ui/{chart-metric,chart-parts,breadcrumb,native-select,field}.tsx` → no matches (all through `Icon`).
- `grep -rnE "#[0-9a-fA-F]{3,8}\b|space-[xy]-|dark:" src/components/ui/icon.tsx` → no matches.
- `grep -rn "<img" src --include=*.tsx` only task.tsx cover + notification image (photos).
- Visual: code-read only is acceptable; sizes/colors per call site unchanged.

## Decisions
- Scope kept to 5 consumers (+ new file) to stay in one session; other sites (navbar, card, alert, checkbox, link, table-cell…) left, noted in known-gaps. Reason: they are already correct (masked, tokened); this is dedupe not a bug fix.
- No SVG creation or edits (project rule).

## Don't
- Don't edit `public/icons/*`. Don't change visuals, props of existing exported components, or the slot components (`ButtonIcon` etc.). No design-system pages.
