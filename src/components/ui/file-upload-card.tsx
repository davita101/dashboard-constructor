import * as React from "react"

import { Button, ButtonIcon } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Figma Add-Files-Card (11956:18823): a 320px Card, r20, base-100 stroke, 20px padding and gap.
// Head ("Upload Files" + close), drop area, "Or" divider, URL input, then (State=Uploading)
// "Uploading Files" and the file rows. Like Banner, it resets shadcn's Card chrome to the tokens.

function FileUploadCard({ className, ...props }: React.ComponentProps<typeof Card>) {
  return (
    <Card
      data-slot="file-upload-card"
      className={cn(
        "w-80 rounded-r20 bg-background-0 font-default tracking-default text-base-800 ring-0 outline -outline-offset-1 outline-base-100 [--card-spacing:--spacing(5)]",
        className
      )}
      {...props}
    />
  )
}

/** Figma Head: title left, close right, 24px tall. */
function FileUploadCardHeader({ className, ...props }: React.ComponentProps<typeof CardHeader>) {
  return <CardHeader data-slot="file-upload-card-header" className={cn("items-center gap-0", className)} {...props} />
}

/** Figma "Upload Files": Inter Bold 14/24. */
function FileUploadCardTitle({ className, ...props }: React.ComponentProps<typeof CardTitle>) {
  return (
    <CardTitle
      data-slot="file-upload-card-title"
      className={cn("font-default text-14 leading-24 font-bold tracking-default text-base-800", className)}
      {...props}
    />
  )
}

/** Figma material-close (20px) in the head. */
function FileUploadCardClose({ "aria-label": label = "Close", ...props }: React.ComponentProps<typeof Button>) {
  return (
    <CardAction className="self-center">
      <Button data-slot="file-upload-card-close" variant="ghost" size="icon-20" shape="pill" aria-label={label} {...props}>
        <ButtonIcon src="/icons/material-close.svg" />
      </Button>
    </CardAction>
  )
}

/** Body: a 20px stack (drop area, divider, URL input, list). */
function FileUploadCardContent({ className, ...props }: React.ComponentProps<typeof CardContent>) {
  return <CardContent data-slot="file-upload-card-content" className={cn("flex flex-col gap-5", className)} {...props} />
}

/** Figma "Uploading Files": Inter Bold 12/20. */
function FileUploadListLabel({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="file-upload-list-label"
      className={cn("font-default text-12 leading-20 font-bold tracking-default text-base-750", className)}
      {...props}
    />
  )
}

/** Figma Files slot: file rows 8px apart. */
function FileUploadList({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="file-upload-list" className={cn("flex flex-col gap-2", className)} {...props} />
}

export {
  FileUploadCard,
  FileUploadCardClose,
  FileUploadCardContent,
  FileUploadCardHeader,
  FileUploadCardTitle,
  FileUploadList,
  FileUploadListLabel,
}
