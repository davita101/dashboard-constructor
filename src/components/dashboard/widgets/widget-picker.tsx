"use client"

import dynamic from "next/dynamic"
import * as React from "react"

import { addWidget, useWidgetLayout, type SetLayout, type WidgetLayout } from "@/components/dashboard/widgets/widget-layout"

// The dialog pulls in the whole widget catalog (recharts, tables). Load it on first open, not with every dashboard page.
const WidgetPickerDialog = dynamic(() => import("@/components/dashboard/widgets/widget-picker-dialog").then((m) => m.WidgetPickerDialog), { ssr: false })

type WidgetPickerValue = {
  /** Opens the widget picker. */
  open: () => void
  layout: WidgetLayout
  setLayout: SetLayout
  /** Customize mode: widgets can be dragged and removed. */
  customizing: boolean
  setCustomizing: (on: boolean) => void
}

const WidgetPickerContext = React.createContext<WidgetPickerValue | null>(null)

function useWidgetPicker() {
  const ctx = React.useContext(WidgetPickerContext)
  if (!ctx) throw new Error("useWidgetPicker must be used inside WidgetPickerProvider")
  return ctx
}

function WidgetPickerProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const [customizing, setCustomizing] = React.useState(false)
  const [everOpened, setEverOpened] = React.useState(false)
  // Adjust state while rendering (no effect): once opened, the dialog stays mounted.
  if (open && !everOpened) setEverOpened(true)
  const [layout, setLayout] = useWidgetLayout()

  // ⌘K / Ctrl+K opens the picker from anywhere (the navbar search shows the hint).
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const add = (type: string) => {
    setLayout((prev) => addWidget(prev, type))
    setOpen(false)
  }

  const value = React.useMemo(() => ({ open: () => setOpen(true), layout, setLayout, customizing, setCustomizing }), [layout, setLayout, customizing])

  return (
    <WidgetPickerContext.Provider value={value}>
      {children}
      {everOpened ? <WidgetPickerDialog open={open} onOpenChange={setOpen} onAdd={add} /> : null}
    </WidgetPickerContext.Provider>
  )
}

export { WidgetPickerProvider, useWidgetPicker }
