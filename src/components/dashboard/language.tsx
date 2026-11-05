"use client"

import { useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import * as React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuIcon,
  DropdownMenuItem,
  DropdownMenuItemAddon,
  DropdownMenuItemLeft,
  DropdownMenuItemRight,
  DropdownMenuItemTitle,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { isLocale, LOCALE_COOKIE, locales, type Locale } from "@/i18n/config"

const LANGUAGE_KEY = "dashboard-language"

// Flag asset per locale (public/icons/flags). Locale codes and the default live in "@/i18n/config".
const flags: Record<Locale, string> = { en: "united-states", ka: "georgia", de: "germany", fr: "france", es: "spain" }

// Each language is named in itself, so someone who switched by mistake can still find their way back.
const natives: Record<Locale, string> = { en: "English", ka: "ქართული", de: "Deutsch", fr: "Français", es: "Español" }

type Language = { code: Locale; flag: string; native: string }
const languages: Language[] = locales.map((code) => ({ code, flag: flags[code], native: natives[code] }))

type LanguageContextValue = { language: Language; setLanguage: (code: Locale) => void }

const LanguageContext = React.createContext<LanguageContextValue | null>(null)

function saveLocale(code: Locale) {
  window.localStorage.setItem(LANGUAGE_KEY, code)
  document.cookie = `${LOCALE_COOKIE}=${code}; path=/; max-age=31536000; samesite=lax`
}

/**
 * Chosen language for the dashboard. The server reads the cookie (src/i18n/request.ts) to render next-intl messages;
 * localStorage keeps a copy so the choice survives a cleared cookie. Picking a language saves both and refreshes.
 */
function LanguageProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const locale = useLocale()
  const language = languages.find((l) => l.code === locale) ?? languages[0]

  React.useEffect(() => {
    document.documentElement.lang = locale
    // Cookie missing but a choice was saved before: restore it.
    const saved = window.localStorage.getItem(LANGUAGE_KEY)
    if (isLocale(saved) && saved !== locale && !document.cookie.includes(`${LOCALE_COOKIE}=`)) {
      saveLocale(saved)
      router.refresh()
    }
  }, [locale, router])

  const setLanguage = React.useCallback(
    (code: Locale) => {
      saveLocale(code)
      router.refresh()
    },
    [router]
  )

  const value = React.useMemo(() => ({ language, setLanguage }), [language, setLanguage])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

function useLanguage() {
  const ctx = React.useContext(LanguageContext)
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider")
  return ctx
}

function LanguageFlag({ language }: { language: Language }) {
  return (
    <Avatar size="24">
      <AvatarImage src={`/icons/flags/${language.flag}.svg`} alt="" />
      <AvatarFallback variant="placeholder">{language.code.toUpperCase()}</AvatarFallback>
    </Avatar>
  )
}

/**
 * Language picker menu. `trigger` is the element that opens it (footer button, sidebar row), so the same menu
 * serves both places. Picking an option saves it (see LanguageProvider).
 */
function LanguageMenu({
  trigger,
  side = "top",
  align = "end",
}: {
  trigger: React.ReactElement<Record<string, unknown>>
  side?: "top" | "bottom" | "left" | "right"
  align?: "start" | "center" | "end"
}) {
  const { language, setLanguage } = useLanguage()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={trigger} />
      <DropdownMenuContent side={side} align={align} shape="pilled">
        <DropdownMenuGroup>
          {languages.map((l) => (
            <DropdownMenuItem key={l.code} onClick={() => setLanguage(l.code)}>
              <DropdownMenuItemLeft>
                <DropdownMenuItemAddon>
                  <LanguageFlag language={l} />
                </DropdownMenuItemAddon>
                <DropdownMenuItemTitle>{l.native}</DropdownMenuItemTitle>
              </DropdownMenuItemLeft>
              {l.code === language.code && (
                <DropdownMenuItemRight>
                  <DropdownMenuIcon name="material-check" />
                </DropdownMenuItemRight>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { LanguageFlag, LanguageMenu, LanguageProvider, useLanguage }
