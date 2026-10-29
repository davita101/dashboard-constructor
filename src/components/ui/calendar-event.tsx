"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { Badge, type BadgeColor } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Figma Event-Calendar-Component (Calendar page 12256:118505): Style × Type (Full | Compact | Text) × Size.
// `color` sets --event-bg / --event-stroke / --event-fg; Lime, Indigo, Emerald and Violet use the -alpha-5 fill.
// Figma "Blue" is the primary color. The time pills are soft-border Badges in the same color.
const calendarEventVariants = cva(
  "group/calendar-event relative flex min-w-0 overflow-hidden text-start font-default font-bold tracking-default text-(--event-fg) outline-0 outline-primary-alpha-30 outline-solid focus-visible:outline-3",
  {
    variants: {
      type: {
        full: "flex-col gap-1 rounded-r12 bg-(--event-bg) p-2 not-focus-visible:outline-1 not-focus-visible:-outline-offset-1 not-focus-visible:outline-(--event-stroke)",
        compact: "h-7 shrink-0 items-center rounded-r32 bg-(--event-bg) py-1 ps-1 pe-1.5 not-focus-visible:outline-1 not-focus-visible:-outline-offset-1 not-focus-visible:outline-(--event-stroke)",
        text: "h-4 shrink-0 items-center gap-1 rounded-r4",
      },
      size: {
        small: "text-9 leading-16",
        default: "text-10 leading-16",
      },
      color: {
        primary: "[--event-bg:var(--primary-alpha-10)] [--event-fg:var(--primary-600)] [--event-stroke:var(--primary-alpha-20)]",
        green: "[--event-bg:var(--green-alpha-10)] [--event-fg:var(--green-600)] [--event-stroke:var(--green-alpha-20)]",
        orange: "[--event-bg:var(--orange-alpha-10)] [--event-fg:var(--orange-600)] [--event-stroke:var(--orange-alpha-20)]",
        sky: "[--event-bg:var(--sky-alpha-10)] [--event-fg:var(--sky-600)] [--event-stroke:var(--sky-alpha-20)]",
        purple: "[--event-bg:var(--purple-alpha-10)] [--event-fg:var(--purple-600)] [--event-stroke:var(--purple-alpha-20)]",
        pink: "[--event-bg:var(--pink-alpha-10)] [--event-fg:var(--pink-600)] [--event-stroke:var(--pink-alpha-20)]",
        red: "[--event-bg:var(--red-alpha-10)] [--event-fg:var(--red-600)] [--event-stroke:var(--red-alpha-20)]",
        amber: "[--event-bg:var(--amber-alpha-10)] [--event-fg:var(--amber-600)] [--event-stroke:var(--amber-alpha-20)]",
        yellow: "[--event-bg:var(--yellow-alpha-10)] [--event-fg:var(--yellow-600)] [--event-stroke:var(--yellow-alpha-20)]",
        teal: "[--event-bg:var(--teal-alpha-10)] [--event-fg:var(--teal-600)] [--event-stroke:var(--teal-alpha-20)]",
        rose: "[--event-bg:var(--rose-alpha-10)] [--event-fg:var(--rose-600)] [--event-stroke:var(--rose-alpha-20)]",
        lime: "[--event-bg:var(--lime-alpha-5)] [--event-fg:var(--lime-600)] [--event-stroke:var(--lime-alpha-20)]",
        indigo: "[--event-bg:var(--indigo-alpha-5)] [--event-fg:var(--indigo-600)] [--event-stroke:var(--indigo-alpha-20)]",
        emerald: "[--event-bg:var(--emerald-alpha-5)] [--event-fg:var(--emerald-600)] [--event-stroke:var(--emerald-alpha-20)]",
        violet: "[--event-bg:var(--violet-alpha-5)] [--event-fg:var(--violet-600)] [--event-stroke:var(--violet-alpha-20)]",
      },
    },
    defaultVariants: {
      type: "full",
      size: "default",
      color: "primary",
    },
  }
)

type CalendarEventVariantProps = VariantProps<typeof calendarEventVariants>
type CalendarEventColor = NonNullable<CalendarEventVariantProps["color"]> & BadgeColor
type CalendarEventSize = NonNullable<CalendarEventVariantProps["size"]>
type CalendarEventType = NonNullable<CalendarEventVariantProps["type"]>

const CalendarEventContext = React.createContext<{ color: CalendarEventColor; size: CalendarEventSize }>({
  color: "primary",
  size: "default",
})

function CalendarEvent({
  className,
  type = "full",
  size = "default",
  color = "primary",
  render,
  ...props
}: Omit<useRender.ComponentProps<"div">, "color"> & CalendarEventVariantProps) {
  const element = useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(calendarEventVariants({ type, size, color }), className),
      },
      props
    ),
    render,
    state: {
      slot: "calendar-event",
      type,
      size,
    },
  })
  const context = React.useMemo(
    () => ({ color: color ?? "primary", size: size ?? "default" }),
    [color, size]
  )
  return <CalendarEventContext.Provider value={context}>{element}</CalendarEventContext.Provider>
}

/** Figma "Name Event": wraps in Full, truncates in Compact and Text. */
function CalendarEventTitle({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="calendar-event-title"
      className={cn(
        "min-w-0 flex-1",
        "group-data-[type=full]/calendar-event:overflow-hidden group-data-[type=full]/calendar-event:break-words",
        "group-data-[type=compact]/calendar-event:truncate group-data-[type=compact]/calendar-event:px-1.5",
        "group-data-[type=text]/calendar-event:truncate",
        className
      )}
      {...props}
    />
  )
}

/** Figma "Dot": 4px marker before a Text-type title. */
function CalendarEventDot({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="calendar-event-dot"
      aria-hidden
      className={cn("me-1 size-1 shrink-0 rounded-full bg-current", className)}
      {...props}
    />
  )
}

/** Figma "Time" pill (Badge-Square-Pilled, soft): 16px on Small events, 20px on Default. */
function CalendarEventTime({ className, ...props }: Omit<React.ComponentProps<"time">, "color">) {
  const { color, size } = React.useContext(CalendarEventContext)
  return (
    <Badge
      data-slot="calendar-event-time"
      variant="soft-border"
      color={color}
      size={size === "small" ? "square-16" : "square-20"}
      shape="pill"
      render={<time />}
      className={className}
      {...props}
    />
  )
}

/** Figma Full "Time" row: start and end pills. */
function CalendarEventTimes({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="calendar-event-times"
      className={cn("flex shrink-0 items-center gap-1", className)}
      {...props}
    />
  )
}

/** Figma Text-type "Time": plain label after the title. */
function CalendarEventMeta({ className, ...props }: React.ComponentProps<"time">) {
  return (
    <time
      data-slot="calendar-event-meta"
      className={cn("shrink-0 text-base-600", className)}
      {...props}
    />
  )
}

/** Figma "Footer" (hidden by default): holds an AvatarGroup of attendees. */
function CalendarEventFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="calendar-event-footer"
      className={cn("flex shrink-0 items-center", className)}
      {...props}
    />
  )
}

export {
  CalendarEvent,
  CalendarEventTitle,
  CalendarEventDot,
  CalendarEventTime,
  CalendarEventTimes,
  CalendarEventMeta,
  CalendarEventFooter,
  calendarEventVariants,
  type CalendarEventColor,
  type CalendarEventSize,
  type CalendarEventType,
}
