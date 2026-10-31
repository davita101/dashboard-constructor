import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { Button, ButtonIcon } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Figma Pagination page (9232:577001): Pagination-01 (Previous / pages / Next),
// Pagination-02 (chevron + pages + Load More + chevron), Pagination-03 (Page select + Previous / Next).
// Every control is an Outline-Button size 32. The nav is a container: the row layout switches to the
// stacked Mobile layout below @2xl (Desktop/Tablet >= 672px, Mobile 320px).

function Pagination({
  className,
  children,
  ...props
}: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className="@container w-full"
      {...props}
    >
      <div
        data-slot="pagination-layout"
        className={cn("grid grid-cols-2 items-center gap-4 @2xl:flex @2xl:justify-between", className)}
      >
        {children}
      </div>
    </nav>
  )
}

const paginationContentVariants = cva("flex items-center", {
  variants: {
    gap: {
      8: "gap-2",
      12: "gap-3",
      16: "gap-4",
    },
  },
  defaultVariants: {
    gap: 12,
  },
})

function PaginationContent({
  className,
  gap,
  ...props
}: React.ComponentProps<"ul"> & VariantProps<typeof paginationContentVariants>) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn(paginationContentVariants({ gap }), className)}
      {...props}
    />
  )
}

function PaginationItem(props: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = Omit<React.ComponentProps<typeof Button>, "render" | "nativeButton"> & {
  href?: string
  isActive?: boolean
}

/** Figma Item: a 32x32 Outline-Button holding the page number. */
function PaginationLink({
  className,
  isActive,
  href,
  size = "icon-32",
  variant,
  ...props
}: PaginationLinkProps) {
  return (
    <Button
      data-slot="pagination-link"
      aria-current={isActive ? "page" : undefined}
      variant={variant ?? (isActive ? "primary" : "outline")}
      size={size}
      className={cn("text-11 leading-20", className)}
      {...(href ? { render: <a href={href} />, nativeButton: false as const } : {})}
      {...props}
    />
  )
}

/** Figma Outline-Button "Previous": chevron-left + label. */
function PaginationPrevious({ children = "Previous", ...props }: PaginationLinkProps) {
  return (
    <PaginationLink aria-label="Go to previous page" size="32" {...props}>
      <ButtonIcon src="/icons/material-chevron-left.svg" position="start" />
      {children}
    </PaginationLink>
  )
}

/** Figma Outline-Button "Next": label + chevron-right. */
function PaginationNext({ children = "Next", ...props }: PaginationLinkProps) {
  return (
    <PaginationLink aria-label="Go to next page" size="32" {...props}>
      {children}
      <ButtonIcon src="/icons/material-chevron-right.svg" position="end" />
    </PaginationLink>
  )
}

/** Figma Item with only a chevron (Pagination-02 arrows). */
function PaginationArrow({
  direction,
  ...props
}: PaginationLinkProps & { direction: "previous" | "next" }) {
  return (
    <PaginationLink
      aria-label={direction === "previous" ? "Go to previous page" : "Go to next page"}
      {...props}
    >
      <ButtonIcon
        src={`/icons/material-chevron-${direction === "previous" ? "left" : "right"}.svg`}
        position="start"
      />
    </PaginationLink>
  )
}

/** Figma Item "...": same 32x32 outline shape, not interactive. */
function PaginationEllipsis({ className }: { className?: string }) {
  return (
    <Button
      data-slot="pagination-ellipsis"
      variant="outline"
      size="icon-32"
      tabIndex={-1}
      aria-hidden
      className={cn("pointer-events-none text-11 leading-20", className)}
      render={<span />}
      nativeButton={false}
    >
      ...
    </Button>
  )
}

/** Figma Outline-Button "Load More". */
function PaginationLoadMore({ children = "Load More", ...props }: PaginationLinkProps) {
  return (
    <PaginationLink size="32" {...props}>
      {children}
    </PaginationLink>
  )
}

/** Figma "Page 10" selector: label + expand-more chevron. */
function PaginationSelect({ children, ...props }: PaginationLinkProps) {
  return (
    <PaginationLink size="32" aria-haspopup="listbox" {...props}>
      {children}
      <ButtonIcon src="/icons/material-expand-more.svg" position="end" />
    </PaginationLink>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationArrow,
  PaginationEllipsis,
  PaginationLoadMore,
  PaginationSelect,
}
