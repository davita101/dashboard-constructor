# Pages queue

One row per Figma page template. Frames are the 1600 (desktop) and 360 (mobile) versions on the Figma page
"Dashboard: Sing In, Sing Up, Password" (10060:109970). Status: todo, in-progress, review, done, blocked.

| # | Page | Route | Desktop frame | Mobile frame | Status | Notes |
|---|---|---|---|---|---|---|
| 1 | Sign In | /sign-in | 14056:126280 | 14056:126309 | done | Clerk password + OAuth |
| 2 | Sign Up | /sign-up | 14056:126293 | 14056:126321 | done | Shared carousel (user choice), Apple button added |
| 3 | Forgot Password | /forgot-password | 14056:126394 | 14056:126352 | done | renders (200), Clerk reset code send |
| 4 | Check Your Email | /check-email | 14056:126406 | 14056:126376 | done | serves both code steps (sign-up verify, reset code) by step marker; no marker → /forgot-password |
| 5 | Code | /check-email | 14056:126418 | 14056:126346 | done | no /verify route: the code step is `/check-email` (SignUpCodeForm / ResetCodeForm, OtpCodeField) |
| 6 | Two-factor Authentication | /two-factor | 14056:126400 | 14056:126358 | skipped | not needed (user, 2026-11-13); no page (404); proxy lists `/two-factor` as public; Clerk `needs_second_factor` not handled |
| 7 | Set New Password | /set-new-password | 14056:126412 | 14056:126364 | done | renders (200) |
| 8 | Password Reset | /password-reset | 14056:126424 | 14056:126370 | done | `PasswordResetGate`; needs the new session, signed-out request → /sign-in (307) |

Note: frames 14056:126382 and 14056:126388 are duplicate Sign In / Sign Up 1600 frames and 14056:126341 a duplicate Sign Up 360; confirm before using them for Sign Up.
