"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "@base-ui/react/progress"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import type { ProgressColor } from "@/components/ui/progress-colors"

/** Arc stroke (Figma stroke weight unreadable; 2px measured from exports). */
const STROKE = 2

/** Progress arc: the 600 shade (primary-dark base-900, Black black, White white). */
const progressArcVariants = cva("fill-none transition-[stroke-dasharray]", {
  variants: {
    color: {
        primary: "stroke-primary-600",
        "primary-dark": "stroke-base-900",
        black: "stroke-black",
        white: "stroke-white",
        orange: "stroke-orange-600",
        purple: "stroke-purple-600",
        red: "stroke-red-600",
        yellow: "stroke-yellow-600",
        green: "stroke-green-600",
        sky: "stroke-sky-600",
        pink: "stroke-pink-600",
        amber: "stroke-amber-600",
        teal: "stroke-teal-600",
        blue: "stroke-blue-600",
        "blue-flat": "stroke-blue-600",
        lime: "stroke-lime-600",
        cyan: "stroke-cyan-600",
        emerald: "stroke-emerald-600",
        rose: "stroke-rose-600",
        fuchsia: "stroke-fuchsia-600",
        violet: "stroke-violet-600",
        indigo: "stroke-indigo-600",
        gray: "stroke-background-50",
    },
  },
  defaultVariants: { color: "primary" },
})

/** Ring behind the arc: Figma root stroke, the 500 shade at 10% (primary-dark base-100, Black and White 30%). */
const progressArcTrackVariants = cva("fill-none", {
  variants: {
    color: {
        primary: "stroke-primary-alpha-10",
        "primary-dark": "stroke-base-100",
        black: "stroke-black-alpha-30",
        white: "stroke-white-alpha-30",
        orange: "stroke-orange-alpha-10",
        purple: "stroke-purple-alpha-10",
        red: "stroke-red-alpha-10",
        yellow: "stroke-yellow-alpha-10",
        green: "stroke-green-alpha-10",
        sky: "stroke-sky-alpha-10",
        pink: "stroke-pink-alpha-10",
        amber: "stroke-amber-alpha-10",
        teal: "stroke-teal-alpha-10",
        blue: "stroke-blue-alpha-10",
        "blue-flat": "stroke-blue-alpha-20",
        lime: "stroke-lime-alpha-10",
        cyan: "stroke-cyan-alpha-10",
        emerald: "stroke-emerald-alpha-10",
        rose: "stroke-rose-alpha-10",
        fuchsia: "stroke-fuchsia-alpha-10",
        violet: "stroke-violet-alpha-10",
        indigo: "stroke-indigo-alpha-10",
        gray: "stroke-background-20",
    },
  },
  defaultVariants: { color: "primary" },
})

/** Value and description text: Inter Bold, the 700 shade. */
const progressArcTextVariants = cva("relative font-default font-bold", {
  variants: {
    color: {
        primary: "text-primary-700",
        "primary-dark": "text-base-900",
        black: "text-black",
        white: "text-white",
        orange: "text-orange-700",
        purple: "text-purple-700",
        red: "text-red-700",
        yellow: "text-yellow-700",
        green: "text-green-700",
        sky: "text-sky-700",
        pink: "text-pink-700",
        amber: "text-amber-700",
        teal: "text-teal-700",
        blue: "text-blue-700",
        "blue-flat": "text-blue-600",
        lime: "text-lime-700",
        cyan: "text-cyan-700",
        emerald: "text-emerald-700",
        rose: "text-rose-700",
        fuchsia: "text-fuchsia-700",
        violet: "text-violet-700",
        indigo: "text-indigo-700",
        gray: "text-base-700",
    },
  },
  defaultVariants: { color: "primary" },
})

type ProgressCircleSize = "16" | "24" | "36" | "48" | "56" | "72" | "128"
type ProgressHalfSize = "20" | "24" | "32" | "40" | "48" | "56" | "60" | "72" | "96" | "128"

/** Figma Progress-Circular Size: Micro 16, Extra Small 24, Small 36, Default 48, Large 56, Extra Large 72, 2 Extra Large 128. */
const progressCircleVariants = cva(
  "relative inline-flex shrink-0 flex-col items-center justify-center text-center",
  {
    variants: {
      size: {
        "16": "size-4",
        "24": "size-6",
        "36": "size-9",
        "48": "size-12",
        "56": "size-14",
        "72": "size-18",
        "128": "size-32 gap-2",
      },
    },
    defaultVariants: { size: "48" },
  }
)

/** Figma Progress-Circle-Half Size (width; height is half; 56 from Chart-Half). Text sits on the bottom edge. */
const progressHalfVariants = cva(
  "relative inline-flex shrink-0 flex-col items-center justify-end text-center",
  {
    variants: {
      size: {
        "20": "h-2.5 w-5",
        "24": "h-3 w-6",
        "32": "h-4 w-8",
        "40": "h-5 w-10",
        "48": "h-6 w-12",
        "56": "h-7 w-14",
        "60": "h-7.5 w-15",
        "72": "h-9 w-18",
        "96": "h-12 w-24",
        "128": "h-16 w-32",
      },
    },
    defaultVariants: { size: "128" },
  }
)

/** Figma `100%` text per size; hidden where Figma has none (Circular 16/24, Half 20/24). */
const progressArcValueVariants = cva("tabular-nums", {
  variants: {
    size: {
      "circle-16": "hidden",
      "circle-24": "hidden",
      "circle-36": "text-8 leading-12",
      "circle-48": "text-11 leading-20",
      "circle-56": "text-11 leading-20",
      "circle-72": "text-11 leading-20",
      "circle-128": "text-18 leading-28",
      "half-20": "hidden",
      "half-24": "hidden",
      "half-32": "text-8 leading-12",
      "half-40": "text-8 leading-12",
      "half-48": "text-8 leading-12",
      "half-56": "hidden",
      "half-60": "text-10 leading-16",
      "half-72": "text-10 leading-16",
      "half-96": "text-12 leading-20",
      "half-128": "text-18 leading-28",
    },
  },
})

/** Figma `Description` text; only the sizes that have one in Figma show it. */
const progressArcLabelVariants = cva("whitespace-nowrap", {
  variants: {
    size: {
      "circle-16": "hidden",
      "circle-24": "hidden",
      "circle-36": "hidden",
      "circle-48": "hidden",
      "circle-56": "hidden",
      "circle-72": "text-8 leading-12",
      "circle-128": "text-10 leading-16",
      "half-20": "hidden",
      "half-24": "hidden",
      "half-32": "hidden",
      "half-40": "hidden",
      "half-48": "hidden",
      "half-56": "hidden",
      "half-60": "hidden",
      "half-72": "text-8 leading-12",
      "half-96": "text-10 leading-16",
      "half-128": "text-10 leading-16",
    },
  },
})

type ArcTextSize = NonNullable<VariantProps<typeof progressArcValueVariants>["size"]>

const ProgressArcContext = React.createContext<{
  color: ProgressColor
  textSize: ArcTextSize
}>({ color: "primary", textSize: "circle-48" })

function toPercent(value: number | null | undefined, max: number) {
  return Math.min(100, Math.max(0, ((value ?? 0) / max) * 100))
}

type ProgressArcProps<Size> = Omit<ProgressPrimitive.Root.Props, "color"> & {
  color?: ProgressColor
  size?: Size
}

/**
 * Figma Progress-Circular (494:102). The arc starts at 12 o'clock and runs clockwise.
 * Children: `ProgressArcValue` and `ProgressArcLabel`.
 */
function ProgressCircle({
  className,
  children,
  value,
  max = 100,
  color = "primary",
  size = "48",
  ...props
}: ProgressArcProps<ProgressCircleSize>) {
  const px = Number(size)
  const center = px / 2
  const radius = (px - STROKE) / 2
  return (
    <ProgressArcContext.Provider value={{ color, textSize: `circle-${size}` }}>
      <ProgressPrimitive.Root
        value={value}
        max={max}
        data-slot="progress-circle"
        data-color={color}
        data-size={size}
        className={cn(progressCircleVariants({ size }), className)}
        {...props}
      >
        <svg aria-hidden viewBox={`0 0 ${px} ${px}`} className="absolute inset-0 size-full -rotate-90">
          <circle
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={STROKE}
            className={progressArcTrackVariants({ color })}
          />
          <circle
            data-slot="progress-circle-indicator"
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={STROKE}
            pathLength={100}
            strokeDasharray={`${toPercent(value, max)} 100`}
            className={progressArcVariants({ color })}
          />
        </svg>
        {children}
      </ProgressPrimitive.Root>
    </ProgressArcContext.Provider>
  )
}

/**
 * Figma Progress-Circle-Half (12184:1922). The arc runs from 9 o'clock over the top to 3 o'clock.
 * Children: `ProgressArcValue` and `ProgressArcLabel`, bottom-aligned.
 */
function ProgressHalf({
  className,
  children,
  value,
  max = 100,
  color = "primary",
  size = "128",
  ...props
}: ProgressArcProps<ProgressHalfSize>) {
  const px = Number(size)
  const half = px / 2
  const radius = (px - STROKE) / 2
  const path = `M ${STROKE / 2} ${half} A ${radius} ${radius} 0 0 1 ${px - STROKE / 2} ${half}`
  return (
    <ProgressArcContext.Provider value={{ color, textSize: `half-${size}` }}>
      <ProgressPrimitive.Root
        value={value}
        max={max}
        data-slot="progress-half"
        data-color={color}
        data-size={size}
        className={cn(progressHalfVariants({ size }), className)}
        {...props}
      >
        <svg aria-hidden viewBox={`0 0 ${px} ${half}`} className="absolute inset-0 size-full">
          <path d={path} strokeWidth={STROKE} className={progressArcTrackVariants({ color })} />
          <path
            data-slot="progress-half-indicator"
            d={path}
            strokeWidth={STROKE}
            pathLength={100}
            strokeDasharray={`${toPercent(value, max)} 100`}
            className={progressArcVariants({ color })}
          />
        </svg>
        {children}
      </ProgressPrimitive.Root>
    </ProgressArcContext.Provider>
  )
}

/** Figma `100%` text inside a Circular / Half: the formatted value (e.g. "78%"). */
function ProgressArcValue({ className, ...props }: ProgressPrimitive.Value.Props) {
  const { color, textSize } = React.useContext(ProgressArcContext)
  return (
    <ProgressPrimitive.Value
      data-slot="progress-arc-value"
      className={cn(
        progressArcTextVariants({ color }),
        progressArcValueVariants({ size: textSize }),
        className
      )}
      {...props}
    />
  )
}

/** Figma `Description` text inside a Circular / Half. */
function ProgressArcLabel({ className, ...props }: ProgressPrimitive.Label.Props) {
  const { color, textSize } = React.useContext(ProgressArcContext)
  return (
    <ProgressPrimitive.Label
      data-slot="progress-arc-label"
      className={cn(
        progressArcTextVariants({ color }),
        progressArcLabelVariants({ size: textSize }),
        className
      )}
      {...props}
    />
  )
}

export {
  ProgressCircle,
  ProgressHalf,
  ProgressArcValue,
  ProgressArcLabel,
  progressCircleVariants,
  progressHalfVariants,
  progressArcVariants,
  progressArcTrackVariants,
  type ProgressCircleSize,
  type ProgressHalfSize,
}
