# Report
Changed:
- new `src/lib/forms/field-message.ts`: `fieldMessage` (verbatim) + `FORM_ERROR_MESSAGE`.
- `src/lib/projects/actions.ts`: local fn removed, imports shared, uses constant.
- `src/lib/chat/actions.ts`: `run` and `sendProjectMessageAction` use `reportInput: true`, `flattenError(..., fieldMessage)`, constant message.

Schema check: `sendProjectMessageForm` body `trim().min(1)`; empty/missing/whitespace → "Required".

Commands:
- smoke (temp .mts via node strip-types, deleted after since tsc rejected `.ts` import): `{projectId:"",body:""}`, `{}`, whitespace body → all "Required" PASS
- `pnpm exec tsc --noEmit` PASS
- `pnpm lint` PASS (0 errors, 1 pre-existing warning in command.tsx)
- `pnpm build` PASS
- `grep -rn "function fieldMessage" src` → only field-message.ts PASS

Undone: nothing.
