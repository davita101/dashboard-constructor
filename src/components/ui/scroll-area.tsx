"use client"

import * as React from "react"
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Figma Scroll: the thumb is a fixed 4x96 pill (not sized by the content ratio like Base UI's thumb).
const THUMB_LENGTH = 96

const ScrollAreaViewportContext = React.createContext<React.RefObject<HTMLDivElement | null> | null>(null)

/**
 * Base UI Root + Viewport (native scrolling, hidden native bars) with the Figma Scroll thumb.
 * `scrollbar="track"`: Figma 20px scroll track (4px thumb centered), for lists whose content keeps a 20px end gutter.
 */
function ScrollArea({
  className,
  children,
  scrollbar,
  ...props
}: ScrollAreaPrimitive.Root.Props & { scrollbar?: VariantProps<typeof scrollBarVariants>["size"] }) {
  const viewportRef = React.useRef<HTMLDivElement>(null)

  return (
    <ScrollAreaViewportContext.Provider value={viewportRef}>
      <ScrollAreaPrimitive.Root data-slot="scroll-area" className={cn("relative", className)} {...props}>
        <ScrollAreaPrimitive.Viewport
          ref={viewportRef}
          data-slot="scroll-area-viewport"
          className="size-full rounded-[inherit] outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-500"
        >
          {children}
        </ScrollAreaPrimitive.Viewport>
        <ScrollBar size={scrollbar} />
        <ScrollBar size={scrollbar} orientation="horizontal" />
      </ScrollAreaPrimitive.Root>
    </ScrollAreaViewportContext.Provider>
  )
}

// Figma Scroll: 4x96 pill thumb, Default idle, Active on hover/scroll/drag.
const scrollThumbVariants = cva(
  "shrink-0 rounded-r8 bg-base-150 transition-colors hover:bg-base-500 data-[dragging]:bg-base-500 data-[scrolling]:bg-base-500",
  {
    variants: {
      orientation: {
        vertical: "h-24 w-full",
        horizontal: "h-full w-24",
      },
      state: {
        default: "",
        active: "bg-base-500",
      },
    },
    defaultVariants: { orientation: "vertical", state: "default" },
  }
)

const scrollBarVariants = cva("flex touch-none select-none", {
  variants: {
    orientation: {
      vertical: "h-full flex-col",
      horizontal: "w-full flex-row",
    },
    size: {
      default: "",
      track: "",
    },
  },
  compoundVariants: [
    { orientation: "vertical", size: "default", class: "w-1" },
    { orientation: "horizontal", size: "default", class: "h-1" },
    { orientation: "vertical", size: "track", class: "w-5 px-2" },
    { orientation: "horizontal", size: "track", class: "h-5 py-2" },
  ],
  defaultVariants: { orientation: "vertical", size: "default" },
})

type Axis = {
  scroll: (el: HTMLElement) => number
  setScroll: (el: HTMLElement, value: number) => void
  max: (el: HTMLElement) => number
  length: (el: HTMLElement) => number
  pointer: (e: { clientX: number; clientY: number }) => number
  start: (el: HTMLElement) => number
  size: "height" | "width"
  translate: (offset: number) => string
}

const axes: Record<"vertical" | "horizontal", Axis> = {
  vertical: {
    scroll: (el) => el.scrollTop,
    setScroll: (el, value) => (el.scrollTop = value),
    max: (el) => el.scrollHeight - el.clientHeight,
    length: (el) => el.clientHeight,
    pointer: (e) => e.clientY,
    start: (el) => el.getBoundingClientRect().top,
    size: "height",
    translate: (offset) => `translate3d(0,${offset}px,0)`,
  },
  horizontal: {
    scroll: (el) => el.scrollLeft,
    setScroll: (el, value) => (el.scrollLeft = value),
    max: (el) => el.scrollWidth - el.clientWidth,
    length: (el) => el.clientWidth,
    pointer: (e) => e.clientX,
    start: (el) => el.getBoundingClientRect().left,
    size: "width",
    translate: (offset) => `translate3d(${offset}px,0,0)`,
  },
}

/**
 * Scrollbar of a ScrollArea. The thumb is moved straight on the DOM from a passive scroll listener (no React state per frame).
 * Drag the thumb to scroll; press the track to jump there. Hidden while the content fits.
 */
function ScrollBar({
  className,
  orientation = "vertical",
  state,
  size,
  ...props
}: React.ComponentProps<"div"> &
  Pick<VariantProps<typeof scrollThumbVariants>, "state"> &
  Pick<VariantProps<typeof scrollBarVariants>, "size"> & { orientation?: "vertical" | "horizontal" }) {
  const viewportRef = React.useContext(ScrollAreaViewportContext)
  const barRef = React.useRef<HTMLDivElement>(null)
  const thumbRef = React.useRef<HTMLDivElement>(null)
  const axis = axes[orientation]

  // Thumb length: Figma 96, shrunk to half the track on short containers so it can still travel.
  const thumbLength = React.useCallback(
    (bar: HTMLElement) => Math.min(THUMB_LENGTH, axis.length(bar) / 2),
    [axis]
  )

  React.useEffect(() => {
    const viewport = viewportRef?.current
    const bar = barRef.current
    const thumb = thumbRef.current
    if (!viewport || !bar || !thumb) return

    let idle: ReturnType<typeof setTimeout> | undefined

    const update = () => {
      const max = axis.max(viewport)
      bar.dataset.state = max > 1 ? "visible" : "hidden"
      if (max <= 1) return
      const length = thumbLength(bar)
      const travel = axis.length(bar) - length
      thumb.style[axis.size] = `${length}px`
      thumb.style.transform = axis.translate((Math.min(Math.max(axis.scroll(viewport), 0), max) / max) * travel)
    }

    const onScroll = () => {
      update()
      thumb.dataset.scrolling = ""
      clearTimeout(idle)
      idle = setTimeout(() => delete thumb.dataset.scrolling, 500)
    }

    // Content size changes (tabs, loaded data) resize the scroll range without a scroll event.
    const resize = new ResizeObserver(update)
    const observeContent = () => {
      resize.disconnect()
      resize.observe(viewport)
      resize.observe(bar)
      for (const child of viewport.children) resize.observe(child)
      update()
    }
    const mutation = new MutationObserver(observeContent)

    observeContent()
    mutation.observe(viewport, { childList: true })
    viewport.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      clearTimeout(idle)
      resize.disconnect()
      mutation.disconnect()
      viewport.removeEventListener("scroll", onScroll)
    }
  }, [viewportRef, axis, thumbLength])

  const scrollTo = (viewport: HTMLElement, bar: HTMLElement, thumbStart: number) => {
    const travel = axis.length(bar) - thumbLength(bar)
    if (travel > 0) axis.setScroll(viewport, (thumbStart / travel) * axis.max(viewport))
  }

  const onThumbPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const viewport = viewportRef?.current
    const bar = barRef.current
    const thumb = event.currentTarget
    if (!viewport || !bar || event.button !== 0) return
    event.preventDefault()
    event.stopPropagation()
    thumb.setPointerCapture(event.pointerId)
    thumb.dataset.dragging = ""

    const from = axis.pointer(event)
    const travel = axis.length(bar) - thumbLength(bar)
    const startThumb = (axis.scroll(viewport) / Math.max(axis.max(viewport), 1)) * travel

    const move = (e: PointerEvent) => scrollTo(viewport, bar, startThumb + axis.pointer(e) - from)
    const end = () => {
      delete thumb.dataset.dragging
      thumb.removeEventListener("pointermove", move)
      thumb.removeEventListener("pointerup", end)
      thumb.removeEventListener("pointercancel", end)
    }
    thumb.addEventListener("pointermove", move)
    thumb.addEventListener("pointerup", end)
    thumb.addEventListener("pointercancel", end)
  }

  // Press on the track: center the thumb on the pointer.
  const onTrackPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const viewport = viewportRef?.current
    const bar = barRef.current
    if (!viewport || !bar || event.button !== 0) return
    scrollTo(viewport, bar, axis.pointer(event) - axis.start(bar) - thumbLength(bar) / 2)
  }

  return (
    <div
      ref={barRef}
      data-slot="scroll-area-scrollbar"
      data-orientation={orientation}
      data-state="hidden"
      aria-hidden="true"
      onPointerDown={onTrackPointerDown}
      className={cn(
        scrollBarVariants({ orientation, size }),
        "absolute z-50 data-[state=hidden]:hidden",
        orientation === "vertical" ? "inset-y-0 end-0" : "inset-x-0 bottom-0",
        className
      )}
      {...props}
    >
      <div
        ref={thumbRef}
        data-slot="scroll-area-thumb"
        onPointerDown={onThumbPointerDown}
        className={scrollThumbVariants({ orientation, state })}
      />
    </div>
  )
}

// Static scroll indicator (Figma Scroll set): 4x96 thumb at the start of the track, size comes from the container.
function Scroll({
  className,
  orientation = "vertical",
  state,
  ...props
}: React.ComponentProps<"div"> &
  Pick<VariantProps<typeof scrollThumbVariants>, "state"> & {
    orientation?: "vertical" | "horizontal"
  }) {
  return (
    <div
      data-slot="scroll"
      aria-hidden="true"
      className={cn(scrollBarVariants({ orientation }), className)}
      {...props}
    >
      <div className={scrollThumbVariants({ orientation, state })} />
    </div>
  )
}

export { ScrollArea, ScrollBar, Scroll, scrollBarVariants, scrollThumbVariants }
