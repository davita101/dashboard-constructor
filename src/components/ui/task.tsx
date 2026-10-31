import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Figma Task page (12276:31748): Task-Card, Task-List, New-Task, Task-Description.
// Task is the white tile; the other parts are slots the domain compositions assemble.

const taskVariants = cva(
  "group/task flex flex-col gap-3 bg-background-0 p-3 font-default tracking-default outline -outline-offset-1 outline-background-100",
  {
    variants: {
      variant: {
        // Task-Card 264px, New-Task 264px
        card: "w-66 rounded-r20",
        // Task-List 320px row
        list: "w-80 rounded-r12",
        // Task-Description: bare 280px stack, no tile
        description: "w-70 gap-4 bg-transparent p-0 outline-none",
      },
    },
    defaultVariants: {
      variant: "card",
    },
  }
)

function Task({
  className,
  variant = "card",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof taskVariants>) {
  return <div data-slot="task" data-variant={variant} className={cn(taskVariants({ variant }), className)} {...props} />
}

/** Figma Image: 240x120 cover with r12. */
function TaskCover({ className, ...props }: React.ComponentProps<"img">) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img data-slot="task-cover" alt="" className={cn("h-30 w-full rounded-r12 object-cover", className)} {...props} />
  )
}

/** Figma Task title: Inter 700 10/16 base-700. */
function TaskTitle({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p data-slot="task-title" className={cn("min-w-0 flex-1 truncate text-10 leading-16 font-bold text-base-700", className)} {...props} />
  )
}

/**
 * Single-color glyph drawn as a mask in the current color. Figma icons that are not yet in
 * public/icons render as an empty slot of the same size (see design/known-gaps.md).
 */
function TaskIcon({
  src,
  className,
  style,
  ...props
}: React.ComponentProps<"span"> & { src?: string }) {
  return (
    <span
      data-slot="task-icon"
      aria-hidden
      className={cn(
        "size-5 shrink-0 text-base-500",
        src && "bg-current mask-contain mask-center mask-no-repeat",
        className
      )}
      style={src ? { maskImage: `url(${src})`, ...style } : style}
      {...props}
    />
  )
}

/** Figma Time: calendar icon, start date, chevron, end date (danger when overdue). */
function TaskDates({
  start = "Start Date",
  end = "End Date",
  overdue = false,
  className,
  ...props
}: React.ComponentProps<"div"> & { start?: string; end?: string; overdue?: boolean }) {
  return (
    <div data-slot="task-dates" className={cn("flex items-center gap-2 text-base-700", className)} {...props}>
      <TaskIcon src="/icons/material-today.svg" className="size-4 text-base-700" />
      <div className="flex items-center gap-1 text-9 leading-16 font-bold group-data-[variant=list]/task:text-10">
        <span>{start}</span>
        <TaskIcon src="/icons/material-chevron-right.svg" className="size-4 text-base-700" />
        <span className={cn(overdue && "font-semibold text-danger-500")}>{end}</span>
      </div>
    </div>
  )
}

/** Figma Labels row: Badge chips, 8px (card) or 6px (list) apart. */
function TaskLabels({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="task-labels" className={cn("flex flex-wrap items-center gap-2", className)} {...props} />
}

/** Figma Subtasks / Files / Description counters: 20px icon with a count. */
function TaskStats({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="task-stats" className={cn("flex items-center gap-3", className)} {...props} />
}

function TaskStat({
  icon,
  count,
  className,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> & { icon?: string; count?: number }) {
  return (
    <span data-slot="task-stat" className={cn("flex items-center gap-1 text-10 leading-16 font-bold text-base-700", className)} {...props}>
      <TaskIcon src={icon} className="text-base-600" />
      {count !== undefined && <span>{count}</span>}
    </span>
  )
}

/** Figma Footer / Head rows: space-between. */
function TaskRow({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="task-row" className={cn("flex items-center justify-between gap-3", className)} {...props} />
}

/** Task-Description section: icon + label above its content. */
function TaskSection({ className, ...props }: React.ComponentProps<"section">) {
  return <section data-slot="task-section" className={cn("flex flex-col gap-3", className)} {...props} />
}

function TaskSectionTitle({
  icon,
  className,
  children,
  ...props
}: React.ComponentProps<"h3"> & { icon?: string }) {
  return (
    <h3 data-slot="task-section-title" className={cn("flex items-center gap-2 text-10 leading-16 font-bold text-base-700", className)} {...props}>
      <TaskIcon src={icon} />
      {children}
    </h3>
  )
}

/** Figma color-dot icon next to the Status title. */
function TaskDot({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span data-slot="task-dot" aria-hidden className={cn("flex size-5 shrink-0 items-center justify-center", className)} {...props}>
      <span className="size-1.5 rounded-full bg-base-500" />
    </span>
  )
}

/** New-Task header title: Inter 600 12/20 base-600. */
function TaskName({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="task-name" className={cn("text-12 leading-20 font-semibold text-base-600", className)} {...props} />
}

export {
  Task,
  TaskCover,
  TaskDates,
  TaskDot,
  TaskIcon,
  TaskLabels,
  TaskName,
  TaskRow,
  TaskSection,
  TaskSectionTitle,
  TaskStat,
  TaskStats,
  TaskTitle,
  taskVariants,
}
