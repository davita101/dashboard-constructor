// Smoke test for the removeLogo / removeClientLogo flags. Run: pnpm exec tsx --conditions=react-server scripts/logo-remove-smoke.mts
// Logo URLs are fake (non-storage) so no storage call happens. Temp rows use a `smoke_<tag>` prefix, removed at the end.
import assert from "node:assert/strict"
import { randomUUID } from "node:crypto"

process.loadEnvFile(".env.local")

// `@clerk/nextjs/server` pulls next/navigation (needs full React) and is only used for storage calls, which fake
// (non-storage) URLs never reach. Stub it before anything imports it.
const { createRequire } = await import("node:module")
const req = createRequire(import.meta.url)
const clerkPath = req.resolve("@clerk/nextjs/server")
req.cache[clerkPath] = { id: clerkPath, filename: clerkPath, loaded: true, exports: { auth: async () => ({ getToken: async () => null }) } } as never

const { db } = await import("../src/db")
const { users, projects, projectMembers, clients } = await import("../src/db/schema")
const { eq } = await import("drizzle-orm")
const m = await import("../src/lib/projects/mutations")
const s = await import("../src/lib/projects/schemas")

const tag = randomUUID().slice(0, 8)
const uA = `smoke_${tag}_a`
const uB = `smoke_${tag}_b`
const projectIds: string[] = []
const clientIds: string[] = []

const pass = (name: string) => console.log(`PASS ${name}`)
const row = async (projectId: string, clientId: string | null) => {
  const [p] = await db.select({ logo: projects.logo }).from(projects).where(eq(projects.id, projectId))
  const [c] = clientId ? await db.select({ logo: clients.logo }).from(clients).where(eq(clients.id, clientId)) : [undefined]
  return { logo: p.logo, clientLogo: c?.logo ?? null }
}

async function makeProject(name: string, withClient: boolean) {
  let clientId: string | null = null
  if (withClient) {
    const [c] = await db.insert(clients).values({ name: `smoke_${tag}_${name}`, logo: `https://example.test/${tag}/${name}-client.png` }).returning({ id: clients.id })
    clientId = c.id
    clientIds.push(clientId)
  }
  const [p] = await db
    .insert(projects)
    .values({ slug: `smoke-logo-${tag}-${name}`, name: `Smoke ${name}`, logo: `https://example.test/${tag}/${name}.png`, clientId })
    .returning({ id: projects.id })
  projectIds.push(p.id)
  await db.insert(projectMembers).values({ projectId: p.id, userId: uA })
  return { projectId: p.id, clientId }
}

try {
  await db.insert(users).values([
    { id: uA, name: "Smoke A" },
    { id: uB, name: "Smoke B" },
  ])

  // flag parse
  const base = { name: "x", income: "", cost: "" }
  const parse = (extra: Record<string, unknown>) => s.projectFields.parse({ ...base, ...extra })
  assert.equal(parse({}).removeLogo, false)
  assert.equal(parse({}).removeClientLogo, false)
  assert.equal(parse({ removeLogo: "on" }).removeLogo, true)
  assert.equal(parse({ removeClientLogo: "true" }).removeClientLogo, true)
  assert.equal(parse({ removeLogo: "1" }).removeLogo, true)
  assert.equal(parse({ removeLogo: "" }).removeLogo, false)
  pass("flag parse (absent=false, on/true/1=true)")

  // project logo cleared, client logo untouched
  const a = await makeProject("a", true)
  await m.setLogos(uA, a.projectId, { removeLogo: true })
  let r = await row(a.projectId, a.clientId)
  assert.equal(r.logo, null)
  assert.ok(r.clientLogo)
  pass("project logo cleared")
  pass("client logo untouched when only removeLogo")

  // client logo cleared, project logo untouched
  const b = await makeProject("b", true)
  await m.setLogos(uA, b.projectId, { removeClientLogo: true })
  r = await row(b.projectId, b.clientId)
  assert.equal(r.clientLogo, null)
  assert.ok(r.logo)
  pass("client logo cleared")
  pass("project logo untouched when only removeClientLogo")

  // no flags: no-op
  const c = await makeProject("c", true)
  await m.setLogos(uA, c.projectId, {})
  r = await row(c.projectId, c.clientId)
  assert.ok(r.logo && r.clientLogo)
  pass("no flags is a no-op")

  // non-member refused, nothing changed
  const d = await makeProject("d", true)
  await assert.rejects(
    () => m.setLogos(uB, d.projectId, { removeLogo: true, removeClientLogo: true }),
    (e) => e instanceof m.MutationError,
  )
  r = await row(d.projectId, d.clientId)
  assert.ok(r.logo && r.clientLogo)
  pass("non-member refused")

  // no client + removeClientLogo ignored, removeLogo still works
  const e = await makeProject("e", false)
  await m.setLogos(uA, e.projectId, { removeClientLogo: true })
  r = await row(e.projectId, null)
  assert.ok(r.logo)
  await m.setLogos(uA, e.projectId, { removeLogo: true, removeClientLogo: true })
  r = await row(e.projectId, null)
  assert.equal(r.logo, null)
  pass("no-client + removeClientLogo ignored")
} catch (e) {
  console.error("FAIL", e)
  process.exitCode = 1
} finally {
  for (const id of projectIds) await db.delete(projects).where(eq(projects.id, id))
  for (const id of clientIds) await db.delete(clients).where(eq(clients.id, id))
  await db.delete(users).where(eq(users.id, uA))
  await db.delete(users).where(eq(users.id, uB))
  process.exit(process.exitCode ?? 0)
}
