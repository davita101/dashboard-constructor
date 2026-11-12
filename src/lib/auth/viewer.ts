import "server-only"

import { auth, currentUser } from "@clerk/nextjs/server"
import { eq } from "drizzle-orm"
import { cache } from "react"

import { db } from "@/db"
import { users } from "@/db/schema"

/**
 * Signed-in Clerk user id for this request; redirects to sign-in when there is none.
 * Also makes sure the user has a `users` row, in case the Clerk webhook hasn't delivered (or isn't set up yet).
 * Runtime data: call it inside a Suspense boundary.
 */
export const getViewerId = cache(async (): Promise<string> => {
  const { userId } = await auth.protect()

  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.id, userId)).limit(1)
  if (!existing) {
    const u = await currentUser()
    if (u) {
      const name = [u.firstName, u.lastName].filter(Boolean).join(" ") || u.username || u.primaryEmailAddress?.emailAddress || u.id
      await db
        .insert(users)
        .values({ id: u.id, name, email: u.primaryEmailAddress?.emailAddress ?? null, avatar: u.imageUrl || null })
        .onConflictDoNothing()
    }
  }
  return userId
})
