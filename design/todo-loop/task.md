# Task
Quick Add "Message" tile opens a dialog that posts a message to a project's chat.

## TODO item
- [ ] Quick Add "Message" tile: open a dialog that sends a message to the project chat (Phase 5 actions), built from existing Modal + Input/Textarea parts like the other Quick Add dialogs; record in known-gaps that there is no chat screen to read replies yet

## Goal
Message tile in `QuickAddCard` is live (no `data-soon`): opens `SendMessageDialog` (project picker when >1 project, Textarea body). Submit = ensure the project conversation, send the message, toast, close.

## Files
- read: `src/components/projects/QuickAddCard.tsx`, `AddMemberDialog.tsx` (pattern), `ActionDialog.tsx`, `TaskFormDialog.tsx` (Textarea usage), `FormField.tsx`, `src/lib/chat/{actions,mutations,schemas}.ts`, `src/lib/projects/action-state.ts`, `messages/en.json` (`forms.*`)
- new: `src/components/projects/SendMessageDialog.tsx`
- change: `QuickAddCard.tsx` (wire tile, fix doc comment), `src/lib/chat/actions.ts` (new FormData action `sendProjectMessageAction(state, form)`), `src/lib/chat/schemas.ts` (form schema: `projectId` uuid, `body` trimmed 1..4000), `messages/en.json` (`forms.message.*`: title, description, project, projectPlaceholder, body, bodyPlaceholder, send, sent), `design/known-gaps.md` (update line 104 area: Message tile now works, no chat screen to read replies)
- new smoke: `scripts/send-message-form-smoke.mts` only if cheap; otherwise reuse `scripts/chat-actions-smoke.mts`

## Steps
1. Add `sendProjectMessageAction(_state: ActionState, form: FormData): Promise<ActionState>` in `chat/actions.ts` (`"use server"` file, async only). Flow: `getViewerId` → parse form (`Object.fromEntries(form)`) → `m.ensureProjectConversation(userId, projectId)` → `m.sendMessage(userId, {conversationId, body})` → `expire` both results → `{status:"ok"}`. Errors: Zod → `{status:"error", message, fieldErrors}`; `ChatError` → message; else generic. Reuse `run` pieces; keep access check in code.
2. `SendMessageDialog` mirrors `AddMemberDialog`: `ActionDialog` with icon `/icons/material/material-message.svg`, hidden projectId when 1 project else NativeSelect, `FormField` + `Textarea` for body.
3. Wire the tile in `QuickAddCard` through `needsProject("message", <SendMessageDialog trigger={tile("message")} projects={projects} />)`; drop `data-soon`; update the JSDoc.
4. Add en.json keys (other locales only have partial keys; do not add). Update known-gaps.

## Acceptance
- `pnpm exec tsc --noEmit` → 0 errors
- `pnpm lint` → 0 errors (known `command.tsx` warning only)
- `pnpm build` → succeeds
- `grep -n "data-soon" src/components/projects/QuickAddCard.tsx` → no match
- Smoke (tsx --conditions=react-server, same style as `scripts/chat-actions-smoke.mts`) calls the new action's logic or the existing `chat-actions-smoke.mts` still prints only PASS lines. If the new action can't be run outside Next (auth), cover it by running `chat-actions-smoke.mts` and reading the code.
- New files: grep for hex colors, `space-[xy]-`, `dark:` → none
- Message tile opens a dialog (code check: `needsProject` wrapper, DialogTrigger)

## Decisions
- Target = project chat only (direct Messenger needs a recipient picker + a chat screen; not now).
- Without a project the tile leads to the new-project page, like the other tiles.
- Body max 4000 (existing schema). No attachments.
- Copy in en.json only.

## Don't
- No chat screen / message list UI (no Figma frame). No new SQL migration. No change to the Realtime hook. No new shadcn primitives: Textarea exists.
