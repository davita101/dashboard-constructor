"use client"

import * as React from "react"

// The dashboard layout: rows of widgets, saved in localStorage. A row is a flex-wrap line, so "columns"
// are the items in it; dragging moves an item between rows or into a brand new row.

type WidgetItem = { id: string; type: string }
type WidgetRow = { id: string; items: WidgetItem[] }
type WidgetLayout = WidgetRow[]

const STORAGE_KEY = "dashboard-widget-layout"
/** A new widget joins the last row until it holds this many; the user can drag more in. */
const MAX_PER_ROW = 3

const EMPTY: WidgetLayout = []

const uid = () => Math.random().toString(36).slice(2, 10)

function parse(raw: string | null): WidgetLayout {
  if (!raw) return EMPTY
  try {
    const data: unknown = JSON.parse(raw)
    if (!Array.isArray(data)) return EMPTY
    return data
      .filter((row): row is WidgetRow => !!row && typeof row.id === "string" && Array.isArray(row.items))
      .map((row) => ({
        id: row.id,
        items: row.items.filter((item) => item && typeof item.id === "string" && typeof item.type === "string"),
      }))
      .filter((row) => row.items.length > 0)
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

/** Appends a widget: full-width widgets get their own row, others join the last row while it has room. */
function addWidget(layout: WidgetLayout, type: string, isFull: (type: string) => boolean): WidgetLayout {
  const item: WidgetItem = { id: uid(), type }
  const last = layout.at(-1)
  const fits = last && !isFull(type) && last.items.length < MAX_PER_ROW && !last.items.some((i) => isFull(i.type))
  if (fits) return [...layout.slice(0, -1), { ...last, items: [...last.items, item] }]
  return [...layout, { id: uid(), items: [item] }]
}

function removeWidget(layout: WidgetLayout, itemId: string): WidgetLayout {
  return layout.map((row) => ({ ...row, items: row.items.filter((i) => i.id !== itemId) })).filter((row) => row.items.length > 0)
}

const pruneRows = (layout: WidgetLayout): WidgetLayout => layout.filter((row) => row.items.length > 0)

const newRowId = uid

export { addWidget, newRowId, pruneRows, removeWidget, useHydrated, useWidgetLayout }
export type { SetLayout, WidgetItem, WidgetLayout, WidgetRow }
