"use client"

import * as React from "react"

export type DashboardSize = "desktop" | "tablet" | "mobile"

// Figma draws the dashboard at 1600 / 768 / 360. Desktop starts at lg (1024, where the sidebar docks), tablet at md (768).
const TABLET = "(min-width: 768px)"
const DESKTOP = "(min-width: 1024px)"

function subscribe(onChange: () => void) {
  const lists = [window.matchMedia(TABLET), window.matchMedia(DESKTOP)]
  lists.forEach((l) => l.addEventListener("change", onChange))
  return () => lists.forEach((l) => l.removeEventListener("change", onChange))
}

function getSnapshot(): DashboardSize {
  if (window.matchMedia(DESKTOP).matches) return "desktop"
  return window.matchMedia(TABLET).matches ? "tablet" : "mobile"
}

/** Current dashboard layout size, or null on the server / first paint (so nothing flashes at the wrong size). */
export function useDashboardSize(): DashboardSize | null {
  return React.useSyncExternalStore(subscribe, getSnapshot, () => null)
}
