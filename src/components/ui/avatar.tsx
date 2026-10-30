"use client"

import * as React from "react"
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Status } from "@/components/ui/status"

// Figma Avatar-Text / Avatar-Image / Profile / Avatar-Logo / Brand-Logo (Avatars page 4313:42252).
// Size sets the box, initials type, rounded-corner radius and status dot via CSS vars.
// 128/96/80 are the framed sizes (Profile, logos); their frame paddings are vars read by `frame`.
const avatarVariants = cva(
  "group/avatar relative flex shrink-0 font-default font-bold tracking-default select-none",
  {
    variants: {
      size: {
        "128": "size-32 text-14 leading-24 [--avatar-brand-pad:--spacing(8)] [--avatar-inner-r:var(--radius-r16)] [--avatar-logo-pad:--spacing(5)] [--avatar-r:var(--radius-r20)]",
        "96": "size-24 text-14 leading-24 [--avatar-brand-pad:--spacing(6)] [--avatar-inner-r:var(--radius-r12)] [--avatar-logo-pad:--spacing(3)] [--avatar-r:var(--radius-r12)]",
        "80": "size-20 text-14 leading-24 [--avatar-brand-pad:--spacing(5)] [--avatar-inner-r:var(--radius-r8)] [--avatar-logo-pad:--spacing(3)] [--avatar-r:var(--radius-r12)]",
        "60": "size-15 text-14 leading-24 [--avatar-brand-pad:--spacing(3.5)] [--avatar-inner-r:var(--radius-r6)] [--avatar-logo-pad:--spacing(3)] [--avatar-r:var(--radius-r8)] [--avatar-status-inset:--spacing(1.5)] [--avatar-status:--spacing(2)]",
        "48": "size-12 text-12 leading-20 [--avatar-r:var(--radius-r8)] [--avatar-status-inset:--spacing(1)] [--avatar-status:--spacing(2)]",
        "40": "size-10 text-10 leading-16 [--avatar-brand-pad:--spacing(2)] [--avatar-inner-r:var(--radius-r6)] [--avatar-logo-pad:--spacing(1.5)] [--avatar-r:var(--radius-r8)] [--avatar-status-inset:--spacing(0.5)] [--avatar-status:--spacing(2)]",
        "32": "size-8 text-10 leading-16 [--avatar-r:var(--radius-r8)] [--avatar-status-inset:--spacing(0.5)] [--avatar-status:--spacing(2)]",
        "24": "size-6 text-8 leading-12 [--avatar-r:var(--radius-r6)] [--avatar-status-inset:--spacing(0.5)] [--avatar-status:--spacing(1.5)]",
        "20": "size-5 text-8 leading-12 [--avatar-r:var(--radius-r6)] [--avatar-status-inset:0px] [--avatar-status:--spacing(1.5)]",
        "16": "size-4 text-8 leading-12 [--avatar-r:var(--radius-r4)] [--avatar-status-inset:0px] [--avatar-status:--spacing(1)]",
        "12": "size-3 text-8 leading-12 [--avatar-r:var(--radius-r4)] [--avatar-status-inset:0px] [--avatar-status:--spacing(1)]",
      },
      shape: {
        circle: "rounded-full",
        rounded: "rounded-(--avatar-r)",
      },
      // Figma "Story": 2px ring, 1px gap
      story: {
        true: "outline-2 outline-offset-1 outline-primary-600",
        false: "",
      },
      // Figma Profile: photo in a 4px white frame. Avatar-Logo / Brand-Logo: logo in a white tile.
      frame: {
        none: "",
        profile: "bg-background-0 p-1 shadow-[0_1px_2px_0_var(--shadow-base)]",
        logo: "bg-background-0 p-(--avatar-logo-pad) outline -outline-offset-1 outline-background-100",
        brand: "bg-background-0 p-(--avatar-brand-pad) outline -outline-offset-1 outline-background-100",
      },
    },
    compoundVariants: [
      { shape: "rounded", size: ["40", "32"], className: "[--avatar-status-inset:--spacing(1)]" },
      { shape: "rounded", size: "24", className: "[--avatar-status-inset:--spacing(0.75)]" },
      { frame: "profile", size: "96", className: "[--avatar-r:var(--radius-r16)]" },
      // Circle tiles shrink the wordmark to clear the curve
      { frame: "logo", shape: "circle", size: "96", className: "[--avatar-logo-pad:--spacing(4)]" },
      { frame: "logo", shape: "circle", size: "40", className: "[--avatar-logo-pad:--spacing(2)]" },
    ],
    defaultVariants: {
      size: "48",
      shape: "circle",
      story: false,
      frame: "none",
    },
  }
)

type AvatarSize = NonNullable<VariantProps<typeof avatarVariants>["size"]>

function Avatar({
  className,
  size = "48",
  shape = "circle",
  story = false,
  frame = "none",
  ...props
}: AvatarPrimitive.Root.Props & VariantProps<typeof avatarVariants>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      data-shape={shape}
      data-frame={frame}
      className={cn(avatarVariants({ size, shape, story, frame }), className)}
      {...props}
    />
  )
}

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(
        "aspect-square size-full rounded-[inherit] object-cover",
        // Profile photo keeps a smaller inner corner; logos are fitted, not cropped
        "group-data-[frame=profile]/avatar:group-data-[shape=rounded]/avatar:rounded-(--avatar-inner-r)",
        "group-data-[frame=brand]/avatar:rounded-none group-data-[frame=brand]/avatar:object-contain group-data-[frame=logo]/avatar:rounded-none group-data-[frame=logo]/avatar:object-contain",
        className
      )}
      {...props}
    />
  )
}

// Figma Avatar-Text styles: Soft = tinted gradient + 1px inside stroke, solid = color gradient
const avatarFallbackVariants = cva(
  "flex size-full items-center justify-center rounded-[inherit] bg-linear-to-b",
  {
    variants: {
      variant: {
        "primary-soft": "from-primary-alpha-5 to-primary-alpha-15 text-primary-600 outline -outline-offset-1 outline-primary-alpha-20",
        primary: "from-primary-525 to-primary-625 text-background-0",
        "green-soft": "from-green-alpha-5 to-green-alpha-15 text-green-600 outline -outline-offset-1 outline-green-alpha-20",
        green: "from-green-525 to-green-625 text-background-0",
        "orange-soft": "from-orange-alpha-5 to-orange-alpha-15 text-orange-600 outline -outline-offset-1 outline-orange-alpha-20",
        orange: "from-orange-500 to-orange-625 text-background-0",
        "purple-soft": "from-purple-alpha-5 to-purple-alpha-15 text-purple-600 outline -outline-offset-1 outline-purple-alpha-20",
        purple: "from-purple-500 to-purple-600 text-background-0",
        "red-soft": "from-red-alpha-5 to-red-alpha-15 text-red-600 outline -outline-offset-1 outline-red-alpha-20",
        red: "from-red-500 to-red-600 text-background-0",
        "yellow-soft": "from-yellow-alpha-5 to-yellow-alpha-15 text-yellow-600 outline -outline-offset-1 outline-yellow-alpha-20",
        yellow: "from-yellow-425 to-yellow-550 text-background-0",
        "sky-soft": "from-sky-alpha-5 to-sky-alpha-15 text-sky-600 outline -outline-offset-1 outline-sky-alpha-20",
        sky: "from-sky-500 to-sky-600 text-background-0",
        "pink-soft": "from-pink-alpha-5 to-pink-alpha-15 text-pink-600 outline -outline-offset-1 outline-pink-alpha-20",
        pink: "from-pink-500 to-pink-600 text-background-0",
        "amber-soft": "from-amber-alpha-5 to-amber-alpha-15 text-amber-600 outline -outline-offset-1 outline-amber-alpha-20",
        amber: "from-amber-500 to-amber-600 text-background-0",
        "teal-soft": "from-teal-alpha-5 to-teal-alpha-15 text-teal-600 outline -outline-offset-1 outline-teal-alpha-20",
        teal: "from-teal-500 to-teal-600 text-background-0",
        dark: "from-base-800 to-base-900 text-background-0",
        // Form-Avatar-Add empty state: white disc, 1px inside stroke, gray account icon
        placeholder: "bg-background-0 text-base-500 outline -outline-offset-1 outline-background-100",
      },
    },
    defaultVariants: {
      variant: "primary-soft",
    },
  }
)

type AvatarFallbackVariant = NonNullable<VariantProps<typeof avatarFallbackVariants>["variant"]>

function AvatarFallback({
  className,
  variant,
  ...props
}: AvatarPrimitive.Fallback.Props & VariantProps<typeof avatarFallbackVariants>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(avatarFallbackVariants({ variant }), className)}
      {...props}
    />
  )
}

/** Figma "Status" (see `Status`), bottom-right; the avatar size sets its box and inset. */
function AvatarBadge({
  className,
  color = "online",
  type,
  border,
  ...props
}: React.ComponentProps<typeof Status>) {
  return (
    <Status
      data-slot="avatar-badge"
      color={color}
      type={type}
      border={border}
      className={cn(
        "absolute right-(--avatar-status-inset) bottom-(--avatar-status-inset) z-10 size-(--avatar-status)",
        className
      )}
      {...props}
    />
  )
}

// Figma Avatar-Group: overlap and "+N" gap per size
const avatarGroupVariants = cva(
  "group/avatar-group flex items-center *:data-[slot=avatar]:not-first:ml-(--avatar-overlap)",
  {
    variants: {
      size: {
        "60": "[--avatar-count-gap:--spacing(4)] [--avatar-overlap:--spacing(-5)]",
        "48": "[--avatar-count-gap:--spacing(3)] [--avatar-overlap:--spacing(-5)]",
        "40": "[--avatar-count-gap:--spacing(3)] [--avatar-overlap:--spacing(-4)]",
        "32": "[--avatar-count-gap:--spacing(2)] [--avatar-overlap:--spacing(-3)]",
        "24": "[--avatar-count-gap:--spacing(1.5)] [--avatar-overlap:--spacing(-1.5)]",
        "20": "[--avatar-count-gap:--spacing(0.5)] [--avatar-overlap:--spacing(-1.5)]",
        "16": "[--avatar-count-gap:--spacing(0.5)] [--avatar-overlap:--spacing(-1.5)]",
        "12": "[--avatar-count-gap:--spacing(0.5)] [--avatar-overlap:--spacing(-1.5)]",
      },
    },
    defaultVariants: {
      size: "48",
    },
  }
)

function AvatarGroup({
  className,
  size = "48",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof avatarGroupVariants>) {
  return (
    <div
      data-slot="avatar-group"
      data-size={size}
      className={cn(avatarGroupVariants({ size }), className)}
      {...props}
    />
  )
}

/** Figma "Plus": "+N" chip in the Outline-Button style. */
function AvatarGroupCount({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "relative ml-(--avatar-count-gap) flex shrink-0 items-center justify-center rounded-full bg-linear-to-b from-base-0 to-base-20 font-default font-bold tracking-default text-base-800 shadow-[0_1px_2px_0_var(--shadow-base)] outline -outline-offset-1 outline-base-70",
        "group-data-[size=60]/avatar-group:size-15 group-data-[size=60]/avatar-group:text-14 group-data-[size=60]/avatar-group:leading-24",
        "group-data-[size=48]/avatar-group:size-12 group-data-[size=48]/avatar-group:text-13 group-data-[size=48]/avatar-group:leading-20",
        "group-data-[size=40]/avatar-group:size-10 group-data-[size=40]/avatar-group:text-12 group-data-[size=40]/avatar-group:leading-20",
        "group-data-[size=32]/avatar-group:size-8 group-data-[size=32]/avatar-group:text-11 group-data-[size=32]/avatar-group:leading-20",
        "group-data-[size=24]/avatar-group:size-6 group-data-[size=24]/avatar-group:text-10 group-data-[size=24]/avatar-group:leading-16",
        "group-data-[size=20]/avatar-group:size-5 group-data-[size=20]/avatar-group:text-10 group-data-[size=20]/avatar-group:leading-16",
        // Figma hides the count below 20px
        "group-data-[size=12]/avatar-group:hidden group-data-[size=16]/avatar-group:hidden",
        className
      )}
      {...props}
    />
  )
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
  avatarVariants,
  avatarFallbackVariants,
  type AvatarSize,
  type AvatarFallbackVariant,
}
