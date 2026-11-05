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
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useTranslations } from "next-intl"
import * as React from "react"

import { getWidget, isFullWidget, widgetSizing } from "@/components/dashboard/widgets/catalog"
import {
  duplicateWidget,
  hasFull,
  newColumn,
  newRowId,
  pruneRows,
  reflowRows,
  removeWidget,
  useHydrated,
  type WidgetColumn,
  type WidgetItem,
  type WidgetLayout,
  type WidgetRow,
} from "@/components/dashboard/widgets/widget-layout"
import { useWidgetPicker } from "@/components/dashboard/widgets/widget-picker"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Button, ButtonIcon } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyIcon, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { cn } from "@/lib/utils"

type ItemKey = Parameters<ReturnType<typeof useTranslations<"widgets">>>[0]

// Droppable ids: widgets use their own id; the rest are prefixed.
const COL = "col:" // a column's free space: append to its stack
const ROW = "row:" // a row's free space: append a new column
const NEW_COL = "ncol:" // `ncol:<row>:<index>`: a thin strip between columns, starts a new column there
const NEW_ROW = "new:" // `new:<index>`: a strip between rows, starts a new row there

type Spot = { r: number; c: number; i: number }

/** Finds a widget (or a column / row container) in the layout. `c` is -1 for a row, `i` is the stack end for a column. */
function locate(layout: WidgetLayout, id: string): Spot | null {
  for (let r = 0; r < layout.length; r++) {
    if (id === ROW + layout[r].id) return { r, c: -1, i: 0 }
    for (let c = 0; c < layout[r].columns.length; c++) {
      const column = layout[r].columns[c]
      if (id === COL + column.id) return { r, c, i: column.items.length }
      const i = column.items.findIndex((item) => item.id === id)
      if (i !== -1) return { r, c, i }
    }
  }
  return null
}

/** Prefer the widget under the pointer over the column / row that holds it, fall back to the nearest target. */
const collisionDetection: CollisionDetection = (args) => {
  const hits = pointerWithin(args)
  const specific = hits.filter((h) => !String(h.id).startsWith(ROW) && !String(h.id).startsWith(COL))
  if (specific.length) return specific
  return hits.length ? hits : closestCenter(args)
}

/** Full-width widgets live alone in their row; nothing else may join a row that has one. */
function rowAccepts(row: WidgetRow, item: WidgetItem) {
  if (isFullWidget(item.type)) return row.columns.every((c) => c.items.every((i) => i.id === item.id))
  return !hasFull(row, widgetSizing)
}

const without = (layout: WidgetLayout, itemId: string): WidgetLayout =>
  layout.map((row) => ({ ...row, columns: row.columns.map((c) => ({ ...c, items: c.items.filter((i) => i.id !== itemId) })) }))

function WidgetBoard() {
  const t = useTranslations("widgets")
  const { layout, setLayout, customizing, open } = useWidgetPicker()
  const hydrated = useHydrated()
  // While dragging we edit a draft; it becomes the saved layout on drop.
  const [draft, setDraft] = React.useState<WidgetLayout | null>(null)
  const [activeId, setActiveId] = React.useState<string | null>(null)
  // The layout before the last delete: "Undo" restores it. Clears itself after a few seconds.
  const [undo, setUndo] = React.useState<{ layout: WidgetLayout; label: string } | null>(null)

  React.useEffect(() => {
    if (!undo) return
    const id = window.setTimeout(() => setUndo(null), 6000)
    return () => window.clearTimeout(id)
  }, [undo])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  if (!hydrated) return null

  const rows = draft ?? layout
  const active = activeId ? rows.flatMap((r) => r.columns.flatMap((c) => c.items)).find((i) => i.id === activeId) : undefined

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

  // Dragging over another stack moves the widget there live, so everything makes room as you go.
  const onDragOver = ({ active, over }: DragOverEvent) => {
    if (!over || !draft) return
    const overId = String(over.id)
    if (overId.startsWith(NEW_ROW) || overId.startsWith(NEW_COL)) return
    const from = locate(draft, String(active.id))
    const to = locate(draft, overId)
    if (!from || !to || to.c === -1) return
    if (from.r === to.r && from.c === to.c) return
    const item = draft[from.r].columns[from.c].items[from.i]
    if (!rowAccepts(draft[to.r], item)) return
    const base = without(draft, item.id)
    setDraft(
      base.map((row, r) =>
        r !== to.r
          ? row
          : {
              ...row,
              columns: row.columns.map((column, c) => {
                if (c !== to.c) return column
                const items = [...column.items]
                items.splice(Math.min(to.i, items.length), 0, item)
                return { ...column, items }
              }),
            }
      )
    )
  }

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    let next = draft ?? layout
    const from = locate(next, String(active.id))
    if (over && from) {
      const overId = String(over.id)
      const item = next[from.r].columns[from.c].items[from.i]
      if (overId.startsWith(NEW_ROW)) {
        const base = without(next, item.id)
        base.splice(Number(overId.slice(NEW_ROW.length)), 0, { id: newRowId(), columns: [newColumn(item)] })
        next = base
      } else if (overId.startsWith(NEW_COL)) {
        const [r, c] = overId.slice(NEW_COL.length).split(":").map(Number)
        if (rowAccepts(next[r], item)) {
          const base = without(next, item.id)
          const columns = [...base[r].columns]
          columns.splice(c, 0, newColumn(item))
          next = base.map((row, i) => (i === r ? { ...row, columns } : row))
        }
      } else if (overId.startsWith(ROW)) {
        const to = locate(next, overId)
        if (to && rowAccepts(next[to.r], item)) {
          const base = without(next, item.id)
          next = base.map((row, i) => (i === to.r ? { ...row, columns: [...row.columns, newColumn(item)] } : row))
        }
      } else {
        const to = locate(next, overId)
        if (to && to.r === from.r && to.c === from.c && to.i !== from.i) {
          next = next.map((row, r) =>
            r !== from.r ? row : { ...row, columns: row.columns.map((col, c) => (c !== from.c ? col : { ...col, items: arrayMove(col.items, from.i, to.i) })) }
          )
        }
      }
    }
    setLayout(reflowRows(pruneRows(next), widgetSizing))
    clear()
  }

  const dragging = activeId !== null

  const remove = (item: WidgetItem) => {
    setUndo({ layout, label: t(`items.${item.type}.name` as ItemKey) })
    setLayout((prev) => removeWidget(prev, item.id))
  }

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
          {rows.map((row, r) => {
            const full = hasFull(row, widgetSizing)
            return (
              <React.Fragment key={row.id}>
                <BoardRow id={row.id} customizing={customizing}>
                  {customizing && !full && <NewColumnZone row={r} index={0} dragging={dragging} />}
                  {row.columns.map((column, c) => (
                    <React.Fragment key={column.id}>
                      <BoardColumn column={column} customizing={customizing}>
                        {column.items.map((item) => (
                          <BoardWidget
                            key={item.id}
                            item={item}
                            customizing={customizing}
                            onRemove={() => remove(item)}
                            onDuplicate={() => setLayout((prev) => duplicateWidget(prev, item.id, widgetSizing))}
                          />
                        ))}
                      </BoardColumn>
                      {customizing && !full && <NewColumnZone row={r} index={c + 1} dragging={dragging} />}
                    </React.Fragment>
                  ))}
                </BoardRow>
                {customizing && <NewRowZone index={r + 1} dragging={dragging} label={t("newRow")} />}
              </React.Fragment>
            )
          })}
        </div>
        <DragOverlay>{active ? <WidgetFrame item={active} customizing overlay /> : null}</DragOverlay>
      </DndContext>
      {undo && (
        <Alert layout="toast" variant="black" className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 pr-1 shadow-[0_16px_32px_0_var(--shadow-base)]">
          <AlertTitle>{t("removed", { name: undo.label })}</AlertTitle>
          <Button
            variant="white"
            shape="pill"
            size="24"
            onClick={() => {
              setLayout(undo.layout)
              setUndo(null)
            }}
          >
            {t("undo")}
          </Button>
        </Alert>
      )}
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
        "flex flex-wrap items-start transition-colors",
        // While customizing, the thin drop strips between columns take the place of the gap.
        !customizing && "gap-6",
        customizing && "-m-2 min-h-16 rounded-r20 p-2 outline -outline-offset-1 outline-dashed outline-base-150",
        customizing && isOver && "bg-primary-alpha-5 outline-primary-alpha-30"
      )}
    >
      {children}
    </div>
  )
}

/** A vertical stack of widgets: a tall chart in one column, two small cards stacked in the next. */
function BoardColumn({ column, customizing, children }: { column: WidgetColumn; customizing: boolean; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: COL + column.id })
  const full = column.items.some((i) => isFullWidget(i.type))
  return (
    <SortableContext items={column.items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
      <div
        ref={setNodeRef}
        data-slot="widget-column"
        className={cn("flex min-w-0 flex-col gap-6 rounded-r20 transition-colors", full && "w-full", customizing && isOver && "bg-primary-alpha-5")}
      >
        {children}
      </div>
    </SortableContext>
  )
}

function BoardWidget({ item, customizing, onRemove, onDuplicate }: { item: WidgetItem; customizing: boolean; onRemove: () => void; onDuplicate: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id, disabled: !customizing })
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} className={cn("min-w-0", isFullWidget(item.type) && "w-full")}>
      <WidgetFrame
        item={item}
        customizing={customizing}
        handleProps={{ ...attributes, ...listeners }}
        placeholder={isDragging}
        onRemove={onRemove}
        onDuplicate={onDuplicate}
      />
    </div>
  )
}

function WidgetFrame({
  item,
  customizing,
  overlay,
  placeholder,
  handleProps,
  onRemove,
  onDuplicate,
}: {
  item: WidgetItem
  customizing: boolean
  overlay?: boolean
  /** The slot the dragged widget leaves behind: same size, content hidden, tinted so the drop spot reads clearly. */
  placeholder?: boolean
  handleProps?: React.HTMLAttributes<HTMLElement>
  onRemove?: () => void
  onDuplicate?: () => void
}) {
  const t = useTranslations("widgets")
  const label = t(`items.${item.type}.name` as ItemKey)
  const def = getWidget(item.type)
  if (!def) return null
  return (
    <div
      className={cn(
        "group/widget relative",
        isFullWidget(item.type) && "w-full",
        overlay && "scale-[1.02] cursor-grabbing rounded-r20 opacity-95 shadow-[0_24px_48px_0_var(--shadow-base)] ring-2 ring-primary-alpha-30"
      )}
    >
      {/* Inert while customizing, so dragging never triggers the widget's own controls. */}
      <div inert={customizing || undefined} className={cn(customizing && "select-none", placeholder && "invisible")}>
        {def.board ?? def.preview}
      </div>
      {placeholder && <div aria-hidden className="absolute inset-0 rounded-r20 bg-primary-alpha-5 outline -outline-offset-1 outline-dashed outline-primary-alpha-30" />}
      {customizing && !placeholder && (
        <>
          {/* Pointer drag from anywhere on the widget; the handle button below is the keyboard / screen-reader control. */}
          <div
            aria-hidden
            onPointerDown={handleProps?.onPointerDown as React.PointerEventHandler<HTMLDivElement> | undefined}
            className={cn(
              "absolute inset-0 rounded-r20 outline -outline-offset-1 outline-dashed outline-base-300 transition-colors",
              !overlay && "cursor-grab hover:bg-base-alpha-5 hover:outline-primary-alpha-30"
            )}
          />
          {!overlay && (
            <div className="absolute -top-3 right-4 flex items-center gap-1 rounded-full bg-background-0 p-0.5 shadow-[0_2px_8px_0_var(--shadow-base)] outline -outline-offset-1 outline-base-100">
              <Button variant="outline" shape="pill" size="icon-24" aria-label={t("move", { name: label })} className="cursor-grab touch-none" {...handleProps}>
                <ButtonIcon src="/icons/material-zoom-out-map.svg" />
              </Button>
              <Button
                variant="outline"
                shape="pill"
                size="icon-24"
                aria-label={t("duplicate", { name: label })}
                onPointerDown={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                onClick={onDuplicate}
              >
                <ButtonIcon src="/icons/material-file_copy.svg" />
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

/** A thin drop strip between rows (and above / below all of them): dropping here starts a new row. */
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

/** A thin vertical strip between columns: dropping here puts the widget in a new column at that spot. */
function NewColumnZone({ row, index, dragging }: { row: number; index: number; dragging: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id: `${NEW_COL}${row}:${index}` })
  return (
    <div
      ref={setNodeRef}
      aria-hidden
      className={cn(
        "min-h-16 w-6 shrink-0 self-stretch rounded-r8 transition-opacity",
        dragging ? "opacity-100" : "opacity-0",
        dragging && "outline -outline-offset-1 outline-dashed outline-base-200",
        isOver && "bg-primary-alpha-10 outline-primary-alpha-30"
      )}
    />
  )
}

export { WidgetBoard }
