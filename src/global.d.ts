import type en from "../messages/en.json"
import type { Locale } from "@/i18n/config"

// Type-checked message keys and locales for next-intl.
declare module "next-intl" {
  interface AppConfig {
    Messages: typeof en
    Locale: Locale
  }
}
