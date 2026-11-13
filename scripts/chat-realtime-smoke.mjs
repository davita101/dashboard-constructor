// Smoke test for src/lib/chat/realtime.ts. Run: pnpm exec tsx scripts/chat-realtime-smoke.mjs
// Asserts parseMessageRow. Live delivery/RLS needs Clerk session tokens for real users (CLERK_SECRET_KEY
// session minting); not run here, so those checks print SKIP instead of PASS.
import assert from "node:assert/strict"

import { parseMessageRow } from "../src/lib/chat/realtime.ts"

const row = {
  id: "m1",
  conversation_id: "c1",
  author_id: "user_1",
  body: "hello",
  created_at: "2026-11-13T10:00:00.000Z",
  edited_at: null,
}
const m = parseMessageRow(row)
assert.deepEqual(m, {
  id: "m1",
  conversationId: "c1",
  authorId: "user_1",
  body: "hello",
  createdAt: new Date("2026-11-13T10:00:00.000Z"),
  editedAt: null,
})
assert.equal(parseMessageRow({ ...row, author_id: null, edited_at: "2026-11-13T11:00:00.000Z" }).authorId, null)
assert.equal(parseMessageRow({ ...row, edited_at: "2026-11-13T11:00:00.000Z" }).editedAt.toISOString(), "2026-11-13T11:00:00.000Z")
console.log("PASS parseMessageRow")
console.log("SKIP member receives insert (no Clerk token minting permitted)")
console.log("SKIP non-member receives nothing (no Clerk token minting permitted)")
