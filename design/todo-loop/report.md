# Report 9e-3a

## Changed
- `src/lib/projects/schemas.ts`: `flag` helper ("on"/"true"/"1"/true → true, else false); `removeLogo`, `removeClientLogo` in `projectFields`.
- `src/lib/projects/mutations.ts` `setLogos`: input now Partial; remove flag per slot only when no upload for that slot (upload wins). Early return only when no upload and no flag. Sets column null, then `removeLogoIfUnused(tx, old)` in same tx. Client remove without client: ignored silently.
- `src/lib/projects/actions.ts`: create passes only `{logo, clientLogo}` to `setLogos` (flags ignored). Update unchanged.
- `scripts/logo-remove-smoke.mts`: new.

## Decisions
- Smoke stubs `@clerk/nextjs/server` in require.cache: it pulls next/navigation, which crashes under `react-server` condition. Storage never called (fake URLs).
- Smoke has catch → exitCode 1 so failures are not swallowed by `process.exit` in finally.
- Upload+remove conflict covered by code logic (`!input.logo`), not smoke (needs storage).

## Commands
- `pnpm exec tsx --conditions=react-server scripts/logo-remove-smoke.mts` — PASS x8 lines, exit 0 (flag parse, project cleared, client untouched, client cleared, project untouched, no-op, non-member refused, no-client ignored)
- `pnpm exec tsc --noEmit` — PASS
- `pnpm lint` — PASS (0 errors, 1 pre-existing warning in command.tsx)
- `pnpm build` — PASS

## Undone
Nothing.
