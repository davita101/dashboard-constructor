# Report: 5b chat queries, schemas, mutations, actions

## Files (all new, no UI/schema/migration changes)
- `src/lib/chat/schemas.ts` – startDirectInput, sendMessageInput (trim 1..4000), markReadInput, ensureProjectConversationInput
- `src/lib/chat/tags.ts` – userChatTag, conversationTag
- `src/lib/chat/types.ts` – ConversationSummary, ChatMessage, WriteResult
- `src/lib/chat/queries.ts` – canAccess (access check), getConversations (uncached), getMessages
- `src/lib/chat/mutations.ts` – ChatError, startDirect, ensureProjectConversation, sendMessage, markRead
- `src/lib/chat/actions.ts` – startDirectAction, ensureProjectConversationAction, sendMessageAction, markReadAction
- `scripts/chat-actions-smoke.mts`

## Decisions
- Project chat creation is exposed as `ensureProjectConversation` + action (sendMessage needs a conversationId); task allowed that.
- Action result extends `ActionState` with `conversationId` and `sent` (the message; `message` is already the error text field).
- `startDirect` takes a per-pair advisory xact lock so concurrent calls don't create duplicates.
- `markRead` on project chats inserts the viewer's members row; sendMessage updates sender's lastReadAt only if a row exists.
- Nothing cached, so the tags are only expired by actions for later use.
- Smoke runs with `--conditions=react-server` so `server-only` loads outside Next. Cleanup deletes the smoke project and smoke-created direct conversations (by created_by) before users.

## Commands
- `pnpm exec tsc --noEmit` PASS (no errors)
- `pnpm lint` PASS (0 errors, 1 existing warning in ui/command.tsx)
- `pnpm build` PASS
- `pnpm exec tsx --conditions=react-server scripts/chat-actions-smoke.mts` PASS, all lines (direct start/idempotent, self/unknown refused, member send, non-member refused, project chat lazy + non-member refused, unread 1→0, pagination, body 0/4001 rejected, cleanup; no `smoke_` rows left)

## Undone
Nothing. TODO.md untouched.
