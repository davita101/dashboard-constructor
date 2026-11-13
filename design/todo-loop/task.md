# Task
Share the friendly Zod field-message mapper between project and chat actions.

## TODO item
- [ ] Supervisor browser check of Send message (sending works, message row saved): submitting empty shows raw Zod text ("Invalid input: expected string, received undefined", "Too small: expected string to have >=1 characters") instead of "Required" like the other dialogs. `src/lib/chat/actions.ts` calls `z.flattenError(parsed.error)` without the friendly mapper: move `fieldMessage` from `src/lib/projects/actions.ts` into a shared non-"use server" module (e.g. `src/lib/forms/field-message.ts`) and use it in both action files; also use the "Check the highlighted fields" summary message

## Goal
Empty Send message dialog shows "Required" per field and summary "Check the highlighted fields", same as project dialogs.

## Files
- src/lib/projects/actions.ts (remove local fieldMessage, import shared)
- src/lib/chat/actions.ts (both `run` and `sendProjectMessageAction`)
- new src/lib/forms/field-message.ts (plain module, no "use server", no "server-only" needed)

## Steps
1. Create `field-message.ts` exporting `fieldMessage(issue: z.core.$ZodIssue): string` (copy body verbatim) and `FORM_ERROR_MESSAGE = "Check the highlighted fields"`.
2. projects/actions.ts: import both, delete local function, use constant.
3. chat/actions.ts: in both places `schema.safeParse(raw, { reportInput: true })` (the mapper reads `issue.input`), `z.flattenError(parsed.error, fieldMessage).fieldErrors`, message = constant.
4. Check `sendProjectMessageForm` in chat schemas: empty/missing body must yield a Zod issue (min 1) so it maps to "Required".

## Acceptance
- `pnpm exec tsc --noEmit` clean; `pnpm lint` 0 errors; `pnpm build` passes.
- `grep -rn "function fieldMessage" src` → only src/lib/forms/field-message.ts.
- Quick tsx script (delete after, or keep as scripts/field-message-smoke.mts printing PASS): parse sendProjectMessageForm with `{projectId:"", body:""}` and `{}` using reportInput + mapper → every message is "Required" (or other short human text), none contains "Invalid input:" / "Too small:".

## Decisions
- Shared module under src/lib/forms (a "use server" file may only export async functions).
- Constant for summary message so both actions stay in sync.

## Don't
- No UI changes, no other schema changes, no behavior change for project actions.
