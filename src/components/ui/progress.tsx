"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "@base-ui/react/progress"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import type { ProgressColor } from "@/components/ui/progress-colors"

/** Figma `Content` bar: 4px (Default) or 2px (Small), fully rounded, same-hue 10% track. */
const progressTrackVariants = cva(
  "relative flex w-full items-center overflow-hidden rounded-full",
  {
    variants: {
      color: {
        primary: "bg-primary-alpha-10",
        "primary-dark": "bg-base-100",
        black: "bg-black-alpha-30",
        white: "bg-white-alpha-30",
        orange: "bg-orange-alpha-10",
        purple: "bg-purple-alpha-10",
        red: "bg-red-alpha-10",
        yellow: "bg-yellow-alpha-10",
        green: "bg-green-alpha-10",
        sky: "bg-sky-alpha-10",
        pink: "bg-pink-alpha-10",
        amber: "bg-amber-alpha-10",
        teal: "bg-teal-alpha-10",
        blue: "bg-blue-alpha-10",
        "blue-flat": "bg-blue-alpha-20",
        lime: "bg-lime-alpha-10",
        cyan: "bg-cyan-alpha-10",
        emerald: "bg-emerald-alpha-10",
        rose: "bg-rose-alpha-10",
        fuchsia: "bg-fuchsia-alpha-10",
        violet: "bg-violet-alpha-10",
        indigo: "bg-indigo-alpha-10",
        gray: "bg-background-20",
      },
      size: {
        default: "h-1",
        small: "h-0.5",
      },
    },
    defaultVariants: { color: "primary", size: "default" },
  }
)

/** Filled part: left-to-right gradient from the 700 to the 600 shade (primary-dark base-900 to base-700). */
const progressIndicatorVariants = cva(
  "h-full rounded-full bg-linear-to-r transition-all",
  {
    variants: {
      color: {
        primary: "from-primary-700 to-primary-600",
        "primary-dark": "from-base-900 to-base-700",
        black: "from-black to-black",
        white: "from-white to-white",
        orange: "from-orange-700 to-orange-600",
        purple: "from-purple-700 to-purple-600",
        red: "from-red-700 to-red-600",
        yellow: "from-yellow-700 to-yellow-600",
        green: "from-green-700 to-green-600",
        sky: "from-sky-700 to-sky-600",
        pink: "from-pink-700 to-pink-600",
        amber: "from-amber-700 to-amber-600",
        teal: "from-teal-700 to-teal-600",
        blue: "from-blue-700 to-blue-600",
        "blue-flat": "from-blue-600 to-blue-600",
        lime: "from-lime-700 to-lime-600",
        cyan: "from-cyan-700 to-cyan-600",
        emerald: "from-emerald-700 to-emerald-600",
        rose: "from-rose-700 to-rose-600",
        fuchsia: "from-fuchsia-700 to-fuchsia-600",
        violet: "from-violet-700 to-violet-600",
        indigo: "from-indigo-700 to-indigo-600",
        gray: "from-background-50 to-background-50",
      },
    },
    defaultVariants: { color: "primary" },
  }
)

/** Figma `100%` text after the bar: Inter Bold 10/16 (Default) or 8/12 (Small), 600 shade. */
const progressValueVariants = cva("shrink-0 font-default font-bold tabular-nums", {
  variants: {
    color: {
      primary: "text-primary-600",
      "primary-dark": "text-base-700",
      black: "text-black",
      white: "text-white",
      orange: "text-orange-600",
      purple: "text-purple-600",
      red: "text-red-600",
      yellow: "text-yellow-600",
      green: "text-green-600",
      sky: "text-sky-600",
      pink: "text-pink-600",
      amber: "text-amber-600",
      teal: "text-teal-600",
      blue: "text-blue-600",
      "blue-flat": "text-blue-600",
      lime: "text-lime-600",
      cyan: "text-cyan-600",
      emerald: "text-emerald-600",
      rose: "text-rose-600",
      fuchsia: "text-fuchsia-600",
      violet: "text-violet-600",
      indigo: "text-indigo-600",
      gray: "text-base-700",
    },
    size: {
      default: "text-10 leading-16",
      small: "text-8 leading-12",
    },
  },
  defaultVariants: { color: "primary", size: "default" },
})

type ProgressContextValue = {
  color: ProgressColor
  size: "default" | "small"
}

const ProgressContext = React.createContext<ProgressContextValue>({
  color: "primary",
  size: "default",
})

/**
 * Figma Progress-Line (492:6995). `color` = Figma Style, `size` = Figma Size.
 * Children (e.g. `ProgressValue`) render after the bar, like the Figma `100%` label.
 */
function Progress({
  className,
  children,
  value,
  color = "primary",
  size = "default",
  ...props
}: Omit<ProgressPrimitive.Root.Props, "color"> & {
  color?: ProgressColor
  size?: "default" | "small"
}) {
  return (
    <ProgressContext.Provider value={{ color, size }}>
      <ProgressPrimitive.Root
        value={value}
        data-slot="progress"
        data-color={color}
        data-size={size}
        className={cn(
          "flex w-full items-center",
          size === "small" ? "gap-1" : "gap-1.5",
          className
        )}
        {...props}
      >
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
        {children}
      </ProgressPrimitive.Root>
    </ProgressContext.Provider>
  )
}

function ProgressTrack({
  className,
  color,
  size,
  ...props
}: Omit<ProgressPrimitive.Track.Props, "color"> &
  VariantProps<typeof progressTrackVariants>) {
  const context = React.useContext(ProgressContext)
  return (
    <ProgressPrimitive.Track
      className={cn(
        progressTrackVariants({
          color: color ?? context.color,
          size: size ?? context.size,
        }),
        className
      )}
      data-slot="progress-track"
      {...props}
    />
  )
}

function ProgressIndicator({
  className,
  color,
  ...props
}: Omit<ProgressPrimitive.Indicator.Props, "color"> &
  VariantProps<typeof progressIndicatorVariants>) {
  const context = React.useContext(ProgressContext)
  return (
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      className={cn(
        progressIndicatorVariants({ color: color ?? context.color }),
        className
      )}
      {...props}
    />
  )
}

function ProgressLabel({ className, ...props }: ProgressPrimitive.Label.Props) {
  return (
    <ProgressPrimitive.Label
      className={cn("font-default text-12 leading-20 font-bold text-base-800", className)}
      data-slot="progress-label"
      {...props}
    />
  )
}

/** Figma `100%` label of Progress-Line; shows the formatted value (e.g. "75%"). */
function ProgressValue({
  className,
  color,
  size,
  ...props
}: Omit<ProgressPrimitive.Value.Props, "color"> &
  VariantProps<typeof progressValueVariants>) {
  const context = React.useContext(ProgressContext)
  return (
    <ProgressPrimitive.Value
      className={cn(
        progressValueVariants({
          color: color ?? context.color,
          size: size ?? context.size,
        }),
        className
      )}
      data-slot="progress-value"
      {...props}
    />
  )
}

/** Figma Progress-Dot (12176:1600): 8px round thumb, Type = Default | Hover | Active. */
const progressDotVariants = cva(
  "inline-block shrink-0 rounded-full outline -outline-offset-1",
  {
    variants: {
      state: {
        default: "bg-background-0 outline-primary-600",
        hover: "bg-primary-600 outline-primary-600",
        active: "bg-primary-800 outline-primary-800",
      },
      size: {
        default: "size-2",
        small: "size-1.5",
      },
    },
    defaultVariants: { state: "default", size: "default" },
  }
)

function ProgressDot({
  className,
  state,
  size,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof progressDotVariants>) {
  return (
    <span
      data-slot="progress-dot"
      data-state={state ?? "default"}
      className={cn(progressDotVariants({ state, size }), className)}
      {...props}
    />
  )
}

export {
  Progress,
  ProgressTrack,
  ProgressIndicator,
  ProgressLabel,
  ProgressValue,
  ProgressDot,
  progressTrackVariants,
  progressIndicatorVariants,
  progressValueVariants,
  progressDotVariants,
}
