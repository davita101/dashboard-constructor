// Smoke test for src/lib/chat. Run: pnpm exec tsx --conditions=react-server scripts/chat-actions-smoke.mts
// (the condition lets `server-only` load outside Next). Temp rows use a `smoke_<tag>` prefix, removed at the end.
import assert from "node:assert/strict"
import { randomUUID } from "node:crypto"

process.loadEnvFile(".env.local")

const { db } = await import("../src/db")
const { users, projects, projectMembers, conversations } = await import("../src/db/schema")
const { eq, inArray, like } = await import("drizzle-orm")
const m = await import("../src/lib/chat/mutations")
const q = await import("../src/lib/chat/queries")
const s = await import("../src/lib/chat/schemas")

const tag = randomUUID().slice(0, 8)
const uA = `smoke_${tag}_a`
const uB = `smoke_${tag}_b`
const uC = `smoke_${tag}_c`
let projectId: string | undefined

const pass = (name: string) => console.log(`PASS ${name}`)
async function refused(name: string, fn: () => Promise<unknown>) {
  try {
    await fn()
  } catch (e) {
    assert.ok(e instanceof m.ChatError, `${name}: expected ChatError, got ${e}`)
    return pass(name)
  }
  assert.fail(`${name}: expected refusal`)
}

try {
  await db.insert(users).values([
    { id: uA, name: "Smoke A" },
    { id: uB, name: "Smoke B" },
    { id: uC, name: "Smoke C" },
  ])
  const [p] = await db.insert(projects).values({ slug: `smoke-chat-${tag}`, name: "Smoke chat" }).returning({ id: projects.id })
  projectId = p.id
  await db.insert(projectMembers).values({ projectId, userId: uA })

  // direct start
  const d1 = await m.startDirect(uA, uB)
  const d2 = await m.startDirect(uB, uA)
  assert.equal(d1.conversationId, d2.conversationId)
  pass("direct start creates + is idempotent")

  await refused("self refused", () => m.startDirect(uA, uA))
  await refused("unknown user refused", () => m.startDirect(uA, `smoke_${tag}_nobody`))

  // send
  const sent = await m.sendMessage(uA, { conversationId: d1.conversationId, body: "hello" })
  assert.equal(sent.message?.body, "hello")
  pass("send by member ok")
  await refused("send by non-member refused", () => m.sendMessage(uC, { conversationId: d1.conversationId, body: "x" }))

  // project chat
  await refused("project chat: non-member refused", () => m.ensureProjectConversation(uC, projectId!))
  const pc = await m.ensureProjectConversation(uA, projectId)
  const pc2 = await m.ensureProjectConversation(uA, projectId)
  assert.equal(pc.conversationId, pc2.conversationId)
  await m.sendMessage(uA, { conversationId: pc.conversationId, body: "project hi" })
  await refused("project chat: non-member send refused", () => m.sendMessage(uC, { conversationId: pc.conversationId, body: "x" }))
  assert.deepEqual(await q.getMessages(uC, pc.conversationId), [])
  pass("project chat lazily created & non-member refused")

  // unread
  const unreadOf = async (user: string, id: string) => (await q.getConversations(user)).find((c) => c.id === id)?.unreadCount
  assert.equal(await unreadOf(uB, d1.conversationId), 1)
  assert.equal(await unreadOf(uA, d1.conversationId), 0)
  await m.markRead(uB, d1.conversationId)
  assert.equal(await unreadOf(uB, d1.conversationId), 0)
  pass("unread 1 for recipient then 0 after markRead")
  const list = await q.getConversations(uA)
  assert.equal(list.find((c) => c.id === d1.conversationId)?.title, "Smoke B")
  assert.equal(list.find((c) => c.id === pc.conversationId)?.title, "Smoke chat")

  // pagination
  for (let i = 1; i <= 4; i++) await m.sendMessage(uB, { conversationId: d1.conversationId, body: `m${i}` })
  const page1 = await q.getMessages(uA, d1.conversationId, { limit: 3 })
  assert.deepEqual(page1.map((x) => x.body), ["m2", "m3", "m4"])
  const page2 = await q.getMessages(uA, d1.conversationId, { limit: 3, before: page1[0].createdAt })
  assert.deepEqual(page2.map((x) => x.body), ["hello", "m1"])
  assert.equal(page2[0].author?.name, "Smoke A")
  pass("pagination order (newest page, oldest-first)")

  // validation
  assert.equal(s.sendMessageInput.safeParse({ conversationId: d1.conversationId, body: "   " }).success, false)
  assert.equal(s.sendMessageInput.safeParse({ conversationId: d1.conversationId, body: "x".repeat(4001) }).success, false)
  assert.equal(s.sendMessageInput.safeParse({ conversationId: d1.conversationId, body: "x".repeat(4000) }).success, true)
  pass("body length 0 / 4001 rejected")
} finally {
  if (projectId) await db.delete(projects).where(eq(projects.id, projectId)) // cascades project conversation
  const mine = await db.select({ id: users.id }).from(users).where(like(users.id, `smoke_${tag}_%`))
  const ids = mine.map((u) => u.id)
  if (ids.length) {
    // direct conversations created by smoke users (members cascade from users, conversation rows do not)
    await db.delete(conversations).where(inArray(conversations.createdBy, ids))
    await db.delete(users).where(inArray(users.id, ids))
  }
  const left = await db.select({ id: users.id }).from(users).where(like(users.id, `smoke_${tag}_%`))
  assert.equal(left.length, 0)
  pass("cleanup")
  process.exit(0)
}
