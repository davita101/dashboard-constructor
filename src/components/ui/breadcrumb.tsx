import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Figma Breadcrumbs page (5522:25332): Breadcrumb-Group (list), Breadcrumb-Component (item),
// Breadcrumb-Arrow-Component (separator). Items read the list size through `group/breadcrumb`.
const breadcrumbListVariants = cva(
  "group/breadcrumb flex flex-wrap items-center gap-3 font-default tracking-default font-bold wrap-break-word",
  {
    variants: {
      size: {
        lg: "text-11 leading-20",
        default: "text-11 leading-20",
        sm: "text-10 leading-16",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

type BreadcrumbSize = NonNullable<VariantProps<typeof breadcrumbListVariants>["size"]>

// Gap between the icon and the label: 12 / 10 / 8
const itemContent =
  "inline-flex items-center gap-2.5 group-data-[size=lg]/breadcrumb:gap-3 group-data-[size=sm]/breadcrumb:gap-2"

function Breadcrumb({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      aria-label="breadcrumb"
      data-slot="breadcrumb"
      className={cn(className)}
      {...props}
    />
  )
}

function BreadcrumbList({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"ol"> & VariantProps<typeof breadcrumbListVariants>) {
  return (
    <ol
      data-slot="breadcrumb-list"
      data-size={size}
      className={cn(breadcrumbListVariants({ size }), className)}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center", className)}
      {...props}
    />
  )
}

/** State=Default / Hover / Disabled (`aria-disabled`, no href). */
function BreadcrumbLink({
  className,
  render,
  ...props
}: useRender.ComponentProps<"a">) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        className: cn(
          itemContent,
          "group/breadcrumb-link rounded-r4 text-base-700 transition-colors outline-none hover:text-primary-600 focus-visible:ring-3 focus-visible:ring-primary-alpha-30 aria-disabled:pointer-events-none aria-disabled:text-base-200",
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "breadcrumb-link",
    },
  })
}

/** State=Selected: the current page. */
function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn(itemContent, "text-primary-600", className)}
      {...props}
    />
  )
}

const iconBadgeSize = {
  lg: "square-32",
  default: "square-24",
  sm: "square-20",
} as const

/**
 * Figma Badge-Icon-Pilled before the label: a Base badge, or solid Primary on the current page.
 * `icon` is the URL of a single-color SVG, painted as a mask so the badge sets its color.
 */
function BreadcrumbIcon({
  className,
  size = "default",
  active = false,
  icon = "/icons/breadcrumb-dot.svg",
  style,
  ...props
}: Omit<React.ComponentProps<"span">, "children" | "color"> & {
  size?: BreadcrumbSize
  active?: boolean
  icon?: string
}) {
  return (
    <Badge
      data-slot="breadcrumb-icon"
      aria-hidden
      variant={active ? "solid" : "base"}
      color="primary"
      size={iconBadgeSize[size]}
      className={cn("px-0 group-aria-disabled/breadcrumb-link:opacity-30", className)}
      style={{ "--breadcrumb-icon": `url(${icon})`, ...style } as React.CSSProperties}
      {...props}
    >
      <span
        className={cn(
          "size-(--badge-icon) mask-(--breadcrumb-icon) mask-contain mask-center mask-no-repeat",
          active ? "bg-current" : "bg-base-500"
        )}
      />
    </Badge>
  )
}

const breadcrumbSeparatorVariants = cva(
  "size-4 shrink-0 mask-[url(/icons/material-chevron-right.svg)] mask-contain mask-center mask-no-repeat",
  {
    variants: {
      variant: {
        default: "bg-base-500",
        active: "bg-primary-600",
        disabled: "bg-base-200 opacity-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function BreadcrumbSeparator({
  children,
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"li"> & VariantProps<typeof breadcrumbSeparatorVariants>) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("inline-flex items-center", className)}
      {...props}
    >
      {children ?? <span className={breadcrumbSeparatorVariants({ variant })} />}
    </li>
  )
}

function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn("flex size-5 items-center justify-center", className)}
      {...props}
    >
      <span className="size-4 bg-base-500 mask-[url(/icons/material-more-horiz.svg)] mask-contain mask-center mask-no-repeat" />
      <span className="sr-only">More</span>
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbIcon,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  breadcrumbListVariants,
  breadcrumbSeparatorVariants,
  type BreadcrumbSize,
}
