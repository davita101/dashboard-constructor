import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Figma Status (459:14, page 9463:285753): 8px dot.
// Type=Color Center: colored dot with a white ring. Type=Color Border: white dot with a colored ring.
// Figma strokes are centered (export: 8px box grows by the weight), so the outline sits half in, half out.
const statusVariants = cva(
  "inline-block size-2 shrink-0 rounded-full outline-solid",
  {
    variants: {
      type: {
        center: "bg-(--status) outline-background-0",
        border: "bg-background-0 outline-(color:--status)",
      },
      border: {
        "0": "outline-0",
        "1": "outline-1 outline-offset-[-0.5px]",
        "2": "outline-2 -outline-offset-1",
        "3": "outline-3 outline-offset-[-1.5px]",
      },
      color: {
        primary: "[--status-shadow:var(--shadow-primary)] [--status:var(--color-primary-600)]",
        online: "[--status-shadow:var(--shadow-success)] [--status:var(--color-success-500)]",
        offline: "[--status-shadow:var(--shadow-base)] [--status:var(--color-base-400)]",
        work: "[--status-shadow:var(--shadow-yellow)] [--status:var(--color-yellow-400)]",
        busy: "[--status-shadow:var(--shadow-danger)] [--status:var(--color-danger-500)]",
        orange: "[--status-shadow:var(--shadow-orange)] [--status:var(--color-orange-600)]",
        purple: "[--status-shadow:var(--shadow-purple)] [--status:var(--color-purple-600)]",
        yellow: "[--status-shadow:var(--shadow-yellow)] [--status:var(--color-yellow-600)]",
        green: "[--status-shadow:var(--shadow-green)] [--status:var(--color-green-600)]",
        sky: "[--status-shadow:var(--shadow-sky)] [--status:var(--color-sky-600)]",
        pink: "[--status-shadow:var(--shadow-pink)] [--status:var(--color-pink-600)]",
        red: "[--status-shadow:var(--shadow-red)] [--status:var(--color-red-600)]",
        gray: "[--status-shadow:var(--shadow-base)] [--status:var(--color-base-200)]",
      },
    },
    compoundVariants: [
      // Color Border has no Border=0 in Figma: fall back to the 1px ring
      { type: "border", border: "0", className: "outline-1 outline-offset-[-0.5px]" },
      // Faint drop shadow from the export: neutral under a white ring, tinted under a colored ring
      { type: "center", border: ["1", "2", "3"], className: "shadow-[0_1px_2px_0_var(--shadow-base)]" },
      { type: "border", className: "shadow-[0_1px_2px_0_var(--status-shadow)]" },
    ],
    defaultVariants: {
      type: "center",
      border: "0",
      color: "online",
    },
  }
)

type StatusColor = NonNullable<VariantProps<typeof statusVariants>["color"]>
type StatusType = NonNullable<VariantProps<typeof statusVariants>["type"]>
type StatusBorder = NonNullable<VariantProps<typeof statusVariants>["border"]>

/** Decorative unless given an `aria-label` (then announced as an image). */
function Status({
  className,
  type = "center",
  border = "0",
  color = "online",
  ...props
}: Omit<React.ComponentProps<"span">, "color"> & VariantProps<typeof statusVariants>) {
  const labelled = props["aria-label"] != null
  return (
    <span
      data-slot="status"
      data-type={type}
      data-border={border}
      data-color={color}
      role={labelled ? "img" : undefined}
      aria-hidden={labelled ? undefined : true}
      className={cn(statusVariants({ type, border, color }), className)}
      {...props}
    />
  )
}

export { Status, statusVariants, type StatusColor, type StatusType, type StatusBorder }
