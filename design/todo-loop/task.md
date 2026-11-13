# Task
9f-3: Field → InputGroup/Input → slots inherit size/shape from context (no more repeating them).

## TODO item
    - [ ] 9f-3 Size/shape context for Field / InputGroup / ButtonGroup / InputGroupSwatch

## Goal
`<Field size="48" shape="pill"><InputGroup>…<InputGroupButton/><InputGroupSwatch/></InputGroup></Field>` gets size/shape everywhere with no repeated props. Explicit props still win. Existing usages render identically (no visual change).

## Files
- `src/components/ui/field.tsx` (add `FieldContext` {size, shape}; Field provides; export `useFieldContext()` returning null outside a Field)
- `src/components/ui/input-group.tsx` (InputGroup: size = prop ?? join ?? field ?? "40", same for shape; provide an `InputGroupContext` {size, shape}; InputGroupButton/Tag/Avatar/Swatch default size/shape from it)
- `src/components/ui/input.tsx` (if it has size/shape props: default from field context)
- consumers to sanity-check: `src/components/auth/auth-field.tsx`, `src/components/projects/FormField.tsx`, `src/components/ui/input-otp.tsx`, `src/components/ui/navbar.tsx`
- `design/known-gaps.md` (drop "Field/InputGroup size/shape must match (no context)" and "InputGroupSwatch shape must match" fragments from the Input / Color Input lines; Button Group note stays: no ButtonGroup component exists in `src/components/ui`)

## Steps
1. Read the three ui files and the consumers.
2. Field: context provider (client-safe, no "use client" needed unless hooks require it — `React.createContext`/`useContext` in a file without "use client" breaks Server Components; if so add `"use client"` only if field.tsx has no server-only use, else put context in a small `field-context.ts` marked "use client"-free via a client file `field-context.tsx`).
3. InputGroup + slots read contexts. Slot size mapping: per-input-size Button/Tag/Avatar sizes are currently defaults ("24"); keep the defaults as they are (sizes of slots are guesses, not tied to input size) — only `shape` is inherited for Button/Tag/Avatar/Swatch; Swatch size remains its own prop.
4. Do not touch ButtonGroup (does not exist).
5. Update known-gaps.md.
6. Smoke: add `scripts/field-context-smoke.mts` that renders (react-dom/server `renderToStaticMarkup`) Field size=48 shape=pill > InputGroup and asserts `data-size="48"` on the group and a pill class present; and explicit prop override; prints PASS lines. Run with `pnpm exec tsx scripts/field-context-smoke.mts` (add `--conditions=react-server` only if needed).

## Acceptance
- `pnpm exec tsc --noEmit` clean; `pnpm lint` 0 errors; `pnpm build` ok.
- `pnpm exec tsx scripts/field-context-smoke.mts` prints only PASS lines, exit 0.
- grep new/changed files: no hex colors, `space-[xy]-`, `dark:`.
- Existing usages (auth-field, FormField, otp, navbar) still compile and pass the same props.

## Decisions
- Precedence: explicit prop > InputGroupJoin > Field > default (40 / rounded).
- Only shape (not size) flows to slot Button/Tag/Avatar/Swatch: Figma slot sizes per input size are unreadable, current defaults kept.
- ButtonGroup skipped: component not in repo.

## Don't
- No new UI, no visual change, no new Figma reads.
- Don't rewrite variant tables; don't edit consumers unless types break.
