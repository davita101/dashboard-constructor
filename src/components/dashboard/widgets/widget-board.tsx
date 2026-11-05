"use client"

import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  useDroppable,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import { arrayMove, rectSortingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useTranslations } from "next-intl"
import * as React from "react"

import { getWidget, isFullWidget } from "@/components/dashboard/widgets/catalog"
import { newRowId, pruneRows, removeWidget, useHydrated, type WidgetItem, type WidgetLayout } from "@/components/dashboard/widgets/widget-layout"
import { useWidgetPicker } from "@/components/dashboard/widgets/widget-picker"
import { Button, ButtonIcon } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyIcon, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { cn } from "@/lib/utils"

type ItemKey = Parameters<ReturnType<typeof useTranslations<"widgets">>>[0]

const ROW = "row:"
const NEW_ROW = "new:"

const rowIndexOf = (layout: WidgetLayout, id: string) =>
  id.startsWith(ROW) ? layout.findIndex((r) => ROW + r.id === id) : layout.findIndex((r) => r.items.some((i) => i.id === id))

/** Prefer the widget under the pointer over its row, fall back to the nearest target. */
const collisionDetection: CollisionDetection = (args) => {
  const hits = pointerWithin(args)
  const items = hits.filter((h) => !String(h.id).startsWith(ROW))
  if (items.length) return items
  return hits.length ? hits : closestCenter(args)
}

/** A row can take `item` unless a full-width widget is involved (those never share a row). */
const rowAccepts = (layout: WidgetLayout, rowIndex: number, item: WidgetItem) => {
  const items = layout[rowIndex]?.items ?? []
  return !items.some((i) => isFullWidget(i.type)) && !(isFullWidget(item.type) && items.length > 0)
}

function WidgetBoard() {
  const t = useTranslations("widgets")
  const { layout, setLayout, customizing, open } = useWidgetPicker()
  const hydrated = useHydrated()
  // While dragging we edit a draft; it becomes the saved layout on drop.
  const [draft, setDraft] = React.useState<WidgetLayout | null>(null)
  const [activeId, setActiveId] = React.useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  if (!hydrated) return null

  const rows = draft ?? layout
  const active = activeId ? rows.flatMap((r) => r.items).find((i) => i.id === activeId) : undefined

  if (rows.length === 0)
    return (
      <Empty className="py-32">
        <EmptyHeader>
          <EmptyMedia>
            <EmptyIcon src="/icons/material-dashboard.svg" />
          </EmptyMedia>
          <EmptyTitle>{t("emptyTitle")}</EmptyTitle>
          <EmptyDescription>{t("emptyDescription")}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="dark" shape="pill" size="32" onClick={open}>
            <ButtonIcon src="/icons/material-add-circle.svg" />
            {t("add")}
          </Button>
        </EmptyContent>
      </Empty>
    )

  const clear = () => {
    setDraft(null)
    setActiveId(null)
  }

  const onDragStart = ({ active }: DragStartEvent) => {
    setActiveId(String(active.id))
    setDraft(layout)
  }

  // Dragging over another row moves the widget there live, so the rows make room as you go.
  const onDragOver = ({ active, over }: DragOverEvent) => {
    if (!over || !draft) return
    const overId = String(over.id)
    if (overId.startsWith(NEW_ROW)) return
    const from = rowIndexOf(draft, String(active.id))
    const to = rowIndexOf(draft, overId)
    if (from === -1 || to === -1 || from === to) return
    const item = draft[from].items.find((i) => i.id === active.id)!
    if (!rowAccepts(draft, to, item)) return
    const overIndex = overId.startsWith(ROW) ? draft[to].items.length : draft[to].items.findIndex((i) => i.id === overId)
    setDraft(
      draft.map((row, i) => {
        if (i === from) return { ...row, items: row.items.filter((x) => x.id !== item.id) }
        if (i === to) {
          const items = [...row.items]
          items.splice(overIndex === -1 ? items.length : overIndex, 0, item)
          return { ...row, items }
        }
        return row
      })
    )
  }

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    let next = draft ?? layout
    if (over) {
      const overId = String(over.id)
      const from = rowIndexOf(next, String(active.id))
      if (overId.startsWith(NEW_ROW) && from !== -1) {
        const item = next[from].items.find((i) => i.id === active.id)!
        const without = next.map((row, i) => (i === from ? { ...row, items: row.items.filter((x) => x.id !== item.id) } : row))
        const at = Number(overId.slice(NEW_ROW.length))
        without.splice(at, 0, { id: newRowId(), items: [item] })
        next = without
      } else if (from !== -1 && from === rowIndexOf(next, overId) && !overId.startsWith(ROW)) {
        const items = next[from].items
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === overId)
        if (oldIndex !== newIndex)
          next = next.map((row, i) => (i === from ? { ...row, items: arrayMove(row.items, oldIndex, newIndex) } : row))
      }
    }
    setLayout(pruneRows(next))
    clear()
  }

  const dragging = activeId !== null

  return (
    <div className="flex flex-col gap-4">
      {customizing && (
        <p role="status" className="flex items-center gap-2 text-10 leading-16 font-semibold text-base-500">
          <ButtonIcon src="/icons/material-zoom-out-map.svg" className="size-4" />
          {t("customizeHint")}
        </p>
      )}
      <DndContext
        id="widget-board"
        sensors={sensors}
        collisionDetection={collisionDetection}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        onDragCancel={clear}
      >
        <div className={cn("flex flex-col", !customizing && "gap-6")}>
          {customizing && <NewRowZone index={0} dragging={dragging} label={t("newRow")} />}
          {rows.map((row, index) => (
            <React.Fragment key={row.id}>
              <SortableContext items={row.items.map((i) => i.id)} strategy={rectSortingStrategy}>
                <BoardRow id={row.id} customizing={customizing}>
                  {row.items.map((item) => (
                    <BoardWidget key={item.id} item={item} customizing={customizing} onRemove={() => setLayout((prev) => removeWidget(prev, item.id))} />
                  ))}
                </BoardRow>
              </SortableContext>
              {customizing && <NewRowZone index={index + 1} dragging={dragging} label={t("newRow")} />}
            </React.Fragment>
          ))}
        </div>
        <DragOverlay>{active ? <WidgetFrame item={active} customizing overlay /> : null}</DragOverlay>
      </DndContext>
    </div>
  )
}

function BoardRow({ id, customizing, children }: { id: string; customizing: boolean; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: ROW + id })
  return (
    <div
      ref={setNodeRef}
      data-slot="widget-row"
      className={cn(
        "flex flex-wrap items-start gap-6 transition-colors",
        customizing && "-m-2 min-h-16 rounded-r20 p-2 outline -outline-offset-1 outline-dashed outline-base-150",
        customizing && isOver && "bg-primary-alpha-5 outline-primary-alpha-30"
      )}
    >
      {children}
    </div>
  )
}

function BoardWidget({ item, customizing, onRemove }: { item: WidgetItem; customizing: boolean; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id, disabled: !customizing })
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn("min-w-0", isFullWidget(item.type) && "w-full", isDragging && "opacity-30")}
    >
      <WidgetFrame
        item={item}
        customizing={customizing}
        handleProps={{ ...attributes, ...listeners }}
        onRemove={onRemove}
      />
    </div>
  )
}

function WidgetFrame({
  item,
  customizing,
  overlay,
  handleProps,
  onRemove,
}: {
  item: WidgetItem
  customizing: boolean
  overlay?: boolean
  handleProps?: React.HTMLAttributes<HTMLElement>
  onRemove?: () => void
}) {
  const t = useTranslations("widgets")
  const label = t(`items.${item.type}.name` as ItemKey)
  const def = getWidget(item.type)
  if (!def) return null
  return (
    <div className={cn("group/widget relative", isFullWidget(item.type) && "w-full", overlay && "cursor-grabbing opacity-95 shadow-[0_16px_32px_0_var(--shadow-base)]")}>
      {/* Inert while customizing, so dragging never triggers the widget's own controls. */}
      <div inert={customizing || undefined} className={cn(customizing && "select-none")}>
        {def.board ?? def.preview}
      </div>
      {customizing && (
        <>
          {/* Pointer drag from anywhere on the widget; the handle button below is the keyboard / screen-reader control. */}
          <div
            aria-hidden
            onPointerDown={handleProps?.onPointerDown as React.PointerEventHandler<HTMLDivElement> | undefined}
            className={cn("absolute inset-0 rounded-r20 outline -outline-offset-1 outline-dashed outline-base-300 transition-colors", !overlay && "cursor-grab hover:bg-base-alpha-5 hover:outline-primary-alpha-30")}
          />
          {!overlay && (
            <div className="absolute -top-3 right-4 flex items-center gap-1 rounded-full bg-background-0 p-0.5 shadow-[0_2px_8px_0_var(--shadow-base)] outline -outline-offset-1 outline-base-100">
              <Button
                variant="outline"
                shape="pill"
                size="icon-24"
                aria-label={t("move", { name: label })}
                className="cursor-grab touch-none"
                {...handleProps}
              >
                <ButtonIcon src="/icons/material-zoom-out-map.svg" />
              </Button>
              <Button
                variant="outline"
                shape="pill"
                size="icon-24"
                aria-label={t("remove", { name: label })}
                onPointerDown={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                onClick={onRemove}
              >
                <ButtonIcon src="/icons/material-delete.svg" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

/** A thin drop target between rows (and above / below all of them): dropping here starts a new row. */
function NewRowZone({ index, dragging, label }: { index: number; dragging: boolean; label: string }) {
  const { setNodeRef, isOver } = useDroppable({ id: NEW_ROW + index })
  return (
    <div
      ref={setNodeRef}
      aria-hidden
      className={cn(
        "flex h-6 items-center justify-center rounded-r8 text-9 leading-16 font-semibold text-base-500 transition-opacity",
        dragging ? "opacity-100" : "opacity-0",
        dragging && "outline -outline-offset-1 outline-dashed outline-base-200",
        isOver && "bg-primary-alpha-10 text-primary-600 outline-primary-alpha-30"
      )}
    >
      {dragging && label}
    </div>
  )
}

export { WidgetBoard }
