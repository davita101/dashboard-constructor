"use client"

import * as React from "react"

import { THEME_KEY } from "@/components/dashboard/theme-script"
import { updateSettingsAction } from "@/lib/settings/actions"
import type { Theme } from "@/lib/settings/schemas"

const EVENT = "dashboard-theme-change"

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange)
  window.addEventListener("storage", onChange)
  return () => {
    window.removeEventListener(EVENT, onChange)
    window.removeEventListener("storage", onChange)
  }
}

/** Applies a theme on this device only (`.dark` class + localStorage copy read by the head script). */
export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark")
  window.localStorage.setItem(THEME_KEY, theme)
  window.dispatchEvent(new Event(EVENT))
}

/** The theme chosen on this device before, or null. */
export function localTheme(): Theme | null {
  const v = window.localStorage.getItem(THEME_KEY)
  return v === "dark" || v === "light" ? v : null
}

/** Night mode: toggles the `.dark` class the design tokens key off; saved on this device and to user_settings. */
export function useNightMode(): [boolean, (dark: boolean) => void] {
  const dark = React.useSyncExternalStore(
    subscribe,
    () => document.documentElement.classList.contains("dark"),
    () => false
  )
  const setDark = React.useCallback((next: boolean) => {
    const theme = next ? "dark" : "light"
    applyTheme(theme)
    void updateSettingsAction({ theme })
  }, [])
  return [dark, setDark]
}
