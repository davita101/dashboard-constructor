import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Figma Calendar page (12256:118505): Head-Calendar-Component, Date-Calendar-Component,
// Cell-Day-Week-Calendar-Component and Cell-Month-Calendar-Component, composed into the
// Week / Month Calendar Blocks. Every cell has Figma's 1px inside stroke (an inset outline),
// so neighbouring cells draw a 2px line, as in Figma.
const cellStroke = "outline -outline-offset-1 outline-background-100"

/** Block frame: r16 mobile, r24 tablet, r20 desktop (Figma). */
function EventCalendar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="event-calendar"
      className={cn(
        "flex flex-col overflow-hidden rounded-r16 bg-background-0 font-default tracking-default shadow-[0_1px_2px_0_var(--shadow-base)] md:rounded-r24 lg:rounded-r20",
        cellStroke,
        className
      )}
      {...props}
    />
  )
}

/** Figma Head-Calendar-Component: Desktop / Tablet row, Mobile column. */
function EventCalendarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="event-calendar-header"
      className={cn(
        "flex flex-col gap-4 p-4 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-0 lg:px-5",
        cellStroke,
        className
      )}
      {...props}
    />
  )
}

function EventCalendarTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="event-calendar-title"
      className={cn("text-14 leading-24 font-bold text-base-700", className)}
      {...props}
    />
  )
}

/** Figma Head "Group": Today + Add Event; the buttons fill the row on mobile. */
function EventCalendarActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="event-calendar-actions"
      className={cn("flex items-center gap-2 *:max-md:flex-1", className)}
      {...props}
    />
  )
}

/** Week / Month body: 7 day columns, plus a 40px time column in the Week view. */
const eventCalendarGridVariants = cva("grid", {
  variants: {
    view: {
      week: "grid-cols-[--spacing(10)_repeat(7,minmax(0,1fr))] auto-rows-[--spacing(10)]",
      month: "grid-cols-[repeat(7,minmax(0,1fr))] grid-rows-[--spacing(10)] auto-rows-[minmax(--spacing(35),auto)]",
    },
  },
  defaultVariants: {
    view: "week",
  },
})

function EventCalendarGrid({
  className,
  view = "week",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof eventCalendarGridVariants>) {
  return (
    <div
      data-slot="event-calendar-grid"
      data-view={view}
      className={cn(eventCalendarGridVariants({ view }), className)}
      {...props}
    />
  )
}

/** Figma Date-Calendar-Component Type=Date Head / Date Head Today (weekday, then date). */
function EventCalendarDayHead({
  className,
  today = false,
  ...props
}: React.ComponentProps<"div"> & { today?: boolean }) {
  return (
    <div
      data-slot="event-calendar-day-head"
      data-today={today || undefined}
      className={cn(
        "group/day-head flex h-10 min-w-0 items-center justify-center gap-2 text-10 leading-16 font-bold",
        cellStroke,
        className
      )}
      {...props}
    />
  )
}

function EventCalendarWeekday({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="event-calendar-weekday"
      className={cn("truncate text-base-500 group-data-today/day-head:text-primary-600", className)}
      {...props}
    />
  )
}

function EventCalendarDayNumber({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="event-calendar-day-number"
      className={cn("text-base-700 group-data-today/day-head:text-primary-600", className)}
      {...props}
    />
  )
}

/**
 * Figma Date-Calendar-Component Type=Time (hour label, 80px = two half-hour slots)
 * and Type=Empty (the corner above it, when empty).
 */
function EventCalendarTimeLabel({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="event-calendar-time-label"
      className={cn("flex flex-col items-center", cellStroke, className)}
      {...props}
    >
      {children !== undefined && (
        <span className="flex h-10 items-center text-9 leading-16 font-bold text-base-600">{children}</span>
      )}
    </div>
  )
}

/** Figma Cell-Day-Week-Calendar-Component Type=Empty: one 30-min slot. */
function EventCalendarSlot({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="event-calendar-slot" className={cn("min-w-0", cellStroke, className)} {...props} />
}

/**
 * Figma Cell-Day-Week-Calendar-Component Type=Event: an event laid over its slots with a 4px inset.
 * Place it with gridRow / gridColumn; 30-min events take a Compact CalendarEvent, longer ones Full.
 */
function EventCalendarSlotEvent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="event-calendar-slot-event"
      className={cn("relative flex min-w-0 flex-col p-1 *:flex-1", className)}
      {...props}
    />
  )
}

/** Figma Cell-Month-Calendar-Component: Empty / Event, plus Today and Other Month. */
const eventCalendarDayVariants = cva(
  `group/month-day flex min-w-0 flex-col gap-2 p-1 ${cellStroke}`,
  {
    variants: {
      month: {
        current: "bg-background-0",
        other: "bg-background-20",
      },
    },
    defaultVariants: {
      month: "current",
    },
  }
)

function EventCalendarDay({
  className,
  month = "current",
  today = false,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof eventCalendarDayVariants> & { today?: boolean }) {
  return (
    <div
      data-slot="event-calendar-day"
      data-month={month}
      data-today={today || undefined}
      className={cn(eventCalendarDayVariants({ month }), className)}
      {...props}
    />
  )
}

/** Figma month cell "Date": base-500, base-200 in other months, a 20px primary circle today. */
function EventCalendarDate({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="event-calendar-date"
      className={cn(
        "flex h-5 min-w-5 items-start self-start px-1 text-10 leading-16 font-bold text-base-500",
        "group-data-[month=other]/month-day:text-base-200",
        "group-data-today/month-day:items-center group-data-today/month-day:justify-center group-data-today/month-day:rounded-full group-data-today/month-day:bg-primary-600 group-data-today/month-day:px-0 group-data-today/month-day:text-background-0",
        className
      )}
      {...props}
    />
  )
}

/** Figma month cell "Content": up to four Text-type events, then More. */
function EventCalendarDayEvents({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="event-calendar-day-events"
      className={cn("flex min-w-0 flex-col gap-0.5", className)}
      {...props}
    />
  )
}

/** Figma "Show More": plain base-500 label; render a button to make it interactive. */
function EventCalendarMore({ className, render, ...props }: useRender.ComponentProps<"span">) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(
          "self-start rounded-r4 text-9 leading-16 font-bold text-base-500 outline-0 outline-primary-alpha-30 outline-solid hover:text-base-700 focus-visible:outline-3",
          className
        ),
      },
      props
    ),
    render,
    state: { slot: "event-calendar-more" },
  })
}

export {
  EventCalendar,
  EventCalendarHeader,
  EventCalendarTitle,
  EventCalendarActions,
  EventCalendarGrid,
  EventCalendarDayHead,
  EventCalendarWeekday,
  EventCalendarDayNumber,
  EventCalendarTimeLabel,
  EventCalendarSlot,
  EventCalendarSlotEvent,
  EventCalendarDay,
  EventCalendarDate,
  EventCalendarDayEvents,
  EventCalendarMore,
  eventCalendarGridVariants,
  eventCalendarDayVariants,
}
