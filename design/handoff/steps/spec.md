# Steps

- Page id: 4313:48088 (`❖ Steps`), slug `steps`. Read via TalkToFigma (channel f4y3oxgs); REST dump not used (rate limit), colors are Figma hex, token names unresolved.
- Likely hex-to-token matches (Neutral Light, verify in `src/styles/color-mode.css`): #2563eb = primary-600, #e6e6e6 ~ base-100, #cccccc ~ base-200, #b3b3b3 ~ base-300, #333333 ~ base-800, Dark = base-900 with gradient. Green Done (#16a34a-like, from export) = success-600.

## Component sets (12)

### Atoms (single step)
1. **Step-Component-01** 4323:50899 (numbered circle + label), 20 variants: Type = Selected Primary | Selected Dark | Default | Done | Disabled; Size = Extra Large (circle 60, instance 137x60) | Large (48, 125x48) | Default (40, 113x40) | Small (32, 67x32; label only "Step", no description). Selected Primary/Dark exist for all 4 sizes; Default/Done/Disabled too (5 types x 4 sizes).
   - Parts: `Step` circle FRAME r32 (pill), contains number text "1" (Inter, color #f7faff on Selected; base on Default); Selected fill = linear gradient + gradient stroke (primary / dark); Default white fill + #e6e6e6 stroke; Done = green fill + check icon; Disabled = faded (low opacity, Figma value unreadable). `Content` FRAME 57x41: "Step" title (14/20 semibold, 28x20) over "Description" (12/16, 57x16), both #2563eb on Selected Primary, dark on Dark, grey on Default.
2. **Step-Component-02** 12199:562 (tab-style, line top/bottom), 9 variants: State = Selected Primary | Selected Dark | Not Selected; Type = Line Top | Line Bottom | No Line. 119x60: `Step` 12/16 (#3b82f6 selected) over `Heading Step` 14/20 (#2563eb). Selected has 2px line (#2563eb) top or bottom; Not Selected grey line.
3. **Step-Component-03** 12199:605 (horizontal icon + lines, vertical text), 12 variants: State = Active Primary | Active Dark | Done Primary | Done Dark | Not Active | Not Active Number; Lines = Left Line | Right Line | 2 Lines (Active has Left/Right only, Done has 2 Lines/Right Line, Not Active has 2 Lines/Left Line). 147x100: `Head` 147x40 = Line (54x2, #2563eb done/active, #ccc not) + Icon circle 40x40 (r20, 1px stroke, 8px dot inside for Active, check for Done, number for Number) + Line; `Content` 147x44: `Heading Step` 14/20 over `About Heading Step` 12/20 (#2563eb active, #b3b3b3 default).
4. **Step-Component-04** 12199:569 (vertical-list item), 8 variants: State = Active Primary | Done Primary | Not Active | Not Active Number | Active Dark | Done Dark | State6 | State5 (the last two are unnamed, probably Not Active / Not Active Number in Dark). 171x60: `Line` (2x20 connector above) + Icon circle 40x40 (r20) + `Step` text (Heading 14/20, About 12/20 #b3b3b3). First item has no line (171x40).
5. **Steps-Dot** 12200:23434, 4 variants: State = Default (#e6e6e6) | Select Primary (#2563eb) | Select Dark | Hover. 8x8, r100.

### Groups
6. **Step-Group-01** 4324:51079, 8: Size (Large 60 / Default 48 / Small 40 / Extra Small 32) x Type (Hug | Fill). Slot of 9 Step-Component-01 instances (first Selected, rest Default). Hug widths 1457/1349/1209/763; Fill 1502 wide.
7. **Step-Group-01-Vertical** 14263:130218, 4: Size Large/Default/Small/Extra Small; same 9 instances stacked (700/592/520/448 tall; step heights 60/48/40/32).
8. **Step-Group-02** 12199:761, 2: Type = Fill (1278x144) | Hug. Slot of 12 Step-Component-02 (119x60); first selected primary, others grey.
9. **Step-Group-03** 12203:592, 1 (variant prop typo `Tye=Default`): 882x100, slot of Step-Component-03 (147x100), first Active, rest Not Active.
10. **Step-Group-04** 12204:1083, 1: Type=Default 171x460, slot of 8 Step-Component-04 (first 171x40).
11. **Step-Group-05** 12196:995, 16: Type = Dot | Number; Selected = 1..8 Step. 432x40 (8 x 40px circles, connectors 16x1 #ccc, items 56 wide incl. line). Completed steps filled blue with check, current = ring (#2563eb stroke) with 8px dot, future = #ccc stroke circle (Number shows digit).
12. **Steps-Group-Dot** 12200:23487, 1: `Step 1 of 1` text (14/20, #333) + slot of 4 Steps-Dot (8px, gap 4 => 68 wide), 144x20.

## Mapping to code
No shadcn Steps exists: build `ui/steps.tsx` (cva + cn) with slots StepIndicator, StepContent, StepLine, StepsDot; Progress/Tabs not suitable. Check Tabs for Step-Component-02 style.

## States
Default, Selected (Primary/Dark), Done, Disabled, Active, Not Active, Hover (Dot only).

## Icons
Check mark (Done) and 8x8 inner dot (Active, a BOOLEAN_OPERATION/ELLIPSE vector). Not exported; reuse `public/icons/material-check.svg` or draw. No asset dump exists (`design/figma-dump/4313-48088` absent).

## Gaps
- No variable/token names (REST not used); all colors hex-matched guesses.
- Stroke weights, gradient stops (Selected fill), Disabled opacity, Done green hex, paddings and gaps (auto-layout unreadable; measured: Step-Group-01 item gap approx 20 from widths 1457 = 9 x 137 + 8 x 28, check) not read from node data.
- Layer visibility not reported (Description hidden on Extra Small?).
- Dark Step-Group variants do not exist; Dark only on atoms.
- Playground frame 12204:5324 shows usage: groups 02, 05 Dot (in 40px row), 05 Number, 01 hug at each size, 01 vertical.
