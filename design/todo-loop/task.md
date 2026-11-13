# Task
9e-3b: compact logo upload, current-logo preview and "Remove logo" in ProjectFormDialog.

## TODO item
      - [ ] 9e-3b `FileUpload` compact size (cva), current-logo preview + "Remove logo" checkbox/button in `LogoField`, pass `values.logo` / `values.clientLogo` from ProjectPageView

## Goal
The two logo drop areas (200px each) no longer make the dialog scroll. Edit form shows the current logo and can remove it (backend flags `removeLogo` / `removeClientLogo` already exist, 9e-3a). No new Figma frame: reuse existing parts (FileUpload, Avatar, Checkbox/Button).

## Files
- `src/components/ui/file-upload.tsx` (add `size` cva variant: `default` h-50 gap-6 as Figma, `compact` ~h-24 horizontal-ish, gap-2, smaller badge 32)
- `src/components/projects/ProjectFormDialog.tsx` (`LogoField`, `ProjectFormValues` += `logo`, `clientLogo` strings)
- `src/components/projects/ProjectPageView.tsx` (pass `project.logo`, `company.logo`)
- `messages/en.json` (`forms.project`: `removeLogo`, `currentLogo`)
- read: `src/components/ui/avatar.tsx`, `src/components/ui/checkbox.tsx`, `src/lib/projects/schemas.ts` (flag parsing: "on"/"true"/"1"), `scripts/logo-remove-smoke.mts`
- known-gaps line 101 (ProjectFormDialog logos) to update/remove

## Steps
1. Invoke shadcn skill first (CLAUDE.md). Add `size` variant to `fileUploadVariants` (cva), default unchanged so the Figma preview/other uses look identical. Compact: `h-auto py-4`, gap-2, badge size 32 via prop in `FileUpload`.
2. `LogoField` gets `current?: string`. If current and not marked removed: show a row with the logo (Avatar `frame` variant or next/image per existing sidebar pattern) + checkbox "Remove logo" named `removeLogo` / `removeClientLogo` (value "on"). Picking a new file unchecks/hides remove (upload wins anyway). Use compact FileUpload.
3. Create form (no `values`): no preview, no remove control.
4. Client logo: remove control only when company has a logo.
5. Add i18n keys in en.json (other locales have no these keys? check; follow whatever exists for `logoHint`).
6. Update/remove the known-gaps line.

## Acceptance
- `pnpm exec tsc --noEmit` clean; `pnpm lint` 0 errors; `pnpm build` ok.
- `pnpm exec tsx scripts/logo-remove-smoke.mts` (with `--conditions=react-server` as that script needs) still prints all PASS.
- grep new/changed files: no hex colors, no `space-[xy]-`, no `dark:`, no `w-N h-N` (use `size-N`).
- FileUpload without `size` prop renders same classes as before.
- Code read: checkbox `name` matches schema fields `removeLogo` / `removeClientLogo`; form data posted by ActionDialog includes it.

## Decisions
- Remove control = Checkbox + label (submitted with the form, applied on Save) rather than an immediate button, so Cancel really cancels.
- Compact variant on `FileUpload` via cva `size`, not className overrides (CLAUDE.md rule).
- No browser check required (dev server may not be signed in); code read is enough.

## Don't
- No new Figma-less screens, no hand-written SVG icons (use existing `public/icons/`).
- No backend/schema changes. No change to `UploadFilesDialog` look.
- Don't touch other 9f/9g items.
