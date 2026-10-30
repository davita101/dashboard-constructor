import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

type SpinnerSize = "16" | "20" | "32" | "36" | "48"

/**
 * Ring width per size, measured from Figma exports (innerRadius ≈ 0.8, so 10% of the diameter;
 * Extra Small 20 is ≈ 12.5%). `16` is not in Figma: the inline size for Buttons (shadcn default).
 */
const RING_WIDTH: Record<SpinnerSize, number> = {
  "16": 2,
  "20": 2.5,
  "32": 3.2,
  "36": 3.6,
  "48": 4.8,
}

/** Visible arc incl. round caps (Figma Load ellipse): 180°, from 7:30 clockwise over the top to 1:30. */
const ARC_SWEEP = 180
const ARC_START = 225

const spinnerVariants = cva(
  "shrink-0 animate-spin motion-reduce:animate-[spin_3s_linear_infinite]",
  {
    variants: {
      size: {
        "16": "size-4",
        "20": "size-5",
        "32": "size-8",
        "36": "size-9",
        "48": "size-12",
      },
    },
    defaultVariants: { size: "16" },
  }
)

/** Figma `Base` ring (primary-500 at 15%) and `Load` arc (primary-600). `current` follows the text color (Buttons). */
const spinnerTrackVariants = cva("fill-none", {
  variants: {
    color: {
      primary: "stroke-primary-alpha-15",
      current: "stroke-current opacity-15",
    },
  },
  defaultVariants: { color: "primary" },
})

const spinnerArcVariants = cva("fill-none", {
  variants: {
    color: {
      primary: "stroke-primary-600",
      current: "stroke-current",
    },
  },
  defaultVariants: { color: "primary" },
})

type SpinnerColor = NonNullable<VariantProps<typeof spinnerArcVariants>["color"]>

/**
 * Figma Loader ring frame (`Large (48)` … `Extra Small (20)`): a full Base ring with a round-capped
 * Load arc on top, spinning clockwise. Drawn like `ProgressCircle` (SVG circle stroke + dasharray).
 */
function Spinner({
  className,
  size = "16",
  color = "primary",
  ...props
}: Omit<React.ComponentProps<"svg">, "color"> & {
  size?: SpinnerSize
  color?: SpinnerColor
}) {
  const px = Number(size)
  const ring = RING_WIDTH[size]
  const center = px / 2
  const radius = (px - ring) / 2
  // Round caps add half the ring width at each end; shorten the dash so the visible sweep stays 180°.
  const capDeg = (ring / 2 / radius) * (180 / Math.PI)
  const dash = ARC_SWEEP - 2 * capDeg
  // SVG strokes start at 3 o'clock; Figma angles here are clockwise from 12 o'clock.
  const rotate = ARC_START + capDeg - 90
  return (
    <svg
      data-slot="spinner"
      data-size={size}
      data-color={color}
      role="status"
      aria-label="Loading"
      viewBox={`0 0 ${px} ${px}`}
      className={cn(spinnerVariants({ size }), className)}
      {...props}
    >
      <circle
        data-slot="spinner-track"
        cx={center}
        cy={center}
        r={radius}
        strokeWidth={ring}
        className={spinnerTrackVariants({ color })}
      />
      <circle
        data-slot="spinner-arc"
        cx={center}
        cy={center}
        r={radius}
        strokeWidth={ring}
        strokeLinecap="round"
        pathLength={360}
        strokeDasharray={`${dash} 360`}
        transform={`rotate(${rotate} ${center} ${center})`}
        className={spinnerArcVariants({ color })}
      />
    </svg>
  )
}

export { Spinner, spinnerVariants, type SpinnerSize, type SpinnerColor }
