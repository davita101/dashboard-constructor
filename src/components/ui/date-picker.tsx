import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { Button, ButtonIcon } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// Figma Date Picker page (9402:27552): Date-Component (11821:16070), Date-Picker-Card (9456:11847),
// Date-Picker-Range-Card (11821:19105), Double-Date-Picker-Card (9456:12004) and
// Double-Date-Picker-Mobile-Card (12143:237425). Strokes are inside the box (outline -outline-offset-1).

// Date-Component: 28x28 cell. Type = Disabled | Head | Default | Default Plus | Hover | Active | Active First | Active Last.
// Active types draw a 23x23 base-900 tile (Date frame) inside the cell.
const datePickerDayVariants = cva(
  "group/day relative flex h-7 shrink-0 items-center justify-center font-default text-10 leading-16 font-bold tracking-default antialiased select-none",
  {
    variants: {
      type: {
        disabled: "bg-background-20 pb-px text-base-200 outline -outline-offset-1 outline-background-100",
        head: "pb-px text-base-300",
        default:
          "cursor-pointer bg-background-0 pb-px text-base-700 outline -outline-offset-1 outline-background-100 before:absolute before:top-0.5 before:left-0.5 before:size-5.75 before:rounded-r6 hover:before:bg-base-alpha-15 hover:text-base-800 focus-visible:z-10 focus-visible:outline-primary-300",
        "default-plus":
          "cursor-pointer bg-background-0 pb-px text-base-700 outline -outline-offset-1 outline-background-100 before:absolute before:top-0.5 before:left-0.5 before:size-5.75 before:rounded-r6 hover:before:bg-base-alpha-15 hover:text-base-800 focus-visible:z-10 focus-visible:outline-primary-300",
        hover: "cursor-pointer pt-0.5 pr-0.75 pb-0.75 pl-0.5 text-base-800 outline -outline-offset-1 outline-background-100",
        active: "cursor-pointer pt-0.5 pr-0.75 pb-0.75 pl-0.5 text-background-0 outline -outline-offset-1 outline-background-100",
        "active-first":
          "cursor-pointer bg-background-0 pt-0.5 pr-0.75 pb-0.75 pl-0.5 text-background-0 outline -outline-offset-1 outline-background-100",
        "active-last":
          "cursor-pointer bg-background-0 pt-0.5 pr-0.75 pb-0.75 pl-0.5 text-background-0 outline -outline-offset-1 outline-background-100",
      },
      fit: {
        fixed: "w-7",
        fluid: "min-w-0 flex-1",
      },
    },
    defaultVariants: { type: "default", fit: "fixed" },
  }
)

// Date frame inside the active types.
const datePickerDayTileVariants = cva("relative z-1 flex size-5.75 transform-gpu items-center justify-center", {
  variants: {
    type: {
      plain: "",
      hover: "rounded-r6 bg-base-alpha-15",
      active: "rounded-r6 bg-base-900",
      "active-first": "bg-base-900",
      "active-last": "bg-base-900",
    },
  },
  defaultVariants: { type: "plain" },
})

type DatePickerDayType = NonNullable<VariantProps<typeof datePickerDayVariants>["type"]>

function DatePickerDay({
  className,
  type = "default",
  fit = "fixed",
  children,
  ...props
}: Omit<React.ComponentProps<"button">, "type"> & VariantProps<typeof datePickerDayVariants>) {
  const resolved = type ?? "default"
  const classes = cn(datePickerDayVariants({ type: resolved, fit }), className)
  const tile =
    resolved === "hover" || resolved === "active" || resolved === "active-first" || resolved === "active-last"
      ? resolved
      : "plain"
  const content = (
    <>
      <span data-slot="date-picker-day-tile" className={datePickerDayTileVariants({ type: tile })}>
        {children}
      </span>
      {resolved === "default-plus" ? (
        <span
          data-slot="date-picker-day-dot"
          aria-hidden
          className="absolute top-1 right-1.5 size-0.75 rounded-r60 bg-blue-600"
        />
      ) : null}
    </>
  )
  if (resolved === "head") {
    return (
      <span data-slot="date-picker-day" data-type={resolved} className={classes}>
        {children}
      </span>
    )
  }
  return (
    <button
      type="button"
      data-slot="date-picker-day"
      data-type={resolved}
      disabled={resolved === "disabled"}
      className={classes}
      {...props}
    >
      {content}
    </button>
  )
}

// Card: Date-Picker-Card / Date-Picker-Range-Card (bordered r20), Month 2 (plain), Double (r12), Mobile (stack).
const datePickerVariants = cva("flex flex-col bg-background-0", {
  variants: {
    variant: {
      bordered: "rounded-r20 outline -outline-offset-1 outline-background-100",
      plain: "",
      double: "rounded-r12 outline -outline-offset-1 outline-background-100",
    },
    size: {
      default: "w-55",
      compact: "w-49",
      auto: "",
    },
  },
  defaultVariants: { variant: "bordered", size: "default" },
})

function DatePicker({
  className,
  variant = "bordered",
  size = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof datePickerVariants>) {
  return (
    <div
      data-slot="date-picker"
      className={cn(datePickerVariants({ variant, size }), className)}
      {...props}
    />
  )
}

// Head: nav chevrons around the Month/Year pills (or a month title).
function DatePickerHead({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="date-picker-head"
      className={cn("flex h-12 items-center justify-between px-2 py-3", className)}
      {...props}
    />
  )
}

function DatePickerNav({
  direction,
  className,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "children" | "variant" | "size" | "shape"> & {
  direction: "previous" | "next"
}) {
  return (
    <Button
      variant="ghost"
      size="glyph-20"
      aria-label={direction === "previous" ? "Previous" : "Next"}
      className={className}
      {...props}
    >
      <ButtonIcon src={direction === "previous" ? "/icons/material-chevron-left.svg" : "/icons/material-chevron-right.svg"} />
    </Button>
  )
}

function DatePickerSelects({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="date-picker-selects" className={cn("flex items-center gap-2", className)} {...props} />
}

function DatePickerSelect({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "variant" | "size" | "shape">) {
  return (
    <Button variant="outline" size="24" shape="pill" className={className} {...props}>
      {children}
      <ButtonIcon src="/icons/material-expand-more.svg" position="end" />
    </Button>
  )
}

function DatePickerTitle({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="date-picker-title"
      className={cn("font-default text-11 leading-20 font-bold tracking-default text-base-800", className)}
      {...props}
    />
  )
}

// Content: weekday row + rounded grid of weeks.
function DatePickerBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="date-picker-body" className={cn("flex flex-col gap-1 px-3 pb-3", className)} {...props} />
}

function DatePickerWeekdays({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="date-picker-weekdays" className={cn("flex", className)} {...props} />
}

function DatePickerGrid({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="date-picker-grid"
      className={cn("flex flex-col overflow-hidden rounded-r8 outline -outline-offset-1 outline-background-100", className)}
      {...props}
    />
  )
}

function DatePickerRow({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="date-picker-row" className={cn("flex", className)} {...props} />
}

const WEEKDAYS = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"]
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

type DatePickerSelection = { from?: number; to?: number }

/**
 * Weekday row + grid of days for one month (Monday first). `selected` holds day numbers of this month:
 * from === to is a single Active day, otherwise from/to are Active First/Last. `dots` are Default Plus days.
 * `weekdayOffset` forces the weekday (0 = Monday) the 1st falls on, to match a Figma frame.
 */
function DatePickerCalendar({
  year,
  month,
  weekdayOffset,
  selected,
  dots = [],
  fit = "fixed",
  hoverDay,
  onSelectDay,
}: {
  year: number
  month: number
  weekdayOffset?: number
  selected?: DatePickerSelection
  dots?: number[]
  fit?: "fixed" | "fluid"
  hoverDay?: number
  onSelectDay?: (day: number) => void
}) {
  const offset = weekdayOffset ?? (new Date(year, month, 1).getDay() + 6) % 7
  const days = new Date(year, month + 1, 0).getDate()
  const prevDays = new Date(year, month, 0).getDate()
  const weeks = Math.ceil((offset + days) / 7)
  const { from, to } = selected ?? {}

  function cellType(day: number): DatePickerDayType {
    if (from !== undefined && to !== undefined && from !== to) {
      if (day === from) return "active-first"
      if (day === to) return "active-last"
      if (day > from && day < to) return "active"
    } else if (from !== undefined && day === from) {
      return "active"
    }
    if (day === hoverDay) return "hover"
    return dots.includes(day) ? "default-plus" : "default"
  }

  return (
    <>
      <DatePickerWeekdays>
        {WEEKDAYS.map((name) => (
          <DatePickerDay key={name} type="head" fit={fit}>
            {name}
          </DatePickerDay>
        ))}
      </DatePickerWeekdays>
      <DatePickerGrid>
        {Array.from({ length: weeks }, (_, week) => (
          <DatePickerRow key={week}>
            {Array.from({ length: 7 }, (_, col) => {
              const index = week * 7 + col - offset + 1
              if (index < 1) {
                return <DatePickerDay key={col} type="disabled" fit={fit}>{prevDays + index}</DatePickerDay>
              }
              if (index > days) {
                return <DatePickerDay key={col} type="disabled" fit={fit}>{index - days}</DatePickerDay>
              }
              return (
                <DatePickerDay
                  key={col}
                  type={cellType(index)}
                  fit={fit}
                  onClick={onSelectDay ? () => onSelectDay(index) : undefined}
                >
                  {index}
                </DatePickerDay>
              )
            })}
          </DatePickerRow>
        ))}
      </DatePickerGrid>
    </>
  )
}

// Double-Date-Picker: sidebar of presets | two months | footer with actions and summary.
function DatePickerSidebar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="date-picker-sidebar"
      className={cn("flex w-32 shrink-0 flex-col gap-2 px-4 pt-4 pb-18", className)}
      {...props}
    />
  )
}

function DatePickerPreset({
  className,
  active,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "variant" | "size" | "shape"> & { active?: boolean }) {
  return (
    <Button
      variant="ghost"
      size="32"
      shape="pill"
      data-active={active ? "true" : undefined}
      className={cn(
        "justify-start data-[active=true]:bg-background-50 data-[active=true]:text-base-800 data-[active=true]:before:block data-[active=true]:before:from-background-100 data-[active=true]:before:to-background-100",
        className
      )}
      {...props}
    />
  )
}

function DatePickerMonths({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="date-picker-months" className={cn("flex p-4", className)} {...props} />
}

function DatePickerMonth({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="date-picker-month" className={cn("flex w-55 flex-col", className)} {...props} />
}

function DatePickerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="date-picker-footer"
      className={cn("flex h-14 items-center gap-2 px-4 py-3", className)}
      {...props}
    />
  )
}

function DatePickerConfirm(props: Omit<React.ComponentProps<typeof Button>, "variant" | "size" | "shape">) {
  return <Button variant="dark" size="32" shape="pill" {...props} />
}

function DatePickerCancel({
  variant = "outline",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size" | "shape">) {
  return <Button variant={variant} size="32" shape="pill" {...props} />
}

function DatePickerSummary({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="date-picker-summary"
      className={cn(
        "font-default text-10 leading-16 font-semibold tracking-default text-base-400 [&>b]:font-semibold [&>b]:text-base-700",
        className
      )}
      {...props}
    />
  )
}

function DatePickerSeparator({ className, ...props }: React.ComponentProps<typeof Separator>) {
  return <Separator data-slot="date-picker-separator" className={className} {...props} />
}

export {
  DatePicker,
  DatePickerBody,
  DatePickerCalendar,
  DatePickerCancel,
  DatePickerConfirm,
  DatePickerDay,
  DatePickerFooter,
  DatePickerGrid,
  DatePickerHead,
  DatePickerMonth,
  DatePickerMonths,
  DatePickerNav,
  DatePickerPreset,
  DatePickerRow,
  DatePickerSelect,
  DatePickerSelects,
  DatePickerSeparator,
  DatePickerSidebar,
  DatePickerSummary,
  DatePickerTitle,
  DatePickerWeekdays,
  datePickerVariants,
  MONTHS as DATE_PICKER_MONTHS,
  type DatePickerDayType,
  type DatePickerSelection,
}
