"use client"

import * as React from "react"

// The dashboard layout, saved in localStorage: a flat ordered list of widgets.
// The board renders it as a 5-column CSS grid; each widget's size (1x1, 2x3, full row) comes from the catalog.

type WidgetItem = { id: string; type: string }
type WidgetLayout = WidgetItem[]

const STORAGE_KEY = "dashboard-widget-layout"

const EMPTY: WidgetLayout = []

const uid = () => Math.random().toString(36).slice(2, 10)

const isItem = (item: unknown): item is WidgetItem =>
  !!item && typeof (item as WidgetItem).id === "string" && typeof (item as WidgetItem).type === "string"

function parse(raw: string | null): WidgetLayout {
  if (!raw) return EMPTY
  try {
    const data: unknown = JSON.parse(raw)
    if (!Array.isArray(data)) return EMPTY
    const items: WidgetLayout = []
    for (const entry of data) {
      if (isItem(entry)) items.push({ id: entry.id, type: entry.type })
      // Older saves were rows of columns of items (or rows of items): flatten them in reading order.
      else if (entry && Array.isArray(entry.columns))
        for (const column of entry.columns) if (column && Array.isArray(column.items)) items.push(...column.items.filter(isItem))
      else if (entry && Array.isArray(entry.items)) items.push(...entry.items.filter(isItem))
    }
    return items
  } catch {
    return EMPTY
  }
}

// useSyncExternalStore needs a stable snapshot object, so the parsed layout is cached per raw string.
let cache: { raw: string | null; layout: WidgetLayout } = { raw: null, layout: EMPTY }
const listeners = new Set<() => void>()

function getSnapshot(): WidgetLayout {
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (raw !== cache.raw) cache = { raw, layout: parse(raw) }
  return cache.layout
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (e: StorageEvent) => e.key === STORAGE_KEY && listener()
  window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", onStorage)
  }
}

function write(next: WidgetLayout) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  listeners.forEach((l) => l())
}

type SetLayout = (next: WidgetLayout | ((prev: WidgetLayout) => WidgetLayout)) => void

const setLayout: SetLayout = (next) => write(typeof next === "function" ? next(getSnapshot()) : next)

/** The saved layout (empty on the server and until the client has read it) and its setter. */
function useWidgetLayout() {
  const layout = React.useSyncExternalStore(subscribe, getSnapshot, () => EMPTY)
  return [layout, setLayout] as const
}

/** False on the server and the first client render, true after: gate anything that depends on localStorage. */
function useHydrated() {
  return React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}

const addWidget = (layout: WidgetLayout, type: string): WidgetLayout => [...layout, { id: uid(), type }]

/** Copies a widget right after the original. */
function duplicateWidget(layout: WidgetLayout, itemId: string): WidgetLayout {
  const index = layout.findIndex((i) => i.id === itemId)
  if (index === -1) return layout
  const next = [...layout]
  next.splice(index + 1, 0, { id: uid(), type: layout[index].type })
  return next
}

const removeWidget = (layout: WidgetLayout, itemId: string): WidgetLayout => layout.filter((i) => i.id !== itemId)

export { addWidget, duplicateWidget, removeWidget, useHydrated, useWidgetLayout }
export type { SetLayout, WidgetItem, WidgetLayout }
