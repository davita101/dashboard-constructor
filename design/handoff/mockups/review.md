# review attempt 1 — REJECTED

Spacing scale = Tailwind default 4px (`p-4`=16px). Code uses Figma px as class number → wrong sizes. Shot: Browser renders ~480x135 not 800x56.

1. Browser `browserVariants`: `h-56 w-200 px-24 py-14` → need 56x800 px. Use `h-14 w-200 px-6 py-3.5` (or `h-[56px] w-[800px] px-6 py-[14px]`). Verify rendered 800x56 in `pnpm -s shot mockups`.
2. `BrowserControls`: `h-20 w-[128px] gap-24` → `h-5 w-32 gap-6`. Figma 128x20 gap 24.
3. `BrowserAddress`: `h-28 w-80 px-2 py-1` → Figma 320x28 pad 4 8: `h-7 w-80 px-2 py-1`. `w-80`=320 ok, `h-28`=112 wrong. Inner span `px-[84px]` ok but check fits.
4. `BrowserActions`: `h-20` → `h-5`.
5. `BrowserIcon` etc: `size-5`=20 ok. `size-3`=12 ok. Check `gap-3`=12 ok.
6. Browser text "www.spline.one" renders serif: add Inter via token font class (`font-sans`/project default) on Browser root. Figma Inter 500 12/20 base-900.
7. Mockup bezel: Figma iPhone bezel thin (~6px), phone island visible. Shot shows island missing (black on black bg-base-900? island on top of screen but `MockupScreen` bg covers? island is after children, ok) — verify island visible; give island `z-10`. Screen shows white box with thick black frame ~ ok but p-2.5 = 10px; Figma outer 453 vs inner 393 = 30px per side... reconcile: padding stays but check iPad p-3.5=14px vs Figma (1275-1133)/2=71 art margin (shadow area, ignore). Keep thin bezel; pick ~6px (`p-1.5`) to match image.
8. Other `rounded-r56`, `rounded-r24`: confirm tokens exist in tailwind-theme.css (`rounded-r40` r40 from Figma ok).
9. Audit all `h-N`/`w-N`/`gap-N`/`px-N` plain numbers: must be Tailwind scale (N*4px) or `[Npx]`.
