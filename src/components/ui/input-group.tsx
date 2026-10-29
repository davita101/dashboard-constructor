"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { inputSizeVariants } from "@/components/ui/input"
import { Kbd } from "@/components/ui/kbd"
import { cn } from "@/lib/utils"

// Figma Input frame with its Left / Right slots. Same box, sizes and states as Input, but the
// states are read from the control inside (has-*). Written by hand from shadcn's input-group:
// `shadcn add input-group` would overwrite button.tsx and textarea.tsx.
const inputGroupVariants = cva(
  "group/input-group relative flex w-full min-w-0 items-center gap-(--input-gap) bg-background-0 px-(--input-px) font-default font-semibold tracking-default text-(--input-fg) shadow-[inset_0_0_0_4px_var(--input-ring)] outline outline-(--input-stroke) -outline-offset-1 transition-[outline-color,box-shadow,color] [--input-fg:var(--base-900)] [--input-placeholder:var(--base-700)] [--input-ring:transparent] [--input-stroke:var(--base-100)] " +
    // Filled
    "has-[[data-slot=input-group-control]:not(:placeholder-shown)]:not-has-[[data-slot=input-group-control]:focus-visible]:not-has-[[data-slot=input-group-control]:disabled]:not-has-[[aria-invalid=true]]:data-[status=default]:[--input-stroke:var(--base-150)] " +
    // Active
    "has-[[data-slot=input-group-control]:focus-visible]:not-has-[[aria-invalid=true]]:data-[status=default]:-outline-offset-5 has-[[data-slot=input-group-control]:focus-visible]:not-has-[[aria-invalid=true]]:data-[status=default]:[--input-ring:var(--base-alpha-20)] has-[[data-slot=input-group-control]:focus-visible]:not-has-[[aria-invalid=true]]:data-[status=default]:[--input-stroke:var(--base-200)] " +
    // Error
    "has-[[aria-invalid=true]]:-outline-offset-5 has-[[aria-invalid=true]]:[--input-fg:var(--danger-600)] has-[[aria-invalid=true]]:[--input-placeholder:var(--danger-600)] has-[[aria-invalid=true]]:[--input-ring:var(--danger-alpha-20)] has-[[aria-invalid=true]]:[--input-stroke:var(--danger-500)] " +
    // Disabled
    "has-[[data-slot=input-group-control]:disabled]:cursor-not-allowed has-[[data-slot=input-group-control]:disabled]:bg-background-20 has-[[data-slot=input-group-control]:disabled]:outline-offset-[-1px] has-[[data-slot=input-group-control]:disabled]:shadow-none has-[[data-slot=input-group-control]:disabled]:[--input-fg:var(--base-300)] has-[[data-slot=input-group-control]:disabled]:[--input-placeholder:var(--base-300)] has-[[data-slot=input-group-control]:disabled]:[--input-stroke:var(--base-100)]",
  {
    variants: {
      status: {
        default: "",
        // Pinned Active look (Figma State=Active) for previews; real focus gets it automatically
        active: "-outline-offset-5 [--input-ring:var(--base-alpha-20)] [--input-stroke:var(--base-200)]",
        success:
          "not-has-[[aria-invalid=true]]:-outline-offset-5 not-has-[[aria-invalid=true]]:[--input-fg:var(--success-600)] not-has-[[aria-invalid=true]]:[--input-placeholder:var(--success-600)] not-has-[[aria-invalid=true]]:[--input-ring:var(--success-alpha-20)] not-has-[[aria-invalid=true]]:[--input-stroke:var(--success-600)]",
      },
    },
    defaultVariants: {
      status: "default",
    },
  }
)

function InputGroup({
  className,
  size = "40",
  shape = "rounded",
  status = "default",
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof inputSizeVariants> &
  VariantProps<typeof inputGroupVariants>) {
  return (
    <div
      data-slot="input-group"
      data-size={size}
      data-status={status}
      role="group"
      className={cn(inputSizeVariants({ size, shape }), inputGroupVariants({ status }), className)}
      {...props}
    />
  )
}

// Figma Left / Right frames. Clicking an addon focuses the input, like shadcn's.
const inputGroupAddonVariants = cva(
  "flex shrink-0 cursor-text items-center gap-(--input-gap) select-none group-has-[[data-slot=input-group-control]:disabled]/input-group:opacity-50",
  {
    variants: {
      align: {
        "inline-start": "order-first",
        "inline-end": "order-last",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  }
)

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) return
        e.currentTarget.parentElement?.querySelector("input")?.focus()
      }}
      {...props}
    />
  )
}

/** Figma Center > Text: the bare control; the group draws the box and the state colors. */
function InputGroupInput({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      data-slot="input-group-control"
      className={cn(
        "h-full w-full min-w-0 flex-1 bg-transparent text-(--input-fg) outline-none placeholder:text-(--input-placeholder) disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  )
}

/** Figma "Add Text" slot (Right): a short gray suffix/prefix such as a unit or a counter. */
function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="input-group-text"
      className={cn("font-semibold whitespace-nowrap text-base-400", className)}
      {...props}
    />
  )
}

/** Figma Left Icon / Right Icon: a single-color SVG as a mask, sized by the group (--input-icon). */
function InputGroupIcon({
  src,
  className,
  style,
  ...props
}: React.ComponentProps<"span"> & { src: string }) {
  return (
    <span
      data-slot="input-group-icon"
      aria-hidden
      className={cn("size-(--input-icon) shrink-0 bg-base-500 mask-contain mask-center mask-no-repeat", className)}
      style={{ maskImage: `url(${src})`, ...style }}
      {...props}
    />
  )
}

/** Figma Left Button / Right Button. Pick the Button size per input size (see /design-system/input). */
function InputGroupButton({
  type = "button",
  variant = "outline",
  size = "24",
  shape = "rounded",
  ...props
}: React.ComponentProps<typeof Button>) {
  return <Button data-slot="input-group-button" type={type} variant={variant} size={size} shape={shape} {...props} />
}

/** Figma Tags: Badge-Default-Rounded chips before the text. */
function InputGroupTag({
  variant = "base",
  shape = "rounded",
  size = "24",
  ...props
}: React.ComponentProps<typeof Badge>) {
  return <Badge data-slot="input-group-tag" variant={variant} shape={shape} size={size} {...props} />
}

/** Figma Command Keys: a Kbd group on the right. */
function InputGroupKbd(props: React.ComponentProps<typeof Kbd>) {
  return <Kbd data-slot="input-group-kbd" {...props} />
}

/** Figma Avatar slot: an Avatar-Image before the text. */
function InputGroupAvatar({ size = "24", shape = "rounded", ...props }: React.ComponentProps<typeof Avatar>) {
  return <Avatar data-slot="input-group-avatar" size={size} shape={shape} {...props} />
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupAvatar,
  InputGroupButton,
  InputGroupIcon,
  InputGroupInput,
  InputGroupKbd,
  InputGroupTag,
  InputGroupText,
  inputGroupVariants,
}
