// Smoke test for migration 0003_chat. Run: node scripts/chat-schema-smoke.mjs
// Creates temp rows with a unique prefix and removes only those at the end.
import assert from "node:assert/strict"
import { randomUUID } from "node:crypto"
import postgres from "postgres"

process.loadEnvFile(".env.local")
const sql = postgres(process.env.DATABASE_URL, { prepare: false, onnotice: () => {} })

const tag = randomUUID().slice(0, 8)
const uA = `smoke_${tag}_a`
const uB = `smoke_${tag}_b`
const uC = `smoke_${tag}_c`
const slug = `smoke-chat-${tag}`
let projectId

const pass = (name) => console.log(`PASS ${name}`)
async function rejects(name, fn, code) {
  try {
    await sql.begin(fn)
  } catch (e) {
    assert.equal(e.code, code, `${name}: expected ${code}, got ${e.code}`)
    return pass(name)
  }
  assert.fail(`${name}: expected rejection`)
}

try {
  await sql`insert into users (id, name) values (${uA}, 'Smoke A'), (${uB}, 'Smoke B'), (${uC}, 'Smoke C')`
  ;[{ id: projectId }] = await sql`insert into projects (slug, name) values (${slug}, 'Smoke chat') returning id`
  await sql`insert into project_members (project_id, user_id) values (${projectId}, ${uA})`

  const [direct] = await sql`insert into conversations (kind, created_by) values ('direct', ${uA}) returning id`
  await sql`insert into conversation_members (conversation_id, user_id) values (${direct.id}, ${uA}), (${direct.id}, ${uB})`
  await sql`insert into messages (conversation_id, author_id, body) values (${direct.id}, ${uA}, 'hi'), (${direct.id}, ${uB}, 'yo')`
  pass("direct conversation + 2 messages")

  const [proj] = await sql`insert into conversations (kind, project_id) values ('project', ${projectId}) returning id`
  pass("project conversation")

  await rejects("check: project kind needs project_id", (tx) => tx`insert into conversations (kind) values ('project')`, "23514")
  await rejects(
    "check: direct kind rejects project_id",
    (tx) => tx`insert into conversations (kind, project_id) values ('direct', ${projectId})`,
    "23514",
  )
  await rejects(
    "unique: one project conversation per project",
    (tx) => tx`insert into conversations (kind, project_id) values ('project', ${projectId})`,
    "23505",
  )
  await rejects("check: empty body", (tx) => tx`insert into messages (conversation_id, body) values (${direct.id}, '')`, "23514")
  await rejects(
    "check: body > 4000",
    (tx) => tx`insert into messages (conversation_id, body) values (${direct.id}, ${"x".repeat(4001)})`,
    "23514",
  )

  // RLS helper as the authenticated role, inside a rolled-back tx.
  const visible = async (user) => {
    let ids
    try {
      await sql.begin(async (tx) => {
        await tx`select set_config('request.jwt.claims', ${JSON.stringify({ sub: user, role: "authenticated" })}, true)`
        await tx`set local role authenticated`
        ids = (await tx`select id from conversations where id in (${direct.id}, ${proj.id})`).map((r) => r.id)
        const msgs = await tx`select id from messages where conversation_id = ${direct.id}`
        ids.msgCount = msgs.length
        throw new Error("rollback")
      })
    } catch (e) {
      if (e.message !== "rollback") throw e
    }
    return ids
  }
  const a = await visible(uA)
  assert.deepEqual([...a].sort(), [direct.id, proj.id].sort())
  assert.equal(a.msgCount, 2)
  const b = await visible(uB)
  assert.deepEqual([...b], [direct.id])
  const c = await visible(uC)
  assert.equal(c.length, 0)
  assert.equal(c.msgCount, 0)
  pass("RLS: member / participant / outsider visibility")

  await sql`delete from conversations where id = ${direct.id}`
  const [{ n }] = await sql`select count(*)::int n from messages where conversation_id = ${direct.id}`
  assert.equal(n, 0)
  pass("cascade: deleting conversation removes messages")
} finally {
  if (projectId) await sql`delete from projects where id = ${projectId}` // cascades project conversation + members
  await sql`delete from users where id in (${uA}, ${uB}, ${uC})` // cascades remaining members
  const [{ n }] = await sql`select count(*)::int n from users where id like ${`smoke_${tag}_%`}`
  assert.equal(n, 0)
  await sql.end()
}
pass("cleanup")
