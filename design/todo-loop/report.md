# Report

## Changed
- `src/lib/chat/realtime.ts` (new): `StreamedMessage`, `parseMessageRow`, `useMessageStream(conversationId, onMessage)`. Channel `messages:<id>`, `postgres_changes` INSERT on `public.messages`, filter `conversation_id=eq.<id>`, `removeChannel` on cleanup, `onMessage` in a ref, skips on null id. No extra `setAuth` code (the `accessToken` option covers it).
- `scripts/chat-realtime-smoke.mjs` (new): asserts `parseMessageRow`. Run with `pnpm exec tsx scripts/chat-realtime-smoke.mjs`, because it imports the `.ts` file.

## Commands
- `pnpm exec tsx scripts/chat-realtime-smoke.mjs`: PASS parseMessageRow, exit 0. The two realtime checks print SKIP (see below).
- `pnpm exec tsc --noEmit`: PASS
- `pnpm lint`: PASS (0 errors, 1 pre-existing warning in `command.tsx`)
- `pnpm build`: PASS
- grep for hex colors, `space-[xy]-` and `dark:` in the new files: PASS (no matches)

## NOT proven: live realtime delivery and RLS filtering
I tried to mint a Clerk session token for a real Clerk user (list users, create a session, create a token via the Backend API with `CLERK_SECRET_KEY`). The permission classifier denied that call ("Identity Not Given"). I did not work around the denial.
No earlier smoke script in the repo mints Clerk tokens, so there was no existing pattern to reuse.
As a result `PASS member receives insert` and `PASS non-member receives nothing` are **not** produced. The script prints `SKIP` for both. The task's fallback clause allows shipping this way.
To finish: allow Clerk Backend API calls, or provide two Clerk user tokens. Then extend the script with the temp project, conversation and members, two `accessToken` clients, and the 10 s and 3 s assertions.
Also check that the Clerk token carries `role: authenticated`. Supabase third-party auth needs that claim.

## Decisions
- The hook delivers the raw row with no author join, as the task specified.
- The handler ref is updated in an effect (not during render) to satisfy the React lint rule.
