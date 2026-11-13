# Report

## Changed
- `src/lib/chat/schemas.ts`: `sendProjectMessageForm` (projectId uuid, body trimmed 1..4000).
- `src/lib/chat/actions.ts`: `sendProjectMessageAction(state, form)`: getViewerId → parse → ensureProjectConversation → sendMessage → expire both → ok. Zod/ChatError/generic errors handled. Membership checked in the mutations.
- `src/components/projects/SendMessageDialog.tsx` (new): mirrors AddMemberDialog; hidden projectId if 1 project, else NativeSelect; Textarea body.
- `src/components/projects/QuickAddCard.tsx`: Message tile via `needsProject`, `data-soon` removed, JSDoc updated.
- `messages/en.json`: `forms.message.*`.
- `design/known-gaps.md`: Message line updated.

## Decisions
- Did not write a new `run` variant; the action is inline since it makes two mutations. Both expire tags separately.
- No new shadcn primitive was added (Textarea exists), so I did not invoke the shadcn skill.
- No new smoke script: the action needs Next auth. Ran the existing smoke instead.

## Commands
- `pnpm exec tsc --noEmit`: PASS (0 errors)
- `pnpm lint`: PASS (only the known command.tsx warning)
- `pnpm build`: PASS
- `grep data-soon QuickAddCard.tsx`: PASS (no match)
- `tsx --conditions=react-server scripts/chat-actions-smoke.mts`: PASS (all PASS lines)
- Hex / `space-[xy]-` / `dark:` grep on SendMessageDialog: no matches (checked with the Grep tool).
- Code check: `needsProject("message", <SendMessageDialog .../>)`, and ActionDialog uses a DialogTrigger.

## Undone
- No browser check of the dialog.
