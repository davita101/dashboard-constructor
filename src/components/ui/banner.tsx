import * as React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Figma Banner (12852:18338): a Card with 20px padding/gap, r20 and a Dark-Button
// close that overhangs the top-right corner by 8px (so the card can't clip it).

function Banner({ className, ...props }: React.ComponentProps<typeof Card>) {
  return (
    <Card
      data-slot="banner"
      className={cn(
        "relative overflow-visible rounded-r20 bg-background-0 text-base-900 ring-0 outline -outline-offset-1 outline-base-100 [--card-spacing:--spacing(5)]",
        className
      )}
      {...props}
    />
  )
}

/** Title + description stack, 8px apart. */
function BannerHeader({ className, ...props }: React.ComponentProps<typeof CardHeader>) {
  return <CardHeader data-slot="banner-header" className={cn("gap-2", className)} {...props} />
}

/** Semi Bold 600 14/24. */
function BannerTitle({ className, ...props }: React.ComponentProps<typeof CardTitle>) {
  return (
    <CardTitle
      data-slot="banner-title"
      className={cn(
        "font-default text-14 leading-24 font-semibold tracking-default text-base-900",
        className
      )}
      {...props}
    />
  )
}

/** Semi Bold 600 12/20. */
function BannerDescription({ className, ...props }: React.ComponentProps<typeof CardDescription>) {
  return (
    <CardDescription
      data-slot="banner-description"
      className={cn(
        "font-default text-12 leading-20 font-semibold tracking-default text-base-600",
        className
      )}
      {...props}
    />
  )
}

/** Figma image frame: 120x80, r8, image covers it. */
function BannerMedia({ className, ...props }: React.ComponentProps<typeof CardContent>) {
  return (
    <CardContent
      data-slot="banner-media"
      className={cn(
        "relative mx-(--card-spacing) h-20 w-30 overflow-hidden rounded-r8 px-0 *:[img]:size-full *:[img]:object-cover",
        className
      )}
      {...props}
    />
  )
}

/** Figma Dark-Button 24 with material-close (12px). */
function BannerClose({ className, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="banner-close"
      variant="dark"
      size="icon-round"
      aria-label="Close"
      className={cn("absolute -top-2 -right-2", className)}
      {...props}
    >
      <span
        aria-hidden
        className="size-3 bg-current mask-[url(/icons/material-close.svg)] mask-contain mask-center mask-no-repeat"
      />
    </Button>
  )
}

export { Banner, BannerHeader, BannerTitle, BannerDescription, BannerMedia, BannerClose }
