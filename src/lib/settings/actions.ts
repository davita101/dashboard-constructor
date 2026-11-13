"use server"

import { auth } from "@clerk/nextjs/server"
import { updateTag } from "next/cache"
import type { z } from "zod"

import { db } from "@/db"
import { userSettings } from "@/db/schema"
import { getViewerId } from "@/lib/auth/viewer"
import { userSettingsTag } from "@/lib/settings/queries"
import { updateSettingsInput } from "@/lib/settings/schemas"

/**
 * Save some of the signed-in user's settings (upsert; only the given keys change). Called fire-and-forget by the
 * theme toggle, language menu and widget board; signed out it does nothing (those controls also live on public pages).
 */
export async function updateSettingsAction(input: z.input<typeof updateSettingsInput>): Promise<{ ok: boolean }> {
  const { userId: signedIn } = await auth()
  if (!signedIn) return { ok: false }
  const parsed = updateSettingsInput.safeParse(input)
  if (!parsed.success) return { ok: false }
  const values = Object.fromEntries(Object.entries(parsed.data).filter(([, v]) => v !== undefined))
  if (!Object.keys(values).length) return { ok: true }

  // Makes sure the `users` row exists (FK) when the Clerk webhook hasn't delivered yet.
  const userId = await getViewerId()
  await db
    .insert(userSettings)
    .values({ userId, ...values })
    .onConflictDoUpdate({ target: userSettings.userId, set: { ...values, updatedAt: new Date() } })
  updateTag(userSettingsTag(userId))
  return { ok: true }
}
