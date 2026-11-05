"use client"

import * as React from "react"

import { THEME_KEY } from "@/components/dashboard/theme-script"

const EVENT = "dashboard-theme-change"

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange)
  window.addEventListener("storage", onChange)
  return () => {
    window.removeEventListener(EVENT, onChange)
    window.removeEventListener("storage", onChange)
  }
}

/** Night mode: toggles the `.dark` class the design tokens key off, and remembers the choice in localStorage. */
export function useNightMode(): [boolean, (dark: boolean) => void] {
  const dark = React.useSyncExternalStore(
    subscribe,
    () => document.documentElement.classList.contains("dark"),
    () => false
  )
  const setDark = React.useCallback((next: boolean) => {
    document.documentElement.classList.toggle("dark", next)
    window.localStorage.setItem(THEME_KEY, next ? "dark" : "light")
    window.dispatchEvent(new Event(EVENT))
  }, [])
  return [dark, setDark]
}
