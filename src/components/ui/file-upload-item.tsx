"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { Button, ButtonIcon } from "@/components/ui/button"
import { FileUploadBadge, type FileUploadBadgeTone } from "@/components/ui/file-upload"
import { cn } from "@/lib/utils"

// Figma File-Item-Component (9413:3004): a 48px pill row (base-100 stroke, 8px padding) with a
// 32px Badge-Icon-Pilled, the file name and a sub-line on the left and actions on the right.
// Type = Upload | Progress | Error | Done; the type tints the badge and the name.
const fileUploadItemVariants = cva(
  "group/file-upload-item flex w-full min-w-0 items-center justify-between gap-2 rounded-full bg-background-0 p-2 font-default tracking-default outline outline-base-100 -outline-offset-1",
  {
    variants: {
      status: {
        upload: "",
        progress: "",
        error: "",
        done: "",
      },
    },
    defaultVariants: {
      status: "upload",
    },
  }
)

type FileUploadItemStatus = NonNullable<VariantProps<typeof fileUploadItemVariants>["status"]>

const FileUploadItemContext = React.createContext<FileUploadItemStatus>("upload")

function FileUploadItem({
  className,
  status = "upload",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fileUploadItemVariants>) {
  const s = status ?? "upload"
  return (
    <FileUploadItemContext.Provider value={s}>
      <div
        data-slot="file-upload-item"
        data-status={s}
        className={cn(fileUploadItemVariants({ status: s }), className)}
        {...props}
      />
    </FileUploadItemContext.Provider>
  )
}

const itemBadge: Record<FileUploadItemStatus, { tone: FileUploadBadgeTone; icon: string }> = {
  upload: { tone: "primary", icon: "/icons/material-file-upload.svg" },
  progress: { tone: "primary", icon: "/icons/material-file-upload.svg" },
  error: { tone: "danger", icon: "/icons/material-file-upload.svg" },
  done: { tone: "success", icon: "/icons/material-file-upload.svg" },
}

/** Figma Badge-Icon-Pilled 32: tinted by the row status (blue, red on Error, green on Done). */
function FileUploadItemBadge({ icon, ...props }: Omit<React.ComponentProps<typeof FileUploadBadge>, "icon" | "tone" | "size"> & { icon?: string }) {
  const status = React.useContext(FileUploadItemContext)
  return <FileUploadBadge size="32" tone={itemBadge[status].tone} icon={icon ?? itemBadge[status].icon} {...props} />
}

/** Left side: badge + text column. */
function FileUploadItemMedia({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="file-upload-item-media" className={cn("flex min-w-0 flex-1 items-center gap-3", className)} {...props} />
}

/** Text column: name over the sub-line or the progress bar. */
function FileUploadItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="file-upload-item-content" className={cn("flex min-w-0 flex-1 flex-col", className)} {...props} />
}

/** Figma File Name: Inter Bold 10/16, red on Error, green on Done. */
function FileUploadItemName({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="file-upload-item-name"
      className={cn(
        "truncate text-10 leading-16 font-bold text-base-800 group-data-[status=done]/file-upload-item:text-success-600 group-data-[status=error]/file-upload-item:text-danger-600",
        className
      )}
      {...props}
    />
  )
}

/** Figma sub-line ("5.6mb of 24mb"): Semi Bold 10/16 base-500; on Error Bold 9/16 red. */
function FileUploadItemDescription({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="file-upload-item-description"
      className={cn(
        "truncate text-10 leading-16 font-semibold text-base-500 group-data-[status=error]/file-upload-item:text-9 group-data-[status=error]/file-upload-item:font-bold group-data-[status=error]/file-upload-item:text-danger-600",
        className
      )}
      {...props}
    />
  )
}

/** Right side: progress / status icon / retry, then the close button, 12px apart. */
function FileUploadItemActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="file-upload-item-actions" className={cn("flex shrink-0 items-center gap-3", className)} {...props} />
}

/** Figma material-done on Done: 20px green check. */
function FileUploadItemStatusIcon({
  src = "/icons/material-done.svg",
  className,
  style,
  ...props
}: React.ComponentProps<"span"> & { src?: string }) {
  return (
    <span
      data-slot="file-upload-item-status-icon"
      aria-hidden
      className={cn("size-5 shrink-0 bg-success-600 mask-contain mask-center mask-no-repeat", className)}
      style={{ maskImage: `url(${src})`, ...style }}
      {...props}
    />
  )
}

/** Figma retry icon on Error: a Ghost icon button. */
function FileUploadItemRetry({ "aria-label": label = "Retry upload", ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button data-slot="file-upload-item-retry" variant="ghost" size="icon-28" shape="pill" aria-label={label} {...props}>
      <ButtonIcon src="/icons/material-refresh.svg" />
    </Button>
  )
}

/** Figma Outline-Button 32 with material-close. */
function FileUploadItemRemove({ "aria-label": label = "Remove file", ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button data-slot="file-upload-item-remove" variant="outline" size="icon-32" shape="pill" aria-label={label} {...props}>
      <ButtonIcon src="/icons/material-close.svg" />
    </Button>
  )
}

export {
  FileUploadItem,
  FileUploadItemActions,
  FileUploadItemBadge,
  FileUploadItemContent,
  FileUploadItemDescription,
  FileUploadItemMedia,
  FileUploadItemName,
  FileUploadItemRemove,
  FileUploadItemRetry,
  FileUploadItemStatusIcon,
  fileUploadItemVariants,
  type FileUploadItemStatus,
}
