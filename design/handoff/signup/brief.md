# Brief: Sign Up (route /sign-up)

Figma data: `design/handoff/signup/responsive.md` (1600 = 14056:126293, 360 = 14056:126321) and `img/desktop.png`, `img/mobile.png`. Read `design/style-decisions.md` and `.claude/agents/page-builder.md` budget first. Do not look at images; the facts are below.

## Decision from the user
Build ONLY the sign-up form section. The right side is the SAME carousel as sign-in (`AuthShowcase`, six slides, autoplay, fixed height). Figma draws a testimonial panel there; the user chose the shared carousel instead. Do not edit `AuthShowcase`, its slides or its photos.

## What exists (reuse)
- `src/app/sign-in/[[...sign-in]]/page.tsx`: the two-panel/stacked page shell around `SignInForm` + `AuthShowcase` (approved). Read it; extract the shell into `src/components/auth/auth-split.tsx` (`AuthSplit({ children })`: the `<main>` grid, the white form panel with `AuthPanel`, the `<aside>` with `AuthShowcase`), and make BOTH pages use it, with sign-in rendering exactly what it renders today. Sign-in must not change visually.
- `src/components/auth/sign-in-form.tsx`: copy its structure (Clerk hook usage, error handling, OAuth) for the sign-up form.
- `src/components/auth/sign-up-01.tsx`: static Figma Sign-Up-01 markup (head "Sign Up to Account" / "Start New Project" in `text-base-800` + `tone="subtle"`, fields Username / Email Address / Password, Remember Me + "Terms and Policy" link, "Create Account" button, social buttons). Use its markup, not its static values.
- `AuthField` (has `error`), `AuthSocialButtons` (props `providers`, `onProvider`, `disabled`), `src/components/ui/auth.tsx`.

## New: `src/components/auth/sign-up-form.tsx` ("use client")
Clerk v7 custom flow (`useSignUp()` from `@clerk/nextjs` returns `{ signUp, errors, fetchStatus }`, same shape as `useSignIn`):
- Submit: `await signUp.password({ emailAddress, password, username })` (pass `username` only when non-empty). It resolves `{ error }`; field errors appear in `errors.fields.emailAddress | password | username` and global ones in `errors.global`.
- Then: if `signUp.status === "complete"` → `await signUp.finalize({ navigate: () => router.push("/") })`. Otherwise (email verification needed) → `await signUp.verifications.sendEmailCode()` then `router.push("/verify")`. The `/verify` page is queue item #5 and does not exist yet; log that gap in `design/known-gaps.md` (one line).
- OAuth: `await signUp.sso({ strategy: "oauth_google" | "oauth_facebook" | "oauth_apple", redirectUrl: "/", redirectCallbackUrl: "/sso-callback" })` (same as `SignInForm`).
- Providers shown: Google, Facebook AND Apple (Figma sign-up draws only Google and Facebook; the user asked to add Apple with the same logo/button as sign-in). Log "Sign Up: Apple button added (not in Figma)" in `design/page-additions.md`.
- Username only works if enabled in the Clerk instance; if Clerk rejects it, show the field error as is.
- Names/ids: inputs `name="username" | "email" | "password"`, `autoComplete="username" | "email" | "new-password"`; one form in the DOM; fields `AuthField` with `error`.

## Page
`src/app/sign-up/[[...sign-up]]/page.tsx` replaces the stock `<SignUp />` with `<AuthSplit><SignUpForm /></AuthSplit>`. Keep it a Server Component. Add `/sign-up` to nothing: it is already public in `src/proxy.ts`.

## Responsive
Same as sign-in (Main 360 behaviour): below lg stacked, form panel then the carousel panel, 20px padding, 16px gap, centered `max-w-160`; from lg two columns. The Figma sign-up form panel is 320x608 at 360 and 360x648 at 1600 (form 280 wide, 40px/20px inset); `AuthPanel`/`AuthSplit` already give that; do not change heights of the carousel panel.

## Checks (numbers, no images)
tsc, eslint on changed files, `pnpm -s audit:component src/components/auth/sign-up-form.tsx src/components/auth/auth-split.tsx`, `pnpm build`. Run `MSYS_NO_PATHCONV=1 pnpm -s shot:slides /sign-in 1600` and `/sign-up 1600` and `/sign-up 360`: panel height must be identical on both pages. Take ONE screenshot per page at 360 and one at 1600 with `pnpm -s shot` only if needed to confirm the form; otherwise numbers. Do not commit or push. Reply max 10 lines.
