"use client"

import { useTranslations } from "next-intl"
import * as React from "react"

import { addWidget, useWidgetLayout, type SetLayout, type WidgetLayout } from "@/components/dashboard/widgets/widget-layout"
import { widgetCatalog, widgetCategories, widgetSizing, type WidgetCategory, type WidgetDef } from "@/components/dashboard/widgets/catalog"
import { Button, ButtonIcon } from "@/components/ui/button"
import {
  Command,
  CommandCategory,
  CommandContent,
  CommandFooter,
  CommandHint,
  CommandItem,
  CommandItemDescription,
  CommandItemLeading,
  CommandItemMain,
  CommandItemName,
  CommandItemText,
  CommandList,
  CommandPreview,
  CommandSearch,
  CommandSearchAddon,
  CommandSearchInput,
  CommandSplit,
  CommandTabs,
} from "@/components/ui/command"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { InputGroupIcon, InputGroupKbd } from "@/components/ui/input-group"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Filter = "all" | WidgetCategory
type ItemKey = Parameters<ReturnType<typeof useTranslations<"widgets">>>[0]

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
    setLayout((prev) => addWidget(prev, type, widgetSizing))
    setOpen(false)
  }

  const value = React.useMemo(() => ({ open: () => setOpen(true), layout, setLayout, customizing, setCustomizing }), [layout, setLayout, customizing])

  return (
    <WidgetPickerContext.Provider value={value}>
      {children}
      <WidgetPickerDialog open={open} onOpenChange={setOpen} onAdd={add} />
    </WidgetPickerContext.Provider>
  )
}

function WidgetPickerDialog({ open, onOpenChange, onAdd }: { open: boolean; onOpenChange: (open: boolean) => void; onAdd: (id: string) => void }) {
  const t = useTranslations("widgets")
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" className="w-220 max-w-[calc(100vw-2rem)] rounded-none bg-transparent shadow-none" aria-describedby={undefined}>
        <DialogTitle className="sr-only">{t("title")}</DialogTitle>
        {/* Mounted only while open, so search, tab and highlight start fresh every time. */}
        <WidgetPickerBody onAdd={onAdd} />
      </DialogContent>
    </Dialog>
  )
}

function WidgetPickerBody({ onAdd }: { onAdd: (id: string) => void }) {
  const t = useTranslations("widgets")
  const name = (id: string) => t(`items.${id}.name` as ItemKey)
  const description = (id: string) => t(`items.${id}.description` as ItemKey)

  const [query, setQuery] = React.useState("")
  const [filter, setFilter] = React.useState<Filter>("all")
  const [activeId, setActiveId] = React.useState<string | null>(null)

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return widgetCatalog.filter((w) => {
      if (filter !== "all" && w.category !== filter) return false
      if (!q) return true
      return [name(w.id), description(w.id), t(`categories.${w.category}`), ...w.keywords].some((s) => s.toLowerCase().includes(q))
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filter, t])

  const active = results.find((w) => w.id === activeId) ?? results[0]

  // The previews are heavy (recharts measures after mount). Mount them after the open animation and
  // defer updates while arrowing through the list, so opening and navigating stay smooth.
  const [previewReady, setPreviewReady] = React.useState(false)
  React.useEffect(() => {
    const id = window.setTimeout(() => setPreviewReady(true), 150)
    return () => window.clearTimeout(id)
  }, [])
  const previewWidget = React.useDeferredValue(active)

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!results.length) return
    const index = results.findIndex((w) => w.id === active?.id)
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault()
      const next = (index + (e.key === "ArrowDown" ? 1 : -1) + results.length) % results.length
      setActiveId(results[next].id)
      document.getElementById(`widget-option-${results[next].id}`)?.scrollIntoView({ block: "nearest" })
    } else if (e.key === "Enter" && active) {
      e.preventDefault()
      onAdd(active.id)
    }
  }

  // Group by category in "All"; a single filtered category needs no group titles.
  const groups = (filter === "all" ? widgetCategories : [filter]).map((c) => ({ category: c, items: results.filter((w) => w.category === c) })).filter((g) => g.items.length)

  return (
    <>
        <Command layout="split" corner="rounded" className="h-160 max-h-[calc(100svh-2rem)] w-full" onKeyDown={onKeyDown}>
          <CommandContent>
            <CommandSearch>
              <CommandSearchAddon>
                <InputGroupIcon src="/icons/material-search.svg" />
              </CommandSearchAddon>
              <CommandSearchInput
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("search")}
                aria-label={t("search")}
              />
              <CommandSearchAddon align="inline-end">
                <InputGroupKbd size="20">Esc</InputGroupKbd>
              </CommandSearchAddon>
            </CommandSearch>
            <CommandTabs>
              <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
                <TabsList variant="pill" size="xs">
                  <TabsTrigger value="all">{t("categories.all")}</TabsTrigger>
                  {widgetCategories.map((c) => (
                    <TabsTrigger key={c} value={c}>
                      {t(`categories.${c}`)}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </CommandTabs>
            <CommandSplit>
              <CommandList className="w-full flex-none sm:w-75" aria-label={t("title")}>
                {groups.length === 0 && <p className="px-3 py-6 text-center text-10 leading-16 font-semibold text-base-500">{t("empty", { query })}</p>}
                {groups.map((g) => (
                  <div key={g.category} className="flex flex-col gap-1">
                    {filter === "all" && <CommandCategory title={t(`categories.${g.category}`)} count={g.items.length} action={null} />}
                    {g.items.map((w) => (
                      <WidgetRow
                        key={w.id}
                        widget={w}
                        name={name(w.id)}
                        description={description(w.id)}
                        selected={w.id === active?.id}
                        onHover={() => setActiveId(w.id)}
                        onAdd={() => onAdd(w.id)}
                      />
                    ))}
                  </div>
                ))}
              </CommandList>
              {active && (
                <CommandPreview className="hidden w-auto min-w-0 flex-1 gap-3 bg-background-20/50 sm:flex">
                  <div className="flex flex-col gap-1">
                    <p className="text-12 leading-20 font-bold text-base-800">{name(active.id)}</p>
                    <p className="text-10 leading-16 font-semibold text-base-500">{description(active.id)}</p>
                  </div>
                  {/* Real component, shrunk to fit the pane. */}
                  <div aria-hidden className="relative min-h-0 flex-1 overflow-hidden rounded-r8 bg-background-20 outline -outline-offset-1 outline-base-100">
                    {previewReady && previewWidget && <FitPreview key={previewWidget.id}>{previewWidget.preview}</FitPreview>}
                  </div>
                  <Button variant="dark" size="32" shape="rounded" onClick={() => onAdd(active.id)}>
                    <ButtonIcon src="/icons/material-add-circle.svg" />
                    {t("add")}
                  </Button>
                </CommandPreview>
              )}
            </CommandSplit>
          </CommandContent>
          <CommandFooter>
            <CommandHint keys={["↵"]}>{t("hintAdd")}</CommandHint>
            <CommandHint keys={["↓"]}>{t("hintNavigate")}</CommandHint>
            <CommandHint keys={["Esc"]}>{t("hintClose")}</CommandHint>
          </CommandFooter>
        </Command>
    </>
  )
}

/** Scales its child down (never up) so the whole widget fits the pane, whatever its size. Centered. */
function FitPreview({ children }: { children: React.ReactNode }) {
  const frame = React.useRef<HTMLDivElement>(null)
  const inner = React.useRef<HTMLDivElement>(null)
  const [scale, setScale] = React.useState<number | null>(null)

  React.useLayoutEffect(() => {
    const fit = () => {
      const f = frame.current
      const i = inner.current
      if (!f || !i) return
      // offsetWidth/Height ignore transforms, so this is the widget's natural size.
      setScale(Math.min(1, f.clientWidth / i.offsetWidth, f.clientHeight / i.offsetHeight))
    }
    fit()
    const observer = new ResizeObserver(fit)
    if (frame.current) observer.observe(frame.current)
    if (inner.current) observer.observe(inner.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="absolute inset-0 p-3">
      <div ref={frame} className="relative size-full">
        <div
          ref={inner}
          className="pointer-events-none absolute top-1/2 left-1/2 w-max transition-opacity duration-200"
          style={{ transform: `translate(-50%, -50%) scale(${scale ?? 1})`, opacity: scale === null ? 0 : 1 }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

function WidgetRow({
  widget,
  name,
  description,
  selected,
  onHover,
  onAdd,
}: {
  widget: WidgetDef
  name: string
  description: string
  selected: boolean
  onHover: () => void
  onAdd: () => void
}) {
  return (
    <CommandItem
      id={`widget-option-${widget.id}`}
      lines="2"
      selected={selected}
      onMouseMove={selected ? undefined : onHover}
      onClick={onAdd}
      className="cursor-pointer"
    >
      <CommandItemMain>
        <CommandItemLeading>
          <InputGroupIcon src={widget.icon} className="size-4" />
        </CommandItemLeading>
        <CommandItemText>
          <CommandItemName>{name}</CommandItemName>
          <CommandItemDescription>{description}</CommandItemDescription>
        </CommandItemText>
      </CommandItemMain>
    </CommandItem>
  )
}

export { WidgetPickerProvider, useWidgetPicker }
