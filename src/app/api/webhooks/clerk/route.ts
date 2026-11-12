import type { UserJSON } from "@clerk/nextjs/server"
import { verifyWebhook } from "@clerk/nextjs/webhooks"
import { eq } from "drizzle-orm"
import type { NextRequest } from "next/server"

import { db } from "@/db"
import { users } from "@/db/schema"

// Clerk → Webhooks → endpoint `<origin>/api/webhooks/clerk`, events user.created / user.updated / user.deleted.
// Signed with CLERK_WEBHOOK_SIGNING_SECRET (Svix); public route in src/proxy.ts.

function toRow(u: UserJSON) {
  const email = u.email_addresses.find((e) => e.id === u.primary_email_address_id)?.email_address ?? null
  const name = [u.first_name, u.last_name].filter(Boolean).join(" ") || u.username || email || u.id
  return { id: u.id, name, email, avatar: u.image_url || null }
}

export async function POST(req: NextRequest) {
  let evt
  try {
    evt = await verifyWebhook(req)
  } catch {
    return new Response("Invalid signature", { status: 400 })
  }

  switch (evt.type) {
    case "user.created":
    case "user.updated": {
      const row = toRow(evt.data)
      await db
        .insert(users)
        .values(row)
        .onConflictDoUpdate({
          target: users.id,
          set: { name: row.name, email: row.email, avatar: row.avatar, updatedAt: new Date() },
        })
      break
    }
    case "user.deleted": {
      if (evt.data.id) await db.delete(users).where(eq(users.id, evt.data.id))
      break
    }
  }

  return new Response(null, { status: 204 })
}
