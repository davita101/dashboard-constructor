import * as React from "react"
import Image from "next/image"
import { cva, type VariantProps } from "class-variance-authority"

import { Badge } from "@/components/ui/badge"
import { Button, ButtonIcon } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

// Figma Cards: Content (11590:81923). File-Card / User-Card / Company-Card are one 168x240 card:
// Head (checkbox, star, more), a centered Media area, Footer (name + sub-line).
// File-List is a 36px pill row (name, size, more).

const contentCardVariants = cva(
  "w-42 h-60 gap-0 rounded-r16 bg-background-0 px-4 pt-4 pb-5 font-default tracking-default text-base-800 ring-0 outline -outline-offset-1 outline-background-100",
  {
    variants: {
      // User-Card keeps 4px at the bottom (Figma pad 16 16 4 16)
      kind: {
        default: "",
        user: "pb-1",
      },
    },
    defaultVariants: { kind: "default" },
  }
)

function ContentCard({
  className,
  kind,
  ...props
}: Omit<React.ComponentProps<typeof Card>, "size"> & VariantProps<typeof contentCardVariants>) {
  return (
    <Card
      data-slot="content-card"
      className={cn(contentCardVariants({ kind }), className)}
      {...props}
    />
  )
}

/** Figma Head: checkbox + star on the left, more on the right (136x20). */
function ContentCardHead({
  className,
  selected,
  onSelectedChange,
  ...props
}: React.ComponentProps<"div"> & {
  selected?: boolean
  onSelectedChange?: (checked: boolean) => void
}) {
  return (
    <div
      data-slot="content-card-head"
      className={cn("flex h-5 w-full items-center justify-between", className)}
      {...props}
    >
      <div className="flex items-center gap-3">
        <Checkbox
          aria-label="Select"
          checked={selected}
          onCheckedChange={onSelectedChange ? (c) => onSelectedChange(c) : undefined}
        />
        <Button variant="ghost" size="icon-20" shape="pill" aria-label="Favorite" className="text-base-500">
          <ButtonIcon src="/icons/material-star.svg" />
        </Button>
      </div>
      <Button variant="ghost" size="icon-20" shape="pill" aria-label="More" className="text-base-500">
        <ButtonIcon src="/icons/material-more-horiz.svg" />
      </Button>
    </div>
  )
}

/** Middle area; fills the space between Head and Footer and centers its content. */
function ContentCardMedia({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="content-card-media"
      className={cn("flex flex-1 items-center justify-center", className)}
      {...props}
    />
  )
}

/** Figma File type: 60px Badge-Icon-Pilled with the file label. */
function ContentCardFileBadge({ className, children, ...props }: React.ComponentProps<typeof Badge>) {
  return (
    <Badge
      data-slot="content-card-file-badge"
      variant="base"
      size="square-60"
      shape="rounded"
      className={cn("rounded-r16 text-base-500", className)}
      {...props}
    >
      {children}
    </Badge>
  )
}

/** Figma Image frame (136x108, r12): photo with a small type badge top-left and a centered action. */
function ContentCardImage({
  src,
  alt = "",
  badgeIcon,
  actionIcon,
  actionLabel,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  src: string
  alt?: string
  badgeIcon: string
  actionIcon: string
  actionLabel: string
}) {
  return (
    <div
      data-slot="content-card-image"
      className={cn("relative h-27 w-full overflow-hidden rounded-r12", className)}
      {...props}
    >
      <Image src={src} alt={alt} fill sizes="136px" className="object-cover" />
      <Badge variant="black-soft" size="square-24" shape="pill" className="absolute top-2 left-2">
        <ButtonIcon src={badgeIcon} className="size-3" />
      </Badge>
      <Button
        variant="black-soft"
        size="icon-40"
        shape="pill"
        aria-label={actionLabel}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <ButtonIcon src={actionIcon} className="size-5" />
      </Button>
    </div>
  )
}

/** Figma Footer: name and sub-line, Inter SemiBold 12/20 (136x44). */
function ContentCardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="content-card-footer"
      className={cn("flex w-full flex-col gap-1 text-center", className)}
      {...props}
    />
  )
}

function ContentCardTitle({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="content-card-title"
      className={cn("truncate text-12 leading-20 font-semibold text-base-800", className)}
      {...props}
    />
  )
}

function ContentCardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="content-card-description"
      className={cn("truncate text-12 leading-20 font-semibold text-base-500", className)}
      {...props}
    />
  )
}

/** Figma File-List: 200x36 pill row with name, size and more. */
function ContentRow({
  className,
  name,
  size,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & { name: string; size: string }) {
  return (
    <div
      data-slot="content-row"
      className={cn(
        "flex h-9 w-50 items-center justify-between rounded-r20 bg-background-0 py-2 pr-3 pl-4 font-default tracking-default outline -outline-offset-1 outline-background-100",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3 pr-2 text-11 leading-20 font-bold">
        <span className="w-23 truncate text-base-800">{name}</span>
        <span className="text-base-500">{size}</span>
      </div>
      <Button variant="ghost" size="icon-20" shape="pill" aria-label="More" className="text-base-500">
        <ButtonIcon src="/icons/material-more-horiz.svg" />
      </Button>
    </div>
  )
}

export {
  ContentCard,
  ContentCardDescription,
  ContentCardFileBadge,
  ContentCardFooter,
  ContentCardHead,
  ContentCardImage,
  ContentCardMedia,
  ContentCardTitle,
  ContentRow,
  contentCardVariants,
}
