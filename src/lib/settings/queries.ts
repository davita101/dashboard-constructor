import "server-only"

import { eq } from "drizzle-orm"
import { cacheLife, cacheTag } from "next/cache"

import { db } from "@/db"
import { userSettings } from "@/db/schema"
import { isLocale } from "@/i18n/config"
import { emptySettings, widgetLayoutSchema, type UserSettings } from "@/lib/settings/schemas"

/** Cache tag of one user's settings; updateSettingsAction expires it. */
export const userSettingsTag = (userId: string) => `user-settings:${userId}`

/** The user's saved settings (nulls when never chosen). Pass the id from auth(), never from the client. */
export async function getUserSettings(userId: string): Promise<UserSettings> {
  "use cache"
  cacheLife("hours")
  cacheTag(userSettingsTag(userId))

  const [row] = await db.select().from(userSettings).where(eq(userSettings.userId, userId)).limit(1)
  if (!row) return emptySettings
  const layout = widgetLayoutSchema.safeParse(row.widgetLayout)
  return {
    theme: row.theme,
    locale: isLocale(row.locale) ? row.locale : null,
    widgetLayout: row.widgetLayout === null ? null : layout.success ? layout.data : null,
  }
}
