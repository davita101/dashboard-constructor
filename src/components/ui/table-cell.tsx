import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { Progress, ProgressValue } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

// Figma Cells UI (Tables) page 5026:42162: 38 cell sets, all on one frame: Size 60 / 48 / 40 / 32
// × Style Default / Border / Head & Select (+ Head & Select Primary for text cells).
// TableCell is the frame; the other parts are slots (text pair, icon, media, chart, progress).
// Inner controls (Avatar, Badge, Button, Checkbox, Radio, Switch, Counter, Input, Tabs,
// ProgressCircle, ButtonGroup) are composed from their own ui files inside a TableCell.

type TableCellSize = "60" | "48" | "40" | "32"

// Frame: fixed height per size, horizontal padding per size (padding="loose" = text/checkbox
// cells, which Figma insets 20 / 16 / 12 / 8). Border = 1px bottom stroke, Head = fill + stroke.
const tableCellVariants = cva(
  "group/cell relative inline-flex shrink-0 items-center font-default tracking-default",
  {
    variants: {
      size: {
        "60": "h-15 gap-3",
        "48": "h-12 gap-3",
        "40": "h-10 gap-3",
        "32": "h-8 gap-2",
      },
      style: {
        default: "",
        border: "shadow-[inset_0_-1px_0_0_var(--background-100)]",
        head: "bg-background-20 shadow-[inset_0_-1px_0_0_var(--background-100)]",
      },
      padding: {
        default: "",
        loose: "",
        none: "",
      },
      align: {
        left: "justify-start",
        center: "justify-center",
      },
    },
    compoundVariants: [
      { padding: "default", size: ["60", "48"], className: "px-3" },
      { padding: "default", size: "40", className: "px-2" },
      { padding: "default", size: "32", className: "px-1" },
      { padding: "loose", size: "60", className: "px-5" },
      { padding: "loose", size: "48", className: "px-4" },
      { padding: "loose", size: "40", className: "px-3" },
      { padding: "loose", size: "32", className: "px-2" },
    ],
    defaultVariants: { size: "60", style: "default", padding: "default", align: "left" },
  }
)

function TableCell({
  className,
  size = "60",
  style = "default",
  padding = "default",
  align = "left",
  ...props
}: Omit<React.ComponentProps<"div">, "style"> & VariantProps<typeof tableCellVariants>) {
  return (
    <div
      role="cell"
      data-slot="table-cell"
      data-size={size}
      data-style={style}
      className={cn(tableCellVariants({ size, style, padding, align }), className)}
      {...props}
    />
  )
}

// Heading + description: stacked at 60 / 48, one line at 40 / 32 (Figma Content frame).
function TableCellContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="table-cell-content"
      className={cn(
        "flex min-w-0 flex-col justify-center py-3 group-data-[size=32]/cell:flex-row group-data-[size=32]/cell:items-center group-data-[size=32]/cell:gap-2 group-data-[size=32]/cell:py-0 group-data-[size=40]/cell:flex-row group-data-[size=40]/cell:items-center group-data-[size=40]/cell:gap-2 group-data-[size=40]/cell:py-0",
        className
      )}
      {...props}
    />
  )
}

// Heading text: 11/20 bold, 10/16 at Size 32. tone: default base-800, link blue, muted base-600,
// soft base-400 (Text-Cell headings); primary / primary-soft are the Text-Cell-Primary colors.
const tableCellTextVariants = cva(
  "whitespace-nowrap font-bold group-data-[size=32]/cell:text-10 group-data-[size=32]/cell:leading-16 text-11 leading-20",
  {
    variants: {
      tone: {
        default: "text-base-800",
        link: "text-primary-600",
        muted: "text-base-600",
        soft: "text-base-400",
        primary: "text-primary-600",
        "primary-soft": "text-primary-alpha-70",
      },
    },
    defaultVariants: { tone: "default" },
  }
)

function TableCellTitle({
  className,
  tone,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof tableCellTextVariants>) {
  return (
    <span data-slot="table-cell-title" className={cn(tableCellTextVariants({ tone }), className)} {...props} />
  )
}

function TableCellDescription({
  className,
  tone = "muted",
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof tableCellTextVariants>) {
  return (
    <span
      data-slot="table-cell-description"
      className={cn(tableCellTextVariants({ tone }), "text-10 leading-16", className)}
      {...props}
    />
  )
}

// Single-color icon as a CSS mask: 20px at Size 60 / 48 / 40, 16px at Size 32 (Figma 20 / 16).
const tableCellIconVariants = cva("shrink-0 bg-current mask-contain mask-center mask-no-repeat", {
  variants: {
    tone: {
      default: "text-base-500",
      soft: "text-base-300",
      primary: "text-primary-600",
    },
  },
  defaultVariants: { tone: "default" },
})

function TableCellIcon({
  src = "/icons/material-default-icon.svg",
  tone,
  className,
  style,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof tableCellIconVariants> & { src?: string }) {
  return (
    <span
      data-slot="table-cell-icon"
      aria-hidden
      className={cn(
        tableCellIconVariants({ tone }),
        "size-5 group-data-[size=32]/cell:size-4",
        className
      )}
      style={{ maskImage: `url(${src})`, ...style }}
      {...props}
    />
  )
}

// Sort Up / Sort Down: two stacked chevrons (Figma frames carry no readable artwork).
function TableCellSort({
  direction,
  className,
  ...props
}: React.ComponentProps<"span"> & { direction?: "up" | "down" }) {
  return (
    <span
      data-slot="table-cell-sort"
      data-direction={direction}
      aria-hidden
      className={cn("flex size-4 shrink-0 flex-col items-center justify-center text-base-400", className)}
      {...props}
    >
      <span
        className={cn("size-2 bg-current mask-contain mask-center mask-no-repeat rotate-180", direction === "up" && "text-base-800")}
        style={{ maskImage: "url(/icons/material-expand-more.svg)" }}
      />
      <span
        className={cn("-mt-1 size-2 bg-current mask-contain mask-center mask-no-repeat", direction === "down" && "text-base-800")}
        style={{ maskImage: "url(/icons/material-expand-more.svg)" }}
      />
    </span>
  )
}

// Rectangular thumbnail (Image-Cell, Image-Button-Cell): r6, 60×44 at Size 60 down to 32×24.
function TableCellImage({
  src,
  alt = "",
  className,
  style,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> & { src: string; alt?: string }) {
  return (
    <span
      data-slot="table-cell-image"
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      className={cn(
        "block shrink-0 rounded-r6 bg-base-100 bg-cover bg-center h-11 w-15 group-data-[size=48]/cell:h-9 group-data-[size=48]/cell:w-12 group-data-[size=40]/cell:h-8 group-data-[size=40]/cell:w-10 group-data-[size=32]/cell:h-6 group-data-[size=32]/cell:w-8",
        className
      )}
      style={{ backgroundImage: `url(${src})`, ...style }}
      {...props}
    />
  )
}

// Round brand / flag / crypto / logotype tile: image artwork on a background-0 disc.
function TableCellLogo({
  src,
  alt = "",
  className,
  style,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> & { src: string; alt?: string }) {
  return (
    <span
      data-slot="table-cell-logo"
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      className={cn(
        "block size-8 shrink-0 rounded-full bg-background-0 bg-contain bg-center bg-no-repeat group-data-[size=48]/cell:size-7 group-data-[size=40]/cell:size-6 group-data-[size=32]/cell:size-5",
        className
      )}
      style={{ backgroundImage: `url(${src})`, ...style }}
      {...props}
    />
  )
}

// Chart-Cell: 52×20 line sparkline in primary-600.
function TableCellChart({
  points = [4, 12, 8, 15, 6, 11, 3, 9, 14],
  className,
  ...props
}: Omit<React.ComponentProps<"svg">, "points"> & { points?: number[] }) {
  const step = 52 / (points.length - 1)
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)} ${20 - p}`).join(" ")
  return (
    <svg
      data-slot="table-cell-chart"
      viewBox="0 0 52 20"
      role="img"
      aria-label="Chart"
      className={cn("h-5 w-13 shrink-0 fill-none stroke-primary-600 stroke-[1.5]", className)}
      {...props}
    >
      <path d={d} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Progress-Horizontal-Cell: 200px line with the value at its end.
function TableCellProgress({ value, className, ...props }: React.ComponentProps<typeof Progress>) {
  return (
    <Progress
      data-slot="table-cell-progress"
      size="small"
      value={value}
      className={cn("w-50", className)}
      {...props}
    >
      <ProgressValue />
    </Progress>
  )
}

export {
  TableCell,
  TableCellContent,
  TableCellTitle,
  TableCellDescription,
  TableCellIcon,
  TableCellSort,
  TableCellImage,
  TableCellLogo,
  TableCellChart,
  TableCellProgress,
  tableCellVariants,
  tableCellTextVariants,
  type TableCellSize,
}
