# Report 9e-3b

## Changed
- `src/components/ui/file-upload.tsx`: cva `size` (`default` h-50 gap-6 = unchanged classes, `compact` h-auto gap-2 py-4); compact uses 32px badge. `size` omitted from input props (clashed with native `size`).
- `src/components/projects/ProjectFormDialog.tsx`: `ProjectFormValues` += `logo`, `clientLogo`; `LogoField` gets `current`. Shows `LogoAvatar` (40, brand frame) + `CheckboxField`/`Checkbox` "Remove logo" (`name=removeLogo|removeClientLogo`, `value=on`, applied on Save). Picking a file unchecks it. Compact FileUpload. No `current` -> no control (create form, client without logo).
- `src/components/projects/ProjectPageView.tsx`: passes `project.logo` / `company.logo`, "" when it is the placeholder.
- `src/lib/projects/types.ts` + `queries.ts`: `DEFAULT_LOGO` moved to types.ts (queries is server-only) so the view can tell placeholder from a real logo.
- `messages/en.json`: `forms.project.currentLogo`, `removeLogo` (only en exists).
- `design/known-gaps.md`: removed the ProjectFormDialog logos line.

## Decisions
- Shadcn skill tool not available in this run; reused existing ui parts (CheckboxField, Checkbox, Avatar via LogoAvatar).
- Placeholder logo is not treated as "current" (nothing to remove).

## Commands
- `pnpm exec tsc --noEmit`: PASS
- `pnpm lint`: PASS (0 errors, 1 pre-existing warning in command.tsx)
- `pnpm build`: PASS
- `pnpm exec tsx --conditions=react-server scripts/logo-remove-smoke.mts`: PASS (all 8)
- grep hex / space-x|y / dark: / w-N h-N in changed files: none

No browser check (per task).
