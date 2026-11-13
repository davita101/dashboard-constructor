"use client"

import { useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import * as React from "react"

import { saveLocale } from "@/components/dashboard/language"
import { applyTheme, localTheme } from "@/components/dashboard/theme"
import { localLayout, replaceLocalLayout } from "@/components/dashboard/widgets/widget-layout"
import { isLocale, LOCALE_COOKIE } from "@/i18n/config"
import { updateSettingsAction } from "@/lib/settings/actions"
import type { UserSettings } from "@/lib/settings/schemas"

/**
 * Brings the signed-in user's saved settings (user_settings) to this device once per visit: theme, language and
 * widget board. A setting saved on the account wins over this device's copy; one this device has but the account
 * doesn't (chosen before Phase 6) is uploaded. Later changes save themselves (theme.ts, language.tsx, widget-layout.ts).
 */
function SettingsSync({ settings }: { settings: UserSettings }) {
  const router = useRouter()
  const locale = useLocale()
  const done = React.useRef(false)

  React.useEffect(() => {
    if (done.current) return
    done.current = true
    const upload: Parameters<typeof updateSettingsAction>[0] = {}

    const theme = localTheme()
    if (settings.theme) {
      if (settings.theme !== theme) applyTheme(settings.theme)
    } else if (theme) upload.theme = theme

    const layout = localLayout()
    if (settings.widgetLayout) {
      if (JSON.stringify(settings.widgetLayout) !== JSON.stringify(layout)) replaceLocalLayout(settings.widgetLayout)
    } else if (layout?.length) upload.widgetLayout = layout

    let refresh = false
    if (settings.locale) {
      if (settings.locale !== locale) {
        saveLocale(settings.locale)
        refresh = true
      }
    } else if (isLocale(locale) && new RegExp(`(^|; )${LOCALE_COOKIE}=`).test(document.cookie)) upload.locale = locale

    if (Object.keys(upload).length) void updateSettingsAction(upload)
    if (refresh) router.refresh()
  }, [settings, locale, router])

  return null
}

export { SettingsSync }
