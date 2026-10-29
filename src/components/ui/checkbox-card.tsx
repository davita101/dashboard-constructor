import * as React from "react"

import { cn } from "@/lib/utils"

// Figma Checkbox-Card (9427:3669): leading media, Content (Main Text, Additional Text, Links) and a
// Checkbox top-right, in a <label> so the card toggles it. Active / Dislabled follow the Checkbox
// inside (data-checked / data-disabled).
function CheckboxCard({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="checkbox-card"
      className={cn(
        "group/checkbox-card flex cursor-pointer items-start gap-5 rounded-r16 bg-background-0 p-4 font-default tracking-default outline outline-base-100 -outline-offset-1 transition-[outline-color] select-none not-has-data-disabled:has-data-checked:outline-base-alpha-50 has-data-disabled:cursor-not-allowed has-data-disabled:bg-background-20",
        className
      )}
      {...props}
    />
  )
}

/** Figma leading slot (24px): an icon, avatar, flag or badge. Faded when disabled. */
function CheckboxCardMedia({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="checkbox-card-media"
      className={cn(
        "flex min-h-6 min-w-6 shrink-0 items-center justify-center group-has-data-disabled/checkbox-card:opacity-50",
        className
      )}
      {...props}
    />
  )
}

/** Figma material-default-icon, the default leading glyph. */
function CheckboxCardIcon({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="checkbox-card-icon"
      aria-hidden
      className={cn(
        "size-6 bg-base-500 mask-[url(/icons/material-default-icon.svg)] mask-contain mask-center mask-no-repeat",
        className
      )}
      {...props}
    />
  )
}

function CheckboxCardContent({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="checkbox-card-content"
      className={cn("flex min-w-0 flex-1 flex-col gap-2", className)}
      {...props}
    />
  )
}

/** Figma Main Text. */
function CheckboxCardTitle({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="checkbox-card-title"
      className={cn(
        "text-14 leading-20 font-medium text-base-800 group-has-[[data-checked]:not([data-disabled])]/checkbox-card:text-base-900 group-has-data-disabled/checkbox-card:text-base-500",
        className
      )}
      {...props}
    />
  )
}

/** Figma Additional Text. */
function CheckboxCardDescription({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="checkbox-card-description"
      className={cn("text-14 leading-20 font-medium text-base-500", className)}
      {...props}
    />
  )
}

/** Figma Links row. */
function CheckboxCardLinks({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="checkbox-card-links"
      className={cn("flex flex-wrap items-center gap-4 group-has-data-disabled/checkbox-card:opacity-50", className)}
      {...props}
    />
  )
}

function CheckboxCardLink({ className, ...props }: React.ComponentProps<"a">) {
  return (
    <a
      data-slot="checkbox-card-link"
      className={cn(
        "rounded-r4 text-12 leading-20 font-semibold text-base-900 underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-base-alpha-50 group-has-data-disabled/checkbox-card:pointer-events-none",
        className
      )}
      {...props}
    />
  )
}

export {
  CheckboxCard,
  CheckboxCardContent,
  CheckboxCardDescription,
  CheckboxCardIcon,
  CheckboxCardLink,
  CheckboxCardLinks,
  CheckboxCardMedia,
  CheckboxCardTitle,
}
