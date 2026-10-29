import * as React from "react"

import { cn } from "@/lib/utils"

// Figma Switcher-Card (9427:4066): leading media, Content (Main Text, Additional Text, Links) and a
// Switch top-right, in a <label> so the card toggles it. Active / Dislabled follow the Switch inside
// (data-checked / data-disabled). Unlike Checkbox-Card, the Dislabled card keeps a white fill.
function SwitchCard({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="switch-card"
      className={cn(
        "group/switch-card flex cursor-pointer items-start gap-5 rounded-r16 bg-background-0 p-4 font-default tracking-default outline outline-base-100 -outline-offset-1 transition-[outline-color] select-none not-has-data-disabled:has-data-checked:outline-base-alpha-50 has-data-disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  )
}

/** Figma leading slot (24px): an icon, avatar, flag, badge, card or crypto logo. Faded when disabled. */
function SwitchCardMedia({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="switch-card-media"
      className={cn(
        "flex min-h-6 min-w-6 shrink-0 items-center justify-center group-has-data-disabled/switch-card:opacity-50",
        className
      )}
      {...props}
    />
  )
}

/** Figma material-default-icon, the default leading glyph. */
function SwitchCardIcon({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="switch-card-icon"
      aria-hidden
      className={cn(
        "size-6 bg-base-500 mask-[url(/icons/material-default-icon.svg)] mask-contain mask-center mask-no-repeat",
        className
      )}
      {...props}
    />
  )
}

function SwitchCardContent({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span data-slot="switch-card-content" className={cn("flex min-w-0 flex-1 flex-col gap-2", className)} {...props} />
  )
}

/** Figma Main Text: base-900, Dislabled base-500. */
function SwitchCardTitle({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="switch-card-title"
      className={cn(
        "text-12 leading-20 font-semibold text-base-900 group-has-data-disabled/switch-card:text-base-500",
        className
      )}
      {...props}
    />
  )
}

/** Figma Additional Text. */
function SwitchCardDescription({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="switch-card-description"
      className={cn("text-12 leading-20 font-semibold text-base-500", className)}
      {...props}
    />
  )
}

/** Figma Links row (gap 16). Faded when disabled. */
function SwitchCardLinks({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="switch-card-links"
      className={cn("flex flex-wrap items-center gap-4 group-has-data-disabled/switch-card:opacity-30", className)}
      {...props}
    />
  )
}

/** Figma Link: Inter Bold 11/20, base-600. */
function SwitchCardLink({ className, ...props }: React.ComponentProps<"a">) {
  return (
    <a
      data-slot="switch-card-link"
      className={cn(
        "rounded-r4 text-11 leading-20 font-bold text-base-600 underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-base-alpha-50 group-has-data-disabled/switch-card:pointer-events-none",
        className
      )}
      {...props}
    />
  )
}

export {
  SwitchCard,
  SwitchCardContent,
  SwitchCardDescription,
  SwitchCardIcon,
  SwitchCardLink,
  SwitchCardLinks,
  SwitchCardMedia,
  SwitchCardTitle,
}
