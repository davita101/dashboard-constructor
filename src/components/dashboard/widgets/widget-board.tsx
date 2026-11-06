"use client"

import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MeasuringStrategy,
  MouseSensor,
  TouchSensor,
  closestCenter,
  pointerWithin,
  useSensor,
  useSensors,
  type ClientRect,
  type CollisionDetection,
  type DragMoveEvent,
  type DragEndEvent,
  type DragStartEvent,
  type KeyboardCoordinateGetter,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, useSortable, type SortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useTranslations } from "next-intl"
import * as React from "react"

import { getWidget, widgetSize, type WidgetSize } from "@/components/dashboard/widgets/catalog"
import { duplicateWidget, removeWidget, useHydrated, type WidgetItem } from "@/components/dashboard/widgets/widget-layout"
import { WidgetFluid } from "@/components/dashboard/widgets/widget-fluid"
import { useWidgetPicker } from "@/components/dashboard/widgets/widget-picker"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Button, ButtonIcon } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyIcon, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { cn } from "@/lib/utils"

type ItemKey = Parameters<ReturnType<typeof useTranslations<"widgets">>>[0]

/**
 * Figma "Dashboard: Home". The board is the 1128 column split into 24 tracks of 24 with 24 gaps (span n = 48n - 24),
 * rows of at least 164: metric tiles 6 x 1 (264 x 164); charts 9 x 3 (408 x 540) beside a column of tiles
 * (Main 1600 "current section"), or 8 x 3 (360 x 540) three to a row when no tiles sit beside them (frame "EXAMPLE");
 * wide charts the whole row x 3. Dense flow stacks tiles beside the charts. Tables and strips take the whole row at their own height.
 * Container queries: from 576 (768 frames: 696 board, 632 beside our icon rail) 2 tracks, tiles one each, charts both; 360 frames are 1 track, 12 gap.
 */
// contain-size: fixed footprints never stretch their rows (a chart's content could push 540 to 569); only `full` sizes its row.
const SPAN: Record<WidgetSize, string> = {
  sm: "contain-size @xl:col-span-1 @5xl:col-span-6",
  md: "contain-size row-span-2 @xl:col-span-2",
  lg: "contain-size row-span-3 @xl:col-span-2",
  wide: "contain-size row-span-3 @xl:col-span-2 @5xl:col-span-24",
  full: "@xl:col-span-2 @5xl:col-span-24",
}

/**
 * Desktop placement: a chart is 9 tracks in a row with a tile column (2 charts + tiles), 8 in a row of 3 charts.
 * Tiles paired with charts are pinned to the last 6 tracks, so dense flow stacks them in the column beside the charts
 * even when they come first in the order (otherwise they would line up across a row of their own).
 */
const PLACE = { beside: "@5xl:col-span-9", third: "@5xl:col-span-8", tileColumn: "@5xl:col-start-19" }

const isChart = (size: WidgetSize) => size === "lg" || size === "md"

/**
 * Picks each widget's desktop placement. The board splits into sections at every whole-row widget; in a section, each run
 * of up to 3 tiles pairs with 2 charts (408 + 408 + 264 column), and the charts left over go 3 to a row (360 each).
 */
function placements(layout: WidgetItem[]): Map<string, string> {
  const spans = new Map<string, string>()
  const flush = (section: WidgetItem[]) => {
    const charts = section.filter((i) => isChart(widgetSize(i.type)))
    const tiles = section.filter((i) => !isChart(widgetSize(i.type)))
    const tileRows = Math.min(Math.ceil(tiles.length / 3), Math.ceil(charts.length / 2))
    charts.forEach((c, i) => spans.set(c.id, i < 2 * tileRows ? PLACE.beside : PLACE.third))
    tiles.slice(0, 3 * tileRows).forEach((tile) => spans.set(tile.id, PLACE.tileColumn))
  }
  let section: WidgetItem[] = []
  for (const item of layout) {
    const size = widgetSize(item.type)
    if (size === "wide" || size === "full") {
      flush(section)
      section = []
    } else section.push(item)
  }
  flush(section)
  return spans
}

/**
 * Widgets differ in size, so the stock sortable strategies (which slide and scale items into each other's rects)
 * distort them. Instead the order itself changes while dragging and the grid reflows; items glide to their new
 * cell through `animateLayoutChanges`, so the strategy adds no transform.
 */
const reflowStrategy: SortingStrategy = () => null

/** Pointer travel (px) needed between two swaps. */
const SWAP_TRAVEL = 16

const ARROWS = ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"]

/**
 * Arrow keys step to the nearest widget in that direction (by centers, sideways distance weighs double) and center
 * the dragged widget on it. dnd-kit's sortable getter compares edges and corners, which picks the wrong neighbor
 * when a tile sits beside a chart three times its height.
 */
const gridKeyboardCoordinates: KeyboardCoordinateGetter = (event, { context: { active, over, collisionRect, droppableRects }, currentCoordinates }) => {
  if (!ARROWS.includes(event.code) || !active || !collisionRect) return undefined
  event.preventDefault()
  const from = droppableRects.get(over?.id ?? active.id)
  if (!from) return undefined
  const center = (r: ClientRect) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
  const c = center(from)
  const axis = event.code === "ArrowRight" || event.code === "ArrowLeft" ? "x" : "y"
  const sign = event.code === "ArrowRight" || event.code === "ArrowDown" ? 1 : -1
  let best: { rect: ClientRect; score: number } | null = null
  for (const [, rect] of droppableRects) {
    if (rect === from) continue
    const t = center(rect)
    const along = (axis === "x" ? t.x - c.x : t.y - c.y) * sign
    if (along <= 1) continue
    const score = along + 2 * Math.abs(axis === "x" ? t.y - c.y : t.x - c.x)
    if (!best || score < best.score) best = { rect, score }
  }
  if (!best) return undefined
  const target = center(best.rect)
  const now = center(collisionRect)
  return { x: currentCoordinates.x + target.x - now.x, y: currentCoordinates.y + target.y - now.y }
}

// The pointer picks the target (big and small cells have far-apart centers); keyboard drags have no pointer.
const collision: CollisionDetection = (args) => (args.pointerCoordinates ? pointerWithin(args) : closestCenter(args))

function WidgetBoard() {
  const t = useTranslations("widgets")
  const { layout: saved, setLayout, customizing, open } = useWidgetPicker()
  // Saved layouts may still hold widgets that were removed from the catalog.
  const valid = saved.filter((i) => getWidget(i.type))
  const hydrated = useHydrated()
  const [activeId, setActiveId] = React.useState<string | null>(null)
  // The order while a drag is in progress: saved only on drop, thrown away on cancel.
  const [draft, setDraft] = React.useState<WidgetItem[] | null>(null)
  // The last widget the pointer swapped with: a swap moves that widget, possibly back under the pointer, which must not swap it again.
  const lastOver = React.useRef<string | null>(null)
  // Drag offset at the last swap.
  const swapAt = React.useRef({ x: 0, y: 0 })
  const layout = draft ?? valid
  // The layout before the last delete: "Undo" restores it. Clears itself after a few seconds.
  const [undo, setUndo] = React.useState<{ layout: WidgetItem[]; label: string } | null>(null)

  React.useEffect(() => {
    if (!undo) return
    const id = window.setTimeout(() => setUndo(null), 6000)
    return () => window.clearTimeout(id)
  }, [undo])

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    // Touch: press and hold, so a swipe over a widget still scrolls the page.
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: gridKeyboardCoordinates })
  )

  // Widget ids before the latest change: anything not in there was just added, so it animates in (first render and drag moves don't).
  const ids = layout.map((i) => i.id).sort()
  const idsKey = ids.join()
  const [seen, setSeen] = React.useState<{ key: string; before: Set<string> } | null>(null)
  if (hydrated && seen?.key !== idsKey) setSeen({ key: idsKey, before: seen ? new Set(seen.key.split(",")) : new Set(ids) })
  const known = seen?.before ?? null

  if (!hydrated) return null

  const active = activeId ? layout.find((i) => i.id === activeId) : undefined
  const spans = placements(layout)

  if (layout.length === 0)
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

  const onDragStart = ({ active }: DragStartEvent) => {
    setActiveId(String(active.id))
    setDraft(valid)
    lastOver.current = null
    swapAt.current = { x: 0, y: 0 }
  }

  const moveBefore = (activeId: string, overId: string) =>
    setDraft((prev) => {
      if (!prev) return prev
      const from = prev.findIndex((i) => i.id === activeId)
      const to = prev.findIndex((i) => i.id === overId)
      return from === -1 || to === -1 ? prev : arrayMove(prev, from, to)
    })

  const isKeyboard = (e: DragMoveEvent | DragEndEvent) => e.activatorEvent instanceof KeyboardEvent

  // Mouse / touch: the order changes live. Runs on pointer moves only, never on the reflow itself. A swap shifts other
  // widgets under a still pointer, and those must not swap in turn: so not the widget just swapped with again, and
  // only after the pointer travelled SWAP_TRAVEL since the last swap.
  // Keyboard drags don't reorder live (the arrow keys step between widgets that would keep moving); they move on drop.
  const onDragMove = (e: DragMoveEvent) => {
    const { active, over, delta } = e
    // Over a gap: keep the guard, the reflow often leaves the pointer between cells for a moment.
    if (isKeyboard(e) || !over) return
    const overId = String(over.id)
    if (overId === lastOver.current) return
    if (Math.hypot(delta.x - swapAt.current.x, delta.y - swapAt.current.y) < SWAP_TRAVEL) return
    lastOver.current = overId
    if (overId === active.id) return
    swapAt.current = delta
    moveBefore(String(active.id), overId)
  }

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    let next = draft
    if (isKeyboard(e) && over && over.id !== active.id) {
      const from = valid.findIndex((i) => i.id === active.id)
      const to = valid.findIndex((i) => i.id === over.id)
      if (from !== -1 && to !== -1) next = arrayMove(valid, from, to)
    }
    endDrag(next)
  }

  /** Saves `next` when the order changed (null: cancelled), then leaves drag mode. */
  const endDrag = (next: WidgetItem[] | null) => {
    if (next && next.some((item, i) => item.id !== valid[i]?.id)) setLayout(next)
    setActiveId(null)
    setDraft(null)
    lastOver.current = null
  }

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
        collisionDetection={collision}
        // The grid reflows during the drag, so targets are re-measured instead of kept from drag start.
        measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
        onDragStart={onDragStart}
        onDragMove={onDragMove}
        onDragEnd={onDragEnd}
        onDragCancel={() => endDrag(null)}
      >
        <SortableContext items={layout.map((i) => i.id)} strategy={reflowStrategy}>
          <div data-slot="widget-grid" className="@container">
            <div className="grid auto-rows-[minmax(164px,auto)] grid-flow-dense grid-cols-1 gap-3 @xl:grid-cols-2 @xl:gap-6 @5xl:grid-cols-24">
            {layout.map((item) => (
              <BoardWidget
                key={item.id}
                item={item}
                span={spans.get(item.id)}
                customizing={customizing}
                isNew={known !== null && !known.has(item.id)}
                onRemove={() => remove(item)}
                onDuplicate={() => setLayout((prev) => duplicateWidget(prev, item.id))}
              />
            ))}
            </div>
          </div>
        </SortableContext>
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

const EXIT_MS = 200

function BoardWidget({
  item,
  span,
  customizing,
  isNew,
  onRemove,
  onDuplicate,
}: {
  item: WidgetItem
  /** Desktop column placement, from `placements`. */
  span?: string
  customizing: boolean
  isNew: boolean
  onRemove: () => void
  onDuplicate: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    disabled: !customizing,
    // Every widget that changes cell glides there (not only the dropped one).
    animateLayoutChanges: () => true,
  })
  const [leaving, setLeaving] = React.useState(false)
  // Play the exit animation first, then really remove the widget.
  const leave = () => {
    if (leaving) return
    setLeaving(true)
    window.setTimeout(onRemove, EXIT_MS)
  }
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Translate.toString(transform), transition }} className={cn("min-w-0", SPAN[widgetSize(item.type)], span)}>
      {/* Animation lives on an inner wrapper so it never fights the sortable transform above. */}
      <div
        className={cn(
          "h-full",
          isNew && "animate-in duration-300 fade-in-0 zoom-in-95 slide-in-from-bottom-2",
          leaving && "pointer-events-none animate-out fill-mode-forwards duration-200 fade-out-0 zoom-out-95"
        )}
      >
        <WidgetFrame
          item={item}
          customizing={customizing}
          handleProps={{ ...attributes, ...listeners }}
          dragListeners={listeners}
          placeholder={isDragging}
          onRemove={leave}
          onDuplicate={onDuplicate}
        />
      </div>
    </div>
  )
}

function WidgetFrame({
  item,
  customizing,
  overlay,
  placeholder,
  handleProps,
  dragListeners,
  onRemove,
  onDuplicate,
}: {
  item: WidgetItem
  customizing: boolean
  overlay?: boolean
  /** The slot the dragged widget leaves behind: same size, content hidden, tinted so the drop spot reads clearly. */
  placeholder?: boolean
  /** The move button: sortable attributes (role, focus, aria) and listeners. */
  handleProps?: React.HTMLAttributes<HTMLElement>
  /** Mouse and touch listeners only, for dragging from anywhere on the widget. */
  dragListeners?: React.DOMAttributes<HTMLElement>
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
        "group/widget relative h-full",
        // The overlay is outside the grid, so it needs the cell's size itself.
        overlay && "scale-[1.02] cursor-grabbing rounded-r20 opacity-95 shadow-[0_24px_48px_0_var(--shadow-base)] ring-2 ring-primary-alpha-30"
      )}
    >
      {/* Inert while customizing, so dragging never triggers the widget's own controls. */}
      <div inert={customizing || undefined} className={cn("h-full *:size-full", customizing && "select-none", placeholder && "invisible")}>
        <WidgetFluid value>{def.board ?? def.preview}</WidgetFluid>
      </div>
      {placeholder && <div aria-hidden className="absolute inset-0 rounded-r20 bg-primary-alpha-5 outline -outline-offset-1 outline-dashed outline-primary-alpha-30" />}
      {customizing && !placeholder && (
        <>
          {/* Pointer drag from anywhere on the widget; the handle button below is the keyboard / screen-reader control. */}
          <div
            aria-hidden
            {...dragListeners}
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

export { WidgetBoard }
