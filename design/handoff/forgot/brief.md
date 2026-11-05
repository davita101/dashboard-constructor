# Brief: Forgot Password (route /forgot-password)

Figma data: `design/handoff/forgot/responsive.md` (1600 = 14056:126394, 360 = 14056:126352), images `img/desktop.png` and `img/mobile.png` (you may read each ONCE: this page has no photo, so they are cheap and show the header/footer you must recreate). Read `design/style-decisions.md` (last bullet: password-flow shell) and the Budget section of `.claude/agents/page-builder.md` first.

## Layout (identical idea at both sizes)
Column, `min-h-svh`, page `bg-background-20`:
1. `Navigate-01` header, 64px tall, full width (1600 and 360): the project header with logo + "New Project", an "Upgrade" button and a profile avatar (see the 360 image). Build from `src/components/ui/navigate-head.tsx` (`NavigateHead`, size `mobile` below lg and `desktop` from lg if the variants differ; copy the composition from `src/app/design-system/navigate-head/page.tsx`).
2. Centered content: a white card (`bg-background-0`, radius `rounded-r20`, Figma frame 400x440 at 1600 / 320x420 at 360, with 40px / 20px inset around the 320x360 / 280x360 form), vertically centered in the free space between header and footer.
3. `Footer` at the bottom: 1600 frame = 64px bar, 360 frame = 204px (social icons, language, copyright). Build from `src/components/ui/navigate-footer.tsx` (`NavigateFooter`, sizes desktop|tablet|mobile, composition in `src/app/design-system/navigate-footer/page.tsx`).
Header/footer content is static placeholder from Figma ("New Project", "Upgrade", "Global Inc."); do not wire it. Missing icons (Facebook/Pinterest glyphs, project icon) fall back to `material-default-icon.svg` and are already in `design/known-gaps.md`; never write SVGs.

## Build once, reuse six times
Create `src/components/auth/auth-page-shell.tsx` (`AuthPageShell({ children })`: header + centered card slot + footer, server component) and `src/components/auth/auth-card.tsx` only if the card is not already `AuthPanel` (check `ui:index auth`: `AuthPanel` is the 20px-radius bordered card; the 400x440 card here may need `padding` from the existing variants, add a `cva` variant to `ui/auth.tsx` only if none fits, never a className override). The other five password pages will reuse the shell.

## The form: `src/components/auth/forgot-password-form.tsx` ("use client")
Markup = existing `src/components/auth/forgot-password.tsx` (Figma Forgot-Password: `Auth size="320"`, icon, title "Forgot Password?", description, `AuthField` email, "Confirm" button, "Back to Log In" link to `/sign-in`). Keep Figma copy as is. Make it real with Clerk v7 (`useSignIn()` from `@clerk/nextjs` returns `{ signIn, errors, fetchStatus }`):
- On submit: `const { error } = await signIn.create({ identifier: email })`; if no error: `await signIn.resetPasswordEmailCode.sendCode()`; if no error: `router.push("/check-email")` (queue page #4, not built yet: log that gap in `design/known-gaps.md`, one line).
- Errors: `errors.fields.identifier?.message` on the email `AuthField` (`error` prop), `errors.global?.[0]?.message` above the button (same `FieldError` pattern as `SignInForm`). Button disabled while `fetchStatus === "fetching"`.
- `name="email"`, `autoComplete="email"`. One form in the DOM.
- `/forgot-password` must be public: add it to `isPublicRoute` in `src/proxy.ts` (also add `/check-email`, `/verify`, `/two-factor`, `/set-new-password`, `/password-reset`, which the next pages need).

## Page
`src/app/forgot-password/page.tsx` (Server Component): `<AuthPageShell><ForgotPasswordForm /></AuthPageShell>`. Do not touch sign-in, sign-up, `AuthShowcase` or their pages. The static `ForgotPassword` template stays for the design-system page.

## Responsive and checks
Same shell at all widths; only header/footer size variants change. Checks as the charter: tsc, eslint on changed files, `pnpm -s audit:component` on new .tsx, `pnpm build`. Measure instead of looking: one script call that prints header height, card size and footer height at 1600 and 360 (a temporary `scripts/.ev.mjs` you delete): expect header 64, card 400x440 (1600) / 320x420 (360), footer 64 (1600) / 204 (360). Do not commit or push. Reply max 10 lines.
