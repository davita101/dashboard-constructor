import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// Figma Navigate Head page (8967:25852): Head-01 … Head-19, each Desktop (Tablet) 1128 and Mobile 320.
// Head = optional cover, body (groups of title text, links, actions) and an optional divider line.

const navigateHeadVariants = cva("group/head flex w-full flex-col font-default tracking-default", {
  variants: {
    size: {
      desktop: "",
      mobile: "",
    },
    // Figma pads the body 24px above the bottom Line (Head-02, 03, 09 …).
    divider: {
      true: "gap-6",
      false: "",
    },
  },
  defaultVariants: { size: "desktop", divider: false },
})

type NavigateHeadSize = NonNullable<VariantProps<typeof navigateHeadVariants>["size"]>

/** Figma Head-NN root. `divider` adds the bottom Line (Separator). */
function NavigateHead({
  className,
  size = "desktop",
  divider = false,
  children,
  ...props
}: React.ComponentProps<"header"> & { size?: NavigateHeadSize; divider?: boolean }) {
  return (
    <header
        data-slot="navigate-head"
        data-size={size}
        className={cn(navigateHeadVariants({ size, divider }), className)}
        {...props}
      >
        {children}
        {divider && <Separator className="bg-background-100" />}
      </header>
  )
}

const navigateHeadBodyVariants = cva(
  "flex flex-row items-center justify-between gap-4 group-data-[size=mobile]/head:flex-col group-data-[size=mobile]/head:items-stretch",
  {
    variants: {
      // Heads whose desktop row top-aligns text and actions.
      align: {
        center: "",
        start: "items-start",
      },
    },
    defaultVariants: { align: "center" },
  }
)

/** Row on Desktop, column on Mobile (reads data-size from the parent NavigateHead). */
function NavigateHeadBody({
  className,
  align,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof navigateHeadBodyVariants>) {
  return (
    <div
      data-slot="navigate-head-body"
      className={cn(navigateHeadBodyVariants({ align }), className)}
      {...props}
    />
  )
}

const navigateHeadGroupVariants = cva("flex min-w-0", {
  variants: {
    direction: {
      row: "flex-row items-center",
      col: "flex-col items-start",
    },
    gap: {
      2: "gap-2",
      3: "gap-3",
      4: "gap-4",
      5: "gap-5",
      6: "gap-6",
      8: "gap-8",
    },
    wrap: {
      true: "flex-wrap",
      false: "",
    },
  },
  defaultVariants: { direction: "row", gap: 3, wrap: false },
})

/** Figma "Group" frame: a row or column of head parts. */
function NavigateHeadGroup({
  className,
  direction,
  gap,
  wrap,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof navigateHeadGroupVariants>) {
  return (
    <div
      data-slot="navigate-head-group"
      className={cn(navigateHeadGroupVariants({ direction, gap, wrap }), className)}
      {...props}
    />
  )
}

const navigateHeadTitleVariants = cva("text-base-900", {
  variants: {
    size: {
      "12": "text-12 leading-20 font-semibold",
      "14": "text-14 leading-24 font-semibold",
      "14-bold": "text-14 leading-24 font-bold",
      "16": "text-16 leading-24 font-semibold",
      "18": "text-18 leading-28 font-semibold",
      "20": "text-20 leading-28 font-semibold",
    },
    tone: {
      default: "text-base-900",
      soft: "text-base-800 font-bold",
    },
  },
  defaultVariants: { size: "16", tone: "default" },
})

/** Figma "Heading" / "Heading Page" / "Name Project" text. */
function NavigateHeadTitle({
  className,
  size,
  tone,
  ...props
}: React.ComponentProps<"h2"> & VariantProps<typeof navigateHeadTitleVariants>) {
  return (
    <h2
      data-slot="navigate-head-title"
      className={cn(navigateHeadTitleVariants({ size, tone }), className)}
      {...props}
    />
  )
}

const navigateHeadTextVariants = cva("text-12 leading-20 font-semibold text-base-500", {
  variants: {
    size: {
      "12": "text-12 leading-20",
      "13": "text-13 leading-24",
    },
  },
  defaultVariants: { size: "12" },
})

/** Figma "Second Line" / "Additional Text". */
function NavigateHeadText({
  className,
  size,
  ...props
}: React.ComponentProps<"p"> & VariantProps<typeof navigateHeadTextVariants>) {
  return (
    <p
      data-slot="navigate-head-text"
      className={cn(navigateHeadTextVariants({ size }), className)}
      {...props}
    />
  )
}

/** Figma "Links" slot: row of Link items. */
function NavigateHeadLinks({
  className,
  gap = "6",
  ...props
}: React.ComponentProps<"nav"> & { gap?: "6" | "8" }) {
  return (
    <nav
      data-slot="navigate-head-links"
      className={cn("flex items-center", gap === "8" ? "gap-8" : "gap-6", className)}
      {...props}
    />
  )
}

/** Figma Head-07 cover: 186px high image bleeding to the edges. */
function NavigateHeadCover({
  className,
  src,
  alt = "",
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & { src?: string; alt?: string }) {
  return (
    <div
      data-slot="navigate-head-cover"
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      className={cn("h-46.5 w-full shrink-0 bg-background-50 bg-cover bg-center", className)}
      style={src ? { backgroundImage: `url(${src})` } : undefined}
      {...props}
    />
  )
}

export {
  NavigateHead,
  NavigateHeadBody,
  NavigateHeadGroup,
  NavigateHeadTitle,
  NavigateHeadText,
  NavigateHeadLinks,
  NavigateHeadCover,
  navigateHeadVariants,
  navigateHeadBodyVariants,
  navigateHeadGroupVariants,
  navigateHeadTitleVariants,
  navigateHeadTextVariants,
}
export type { NavigateHeadSize }
