"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ColorSwatch } from "@/components/ui/color-swatch"
import { inputSizeVariants, type InputShape, type InputSize } from "@/components/ui/input"
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
      // Figma Forms: Inputs Custom (12509:89789): glass inputs for photos / dark surfaces, fixed white
      // text in both color modes. White = Input-Rounded/Pilled-White, Black = Input-*-Black.
      // Same modifiers as the state classes above, so cn() replaces them. Error / Success keep the
      // text white and use a 50% outer ring with the 600 stroke; Disabled drops the stroke.
      tone: {
        default: "",
        white:
          "bg-white-alpha-25 [--input-addon-fg:var(--white-alpha-70)] [--input-fg:var(--white)] [--input-icon-fg:var(--white-alpha-70)] [--input-placeholder:var(--white-alpha-90)] [--input-stroke:var(--white-alpha-5)] " +
          "has-[[data-slot=input-group-control]:not(:placeholder-shown)]:not-has-[[data-slot=input-group-control]:focus-visible]:not-has-[[data-slot=input-group-control]:disabled]:not-has-[[aria-invalid=true]]:data-[status=default]:[--input-stroke:var(--white-alpha-10)] " +
          "has-[[data-slot=input-group-control]:focus-visible]:not-has-[[aria-invalid=true]]:data-[status=default]:[--input-ring:var(--white-alpha-50)] has-[[data-slot=input-group-control]:focus-visible]:not-has-[[aria-invalid=true]]:data-[status=default]:[--input-stroke:var(--white-alpha-80)] " +
          "has-[[aria-invalid=true]]:[--input-fg:var(--white)] has-[[aria-invalid=true]]:[--input-placeholder:var(--white)] has-[[aria-invalid=true]]:[--input-ring:var(--danger-alpha-50)] has-[[aria-invalid=true]]:[--input-stroke:var(--danger-600)] " +
          "has-[[data-slot=input-group-control]:disabled]:bg-white-alpha-25 has-[[data-slot=input-group-control]:disabled]:[--input-fg:var(--white-alpha-50)] has-[[data-slot=input-group-control]:disabled]:[--input-placeholder:var(--white-alpha-50)] has-[[data-slot=input-group-control]:disabled]:[--input-stroke:transparent]",
        black:
          "bg-black-alpha-25 [--input-addon-fg:var(--white-alpha-70)] [--input-fg:var(--white)] [--input-icon-fg:var(--white-alpha-70)] [--input-placeholder:var(--white)] [--input-stroke:var(--black-alpha-5)] " +
          "has-[[data-slot=input-group-control]:not(:placeholder-shown)]:not-has-[[data-slot=input-group-control]:focus-visible]:not-has-[[data-slot=input-group-control]:disabled]:not-has-[[aria-invalid=true]]:data-[status=default]:[--input-stroke:var(--white-alpha-10)] " +
          "has-[[data-slot=input-group-control]:focus-visible]:not-has-[[aria-invalid=true]]:data-[status=default]:[--input-ring:var(--white-alpha-50)] has-[[data-slot=input-group-control]:focus-visible]:not-has-[[aria-invalid=true]]:data-[status=default]:[--input-stroke:var(--white-alpha-20)] " +
          "has-[[aria-invalid=true]]:[--input-fg:var(--white)] has-[[aria-invalid=true]]:[--input-placeholder:var(--white)] has-[[aria-invalid=true]]:[--input-ring:var(--danger-alpha-50)] has-[[aria-invalid=true]]:[--input-stroke:var(--danger-600)] " +
          "has-[[data-slot=input-group-control]:disabled]:bg-black-alpha-25 has-[[data-slot=input-group-control]:disabled]:[--input-fg:var(--white-alpha-50)] has-[[data-slot=input-group-control]:disabled]:[--input-placeholder:var(--white-alpha-50)] has-[[data-slot=input-group-control]:disabled]:[--input-stroke:transparent]",
      },
      // Input segment of an InputGroupJoin: square corners (the join rounds the outer ones) and,
      // on Error / Success, only the 1px edge stroke (the join draws one ring around all segments).
      // Same modifiers as the classes above, so cn() replaces them.
      joined: {
        true: "rounded-none has-[[aria-invalid=true]]:-outline-offset-1 has-[[aria-invalid=true]]:[--input-ring:transparent]",
        false: "",
      },
    },
    compoundVariants: [
      {
        tone: ["white", "black"],
        status: "active",
        className: "[--input-ring:var(--white-alpha-50)]",
      },
      { tone: "white", status: "active", className: "[--input-stroke:var(--white-alpha-80)]" },
      { tone: "black", status: "active", className: "[--input-stroke:var(--white-alpha-20)]" },
      {
        tone: ["white", "black"],
        status: "success",
        className:
          "not-has-[[aria-invalid=true]]:[--input-fg:var(--white)] not-has-[[aria-invalid=true]]:[--input-placeholder:var(--white)] not-has-[[aria-invalid=true]]:[--input-ring:var(--success-alpha-50)]",
      },
      {
        joined: true,
        status: "success",
        className:
          "not-has-[[aria-invalid=true]]:-outline-offset-1 not-has-[[aria-invalid=true]]:[--input-ring:transparent]",
      },
    ],
    defaultVariants: {
      status: "default",
      tone: "default",
      joined: false,
    },
  }
)

// Figma Forms: Input Groups (12015:28362): Input-Left-Group / Input-Right-Group / Input-Double-Group,
// Rounded and Pilled. A row of segments that overlap by 1px so their strokes form the dividers; only
// the outer corners keep the size radius. Segments are InputGroupSegment (Figma Group) and one
// InputGroup (Figma Input), which takes size / shape / Success from the join.
// States: Active N = the focused (or pinned) segment draws its own ring. Error (any aria-invalid
// inside) and Success (status) color every stroke and text and draw one ring around the whole row
// (Figma Content stroke at 20%). Disabled (any disabled control inside) greys the segments.
const inputGroupJoinVariants = cva(
  "group/input-group-join relative isolate flex w-full min-w-0 items-stretch font-default font-semibold tracking-default " +
    "[--join-active-offset:-5px] [--join-active-ring:var(--base-alpha-20)] [--join-active-stroke:var(--base-200)] [--join-bg:var(--background-0)] [--join-fg:var(--base-600)] [--join-ring:transparent] [--join-stroke:var(--base-100)] " +
    // Segments: 1px overlap, outer corners only, the focused / pinned one on top
    "*:relative *:not-first:-ml-px *:first:rounded-l-[inherit] *:last:rounded-r-[inherit] *:has-focus-visible:z-10 *:data-[status=active]:z-10 " +
    // One Error / Success ring over the whole row
    "after:pointer-events-none after:absolute after:inset-0 after:z-20 after:rounded-[inherit] after:shadow-[inset_0_0_0_4px_var(--join-ring)] " +
    // Error
    "has-[[aria-invalid=true]]:[--join-active-offset:-1px] has-[[aria-invalid=true]]:[--join-active-ring:transparent] has-[[aria-invalid=true]]:[--join-active-stroke:var(--danger-500)] has-[[aria-invalid=true]]:[--join-fg:var(--danger-600)] has-[[aria-invalid=true]]:[--join-ring:var(--danger-alpha-20)] has-[[aria-invalid=true]]:[--join-stroke:var(--danger-500)] " +
    // Disabled
    "has-disabled:[--join-bg:var(--background-20)] has-disabled:[--join-fg:var(--base-300)]",
  {
    variants: {
      status: {
        default: "",
        success:
          "not-has-[[aria-invalid=true]]:[--join-active-offset:-1px] not-has-[[aria-invalid=true]]:[--join-active-ring:transparent] not-has-[[aria-invalid=true]]:[--join-active-stroke:var(--success-600)] not-has-[[aria-invalid=true]]:[--join-fg:var(--success-600)] not-has-[[aria-invalid=true]]:[--join-ring:var(--success-alpha-20)] not-has-[[aria-invalid=true]]:[--join-stroke:var(--success-600)]",
      },
      size: {
        "60": "",
        "48": "",
        "40": "",
        "32": "",
        "24": "",
      },
      shape: {
        rounded: "",
        pill: "",
      },
    },
    // Group segment side padding, from the Figma Group widths ("Text" + padding on both sides)
    compoundVariants: [
      { shape: "rounded", size: "60", className: "[--input-segment-px:--spacing(5)]" },
      { shape: "rounded", size: "48", className: "[--input-segment-px:--spacing(4)]" },
      { shape: "rounded", size: ["40", "32"], className: "[--input-segment-px:--spacing(3)]" },
      { shape: "rounded", size: "24", className: "[--input-segment-px:--spacing(2)]" },
      { shape: "pill", size: "60", className: "[--input-segment-px:--spacing(6.5)]" },
      { shape: "pill", size: "48", className: "[--input-segment-px:--spacing(5)]" },
      { shape: "pill", size: "40", className: "[--input-segment-px:--spacing(4)]" },
      { shape: "pill", size: ["32", "24"], className: "[--input-segment-px:--spacing(3)]" },
    ],
    defaultVariants: {
      status: "default",
      size: "40",
      shape: "rounded",
    },
  }
)

type InputGroupJoinStatus = NonNullable<VariantProps<typeof inputGroupJoinVariants>["status"]>
type InputGroupJoinContextValue = { size: InputSize; shape: InputShape; status: InputGroupJoinStatus }

const InputGroupJoinContext = React.createContext<InputGroupJoinContextValue | null>(null)

/** Figma Content of an Input Group: InputGroupSegment(s) around one InputGroup. */
function InputGroupJoin({
  className,
  size = "40",
  shape = "rounded",
  status = "default",
  ...props
}: React.ComponentProps<"div"> & {
  size?: InputSize
  shape?: InputShape
  status?: InputGroupJoinStatus
}) {
  const value = React.useMemo(() => ({ size, shape, status }), [size, shape, status])
  return (
    <InputGroupJoinContext.Provider value={value}>
      <div
        role="group"
        data-slot="input-group-join"
        data-size={size}
        data-status={status}
        className={cn(inputSizeVariants({ size, shape }), inputGroupJoinVariants({ status, size, shape }), className)}
        {...props}
      />
    </InputGroupJoinContext.Provider>
  )
}

// Figma Group frame (Text, Button, Checkbox, Radio, Switcher, Icon, Avatar, Colors, Select). Colors
// come from the join; Active (focus inside, or the pinned status) draws the segment's own ring.
const inputGroupSegmentVariants = cva(
  "flex shrink-0 items-center justify-center gap-(--input-gap) bg-(--join-bg) px-(--input-segment-px) whitespace-nowrap text-(--input-fg) shadow-[inset_0_0_0_4px_var(--input-ring)] outline outline-(--input-stroke) -outline-offset-1 transition-[outline-color,box-shadow,color] [--input-fg:var(--join-fg)] [--input-ring:transparent] [--input-stroke:var(--join-stroke)] " +
    "has-focus-visible:outline-offset-(--join-active-offset) has-focus-visible:[--input-ring:var(--join-active-ring)] has-focus-visible:[--input-stroke:var(--join-active-stroke)]",
  {
    variants: {
      status: {
        default: "",
        // Pinned Figma State=Active N for previews; keyboard focus inside gets it automatically
        active:
          "outline-offset-(--join-active-offset) [--input-ring:var(--join-active-ring)] [--input-stroke:var(--join-active-stroke)]",
      },
    },
    defaultVariants: {
      status: "default",
    },
  }
)

function InputGroupSegment({
  className,
  status = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupSegmentVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-segment"
      data-status={status}
      className={cn(inputGroupSegmentVariants({ status }), className)}
      {...props}
    />
  )
}

function InputGroup({
  className,
  size: sizeProp,
  shape: shapeProp,
  status: statusProp,
  tone = "default",
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof inputSizeVariants> &
  Omit<VariantProps<typeof inputGroupVariants>, "joined">) {
  // Inside an InputGroupJoin, size / shape / Success default to the join's
  const join = React.useContext(InputGroupJoinContext)
  const size = sizeProp ?? join?.size ?? "40"
  const shape = shapeProp ?? join?.shape ?? "rounded"
  const status = statusProp ?? join?.status ?? "default"
  const joined = join !== null
  return (
    <div
      data-slot="input-group"
      data-size={size}
      data-status={status}
      data-tone={tone}
      role="group"
      className={cn(inputSizeVariants({ size, shape }), inputGroupVariants({ status, tone, joined }), className)}
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
      className={cn("font-semibold whitespace-nowrap text-[color:var(--input-addon-fg,var(--base-400))]", className)}
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
      className={cn("size-(--input-icon) shrink-0 bg-[color:var(--input-icon-fg,var(--base-500))] mask-contain mask-center mask-no-repeat", className)}
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

/** Figma Colors swatch slot: the Forms: Color `Color` chip; pass the input's shape. */
function InputGroupSwatch({ shape = "rounded", ...props }: React.ComponentProps<typeof ColorSwatch>) {
  return <ColorSwatch data-slot="input-group-swatch" shape={shape} {...props} />
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupAvatar,
  InputGroupButton,
  InputGroupIcon,
  InputGroupInput,
  InputGroupJoin,
  InputGroupKbd,
  InputGroupSegment,
  InputGroupSwatch,
  InputGroupTag,
  InputGroupText,
  inputGroupJoinVariants,
  inputGroupSegmentVariants,
  inputGroupVariants,
}
