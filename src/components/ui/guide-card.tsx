import * as React from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"

// Figma Misc > Dark-Mode (15607:648872): instruction card with title, caption and a screenshot.
function GuideCard({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="guide-card"
      className={cn(
        "flex w-full max-w-225 flex-col gap-7 rounded-r40 bg-background p-20 font-default tracking-default",
        className
      )}
      {...props}
    />
  )
}

function GuideCardTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="guide-card-title"
      className={cn("text-48 leading-72 font-semibold text-base-900", className)}
      {...props}
    />
  )
}

function GuideCardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="guide-card-description"
      className={cn("text-12 leading-20 font-bold text-base-600", className)}
      {...props}
    />
  )
}

/** Screenshot frame (Figma `def 1`, 740x1037 at radius 20, image fill). */
function GuideCardImage({
  className,
  alt,
  ...props
}: Omit<React.ComponentProps<typeof Image>, "fill">) {
  return (
    <Image
      data-slot="guide-card-image"
      alt={alt}
      className={cn("h-auto w-full rounded-r20", className)}
      {...props}
    />
  )
}

export { GuideCard, GuideCardTitle, GuideCardDescription, GuideCardImage }
