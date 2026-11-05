"use client"

import * as React from "react"

// The dashboard layout, saved in localStorage: rows of columns of widgets.
//   row    = one horizontal band (columns sit side by side)
//   column = a vertical stack, so a tall chart can sit beside two small cards stacked in a second column
// Dragging moves a widget into a stack, beside a column, or into a brand new row.

type WidgetItem = { id: string; type: string }
type WidgetColumn = { id: string; items: WidgetItem[] }
type WidgetRow = { id: string; columns: WidgetColumn[] }
type WidgetLayout = WidgetRow[]

const STORAGE_KEY = "dashboard-widget-layout"
/** The dashboard column is 1128 wide with 24 between widgets (Figma Main 1600). */
const ROW_WIDTH = 1128
const GAP = 24

const EMPTY: WidgetLayout = []

const uid = () => Math.random().toString(36).slice(2, 10)

const isItem = (item: unknown): item is WidgetItem =>
  !!item && typeof (item as WidgetItem).id === "string" && typeof (item as WidgetItem).type === "string"

function parseColumn(column: unknown): WidgetColumn | null {
  const c = column as WidgetColumn
  if (!c || typeof c.id !== "string" || !Array.isArray(c.items)) return null
  const items = c.items.filter(isItem)
  return items.length ? { id: c.id, items } : null
}

function parse(raw: string | null): WidgetLayout {
  if (!raw) return EMPTY
  try {
    const data: unknown = JSON.parse(raw)
    if (!Array.isArray(data)) return EMPTY
    const rows: WidgetLayout = []
    for (const row of data) {
      if (!row || typeof row.id !== "string") continue
      // Older saves were rows of items: every item becomes a one-widget column.
      const columns: WidgetColumn[] = Array.isArray(row.columns)
        ? row.columns.map(parseColumn).filter((c: WidgetColumn | null): c is WidgetColumn => c !== null)
        : Array.isArray(row.items)
          ? row.items.filter(isItem).map((item: WidgetItem) => ({ id: uid(), items: [item] }))
          : []
      if (columns.length) rows.push({ id: row.id, columns })
    }
    return rows
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

/* ------------------------------ sizing ------------------------------ */

type WidgetSizing = {
  isFull: (type: string) => boolean
  widthOf: (type: string) => number
  heightOf: (type: string) => number
}

const itemWidth = (item: WidgetItem, s: WidgetSizing) => (s.isFull(item.type) ? ROW_WIDTH : s.widthOf(item.type))
const columnWidth = (col: WidgetColumn, s: WidgetSizing) => Math.max(...col.items.map((i) => itemWidth(i, s)))
const columnHeight = (col: WidgetColumn, s: WidgetSizing) => col.items.reduce((sum, i) => sum + s.heightOf(i.type), 0) + GAP * (col.items.length - 1)
const rowWidth = (columns: WidgetColumn[], s: WidgetSizing) => columns.reduce((sum, c) => sum + columnWidth(c, s), 0) + GAP * (columns.length - 1)
const rowHeight = (row: WidgetRow, s: WidgetSizing) => Math.max(...row.columns.map((c) => columnHeight(c, s)))
const hasFull = (row: WidgetRow, s: WidgetSizing) => row.columns.some((c) => c.items.some((i) => s.isFull(i.type)))

const newColumn = (item: WidgetItem): WidgetColumn => ({ id: uid(), items: [item] })
const newRow = (item: WidgetItem): WidgetRow => ({ id: uid(), columns: [newColumn(item)] })

/**
 * Where a new widget goes inside `row`, or null when it does not fit:
 * stacked under a column while that stays within the row's height (a small card beside a tall chart),
 * otherwise as a new column if the width allows.
 */
function placeInRow(row: WidgetRow, item: WidgetItem, s: WidgetSizing): WidgetRow | null {
  if (s.isFull(item.type) || hasFull(row, s)) return null
  const height = rowHeight(row, s)
  const width = itemWidth(item, s)
  const stack = row.columns.findIndex((c) => columnWidth(c, s) >= width && columnHeight(c, s) + GAP + s.heightOf(item.type) <= height)
  if (stack !== -1) return { ...row, columns: row.columns.map((c, i) => (i === stack ? { ...c, items: [...c.items, item] } : c)) }
  if (rowWidth(row.columns, s) + GAP + width <= ROW_WIDTH) return { ...row, columns: [...row.columns, newColumn(item)] }
  return null
}

/** Appends a widget: into the last row when it fits (stacked or as a column), otherwise as a new row. */
function addWidget(layout: WidgetLayout, type: string, s: WidgetSizing): WidgetLayout {
  const item: WidgetItem = { id: uid(), type }
  const last = layout.at(-1)
  const placed = last && placeInRow(last, item, s)
  if (placed) return [...layout.slice(0, -1), placed]
  return [...layout, newRow(item)]
}

/** Copies a widget next to the original: stacked under it, else a column beside it, else a new row below. */
function duplicateWidget(layout: WidgetLayout, itemId: string, s: WidgetSizing): WidgetLayout {
  const r = layout.findIndex((row) => row.columns.some((c) => c.items.some((i) => i.id === itemId)))
  if (r === -1) return layout
  const row = layout[r]
  const c = row.columns.findIndex((col) => col.items.some((i) => i.id === itemId))
  const index = row.columns[c].items.findIndex((i) => i.id === itemId)
  const copy: WidgetItem = { id: uid(), type: row.columns[c].items[index].type }
  if (!s.isFull(copy.type) && !hasFull(row, s)) {
    const column = row.columns[c]
    if (columnHeight(column, s) + GAP + s.heightOf(copy.type) <= rowHeight(row, s)) {
      const items = [...column.items]
      items.splice(index + 1, 0, copy)
      return layout.map((x, i) => (i === r ? { ...row, columns: row.columns.map((col, j) => (j === c ? { ...col, items } : col)) } : x))
    }
    if (rowWidth(row.columns, s) + GAP + itemWidth(copy, s) <= ROW_WIDTH) {
      const columns = [...row.columns]
      columns.splice(c + 1, 0, newColumn(copy))
      return layout.map((x, i) => (i === r ? { ...row, columns } : x))
    }
  }
  const next = [...layout]
  next.splice(r + 1, 0, newRow(copy))
  return next
}

/** Drops empty columns, then empty rows. */
const pruneRows = (layout: WidgetLayout): WidgetLayout =>
  layout.map((row) => ({ ...row, columns: row.columns.filter((c) => c.items.length > 0) })).filter((row) => row.columns.length > 0)

function removeWidget(layout: WidgetLayout, itemId: string): WidgetLayout {
  return pruneRows(layout.map((row) => ({ ...row, columns: row.columns.map((c) => ({ ...c, items: c.items.filter((i) => i.id !== itemId) })) })))
}

const newRowId = uid
const newColumnId = uid

/**
 * After a drop: columns that no longer fit their row's width spill down, joining the next row when it has room
 * and starting a new row otherwise (full-width widgets always count as a whole row).
 */
function reflowRows(layout: WidgetLayout, s: WidgetSizing): WidgetLayout {
  const work = [...layout]
  for (let i = 0; i < work.length; i++) {
    const row = work[i]
    let fit = 0
    let used = 0
    for (const column of row.columns) {
      const next = used + (fit > 0 ? GAP : 0) + columnWidth(column, s)
      if (fit > 0 && next > ROW_WIDTH) break
      used = next
      fit++
    }
    if (fit === row.columns.length) continue
    const overflow = row.columns.slice(fit)
    work[i] = { ...row, columns: row.columns.slice(0, fit) }
    const following = work[i + 1]
    if (following && !hasFull(following, s) && rowWidth([...overflow, ...following.columns], s) <= ROW_WIDTH)
      work[i + 1] = { ...following, columns: [...overflow, ...following.columns] }
    else work.splice(i + 1, 0, { id: uid(), columns: overflow })
  }
  return work
}

export { addWidget, duplicateWidget, hasFull, newColumn, newColumnId, newRowId, pruneRows, reflowRows, removeWidget, useHydrated, useWidgetLayout }
export type { SetLayout, WidgetColumn, WidgetItem, WidgetLayout, WidgetRow, WidgetSizing }
