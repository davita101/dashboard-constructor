import * as React from "react"
import Image from "next/image"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Figma Profile (11638:16498): Profile-User-Image / Profile-Company-Image (280px, banner + centered text)
// and Profile-User / Profile-Company (left-aligned list). Radius=Pilled|Rounded drives banner corners;
// the avatar and buttons take the same shape from the consumer.

const profileCardVariants = cva("group/profile flex flex-col gap-5 font-default tracking-default text-base-800", {
  variants: {
    // Image = 280px card with a banner; list = compact left-aligned card
    layout: {
      image: "w-70",
      list: "w-fit",
    },
    shape: {
      pill: "",
      rounded: "",
    },
  },
  defaultVariants: { layout: "image", shape: "pill" },
})

function ProfileCard({
  className,
  layout,
  shape,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof profileCardVariants>) {
  return (
    <div
      data-slot="profile-card"
      data-shape={shape ?? "pill"}
      className={cn(profileCardVariants({ layout, shape }), className)}
      {...props}
    />
  )
}

/** Figma Head (280x100): banner image with the avatar overlapping its bottom edge, centered. */
function ProfileCardHead({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="profile-card-head" className={cn("relative h-25 w-full", className)} {...props} />
}

/** Figma Image (280x72): r16 pilled, r8 rounded. */
function ProfileCardBanner({
  src,
  alt = "",
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & { src: string; alt?: string }) {
  return (
    <div
      data-slot="profile-card-banner"
      className={cn(
        "relative h-18 w-full overflow-hidden rounded-r16 group-data-[shape=rounded]/profile:rounded-r8",
        className
      )}
      {...props}
    >
      <Image src={src} alt={alt} fill sizes="280px" className="object-cover" />
    </div>
  )
}

/** Holds the 60px Avatar; overlaps the banner (40px down, centered). */
function ProfileCardAvatar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="profile-card-avatar"
      className={cn("absolute top-10 left-1/2 -translate-x-1/2", className)}
      {...props}
    />
  )
}

const profileCardContentVariants = cva("flex flex-col", {
  variants: {
    align: {
      center: "items-center gap-4 px-5 text-center",
      start: "items-start gap-3",
    },
  },
  defaultVariants: { align: "center" },
})

function ProfileCardContent({
  className,
  align,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof profileCardContentVariants>) {
  return (
    <div
      data-slot="profile-card-content"
      className={cn(profileCardContentVariants({ align }), className)}
      {...props}
    />
  )
}

/** Figma Name: title + sub-line stack (gap 8). */
function ProfileCardName({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="profile-card-name" className={cn("flex flex-col gap-2", className)} {...props} />
}

/** Left-aligned header in Profile-User / Profile-Company (handle above title, gap 4). */
function ProfileCardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="profile-card-header" className={cn("flex w-full flex-col gap-1", className)} {...props} />
}

function ProfileCardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="profile-card-title"
      className={cn("text-14 leading-24 font-bold text-base-800", className)}
      {...props}
    />
  )
}

function ProfileCardSubtitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="profile-card-subtitle"
      className={cn("text-12 leading-20 font-bold text-base-500", className)}
      {...props}
    />
  )
}

/** Figma bio text: Inter SemiBold 11/16, 240px wide. */
function ProfileCardBio({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="profile-card-bio"
      className={cn("w-60 text-11 leading-16 font-semibold text-base-500", className)}
      {...props}
    />
  )
}

/** Figma Buttons row of three Outline-Button icons (gap 12). */
function ProfileCardSocial({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="profile-card-social" className={cn("flex items-center gap-3", className)} {...props} />
}

/** Figma Buttons / Footer row: Dark-Button + Ghost-Button (gap 8). */
function ProfileCardActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="profile-card-actions" className={cn("flex items-center gap-2", className)} {...props} />
}

/** Figma Content slot: stack of list items (gap 12). */
function ProfileCardList({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="profile-card-list" className={cn("flex flex-col gap-3", className)} {...props} />
}

/** Figma List Item: 20px icon + Inter SemiBold 12/20 text, gap 8. */
function ProfileCardListItem({
  icon,
  className,
  children,
  ...props
}: React.ComponentProps<"li"> & { icon: string }) {
  return (
    <li
      data-slot="profile-card-list-item"
      className={cn("flex items-center gap-2 text-12 leading-20 font-semibold text-base-700", className)}
      {...props}
    >
      <span
        aria-hidden
        className="size-5 shrink-0 bg-base-500 mask-contain mask-center mask-no-repeat"
        style={{ maskImage: `url(${icon})` }}
      />
      {children}
    </li>
  )
}

export {
  ProfileCard,
  ProfileCardActions,
  ProfileCardAvatar,
  ProfileCardBanner,
  ProfileCardBio,
  ProfileCardContent,
  ProfileCardHead,
  ProfileCardHeader,
  ProfileCardList,
  ProfileCardListItem,
  ProfileCardName,
  ProfileCardSocial,
  ProfileCardSubtitle,
  ProfileCardTitle,
  profileCardVariants,
}
