"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Figma Forms: File Upload (9402:22988), sets Form-Upload-Files (9411:3320) and
// Form-Upload-Files-Images (11954:8561). A 200px dashed drop area (r12) wrapping a hidden native
// file input: Badge-Icon-Pilled, "Drag & Drop Files or browse files", and a size / type hint.
// States: Hover (pointer), Drag (files dragged over), Focused (keyboard focus on the input, solid
// stroke), Error (aria-invalid on the input), Disabled (disabled input). Hover / Drag / Focused can
// be pinned with `status` for previews. Colors are vars on the root, read by the parts.
const fileUploadVariants = cva(
  "group/file-upload relative flex h-50 w-full cursor-pointer flex-col items-center justify-center gap-6 rounded-r12 bg-(--file-upload-bg) px-4 font-default tracking-default outline outline-dashed outline-(--file-upload-stroke) -outline-offset-1 transition-[background-color,outline-color,opacity] [--file-upload-bg:var(--background-0)] [--file-upload-stroke:var(--base-200)] " +
    // Hover
    "not-has-disabled:hover:[--file-upload-bg:var(--background-30)] not-has-disabled:hover:[--file-upload-stroke:var(--base-300)] " +
    // Drag (data-dragging is set while files are over the area)
    "data-dragging:[--file-upload-bg:var(--background-20)] data-dragging:[--file-upload-stroke:var(--primary-600)] " +
    // Focused (keyboard focus): solid stroke
    "has-focus-visible:outline-solid has-focus-visible:[--file-upload-bg:var(--background-20)] has-focus-visible:[--file-upload-stroke:var(--primary-600)] " +
    // Error
    "has-[[aria-invalid=true]]:[--file-upload-stroke:var(--danger-600)] " +
    // Disabled
    "has-disabled:cursor-not-allowed has-disabled:opacity-50 has-disabled:[--file-upload-bg:var(--background-0)] has-disabled:[--file-upload-stroke:var(--base-100)]",
  {
    variants: {
      // Pinned Figma State for previews; pointer, drag and keyboard focus apply them live
      status: {
        default: "",
        hover: "[--file-upload-bg:var(--background-30)] [--file-upload-stroke:var(--base-300)]",
        drag: "[--file-upload-bg:var(--background-20)] [--file-upload-stroke:var(--primary-600)]",
        focused: "outline-solid [--file-upload-bg:var(--background-20)] [--file-upload-stroke:var(--primary-600)]",
      },
    },
    defaultVariants: {
      status: "default",
    },
  }
)

type FileUploadStatus = NonNullable<VariantProps<typeof fileUploadVariants>["status"]>

/** Figma Icon inside a Badge-Icon-Pilled: a single-color SVG as a mask, sized by the badge. */
function FileUploadIcon({ src, className, style, ...props }: React.ComponentProps<"span"> & { src: string }) {
  return (
    <span
      data-slot="file-upload-icon"
      aria-hidden
      className={cn("size-(--badge-icon) shrink-0 bg-current mask-contain mask-center mask-no-repeat", className)}
      style={{ maskImage: `url(${src})`, ...style }}
      {...props}
    />
  )
}

// Figma Badge-Icon-Pilled: the neutral one is Badge `base` (white, base-100 stroke) with a gray
// icon; tinted ones are Badge `soft-border` in the state color.
const fileUploadBadgeVariants = cva("px-0", {
  variants: {
    tone: {
      neutral: "text-base-600",
      primary: "",
      danger: "",
      success: "",
    },
  },
  defaultVariants: {
    tone: "neutral",
  },
})

type FileUploadBadgeTone = NonNullable<VariantProps<typeof fileUploadBadgeVariants>["tone"]>

const badgeColor = { primary: "primary", danger: "red", success: "green" } as const

/** Figma Badge-Icon-Pilled: 40px in the drop area, 32px in a file row. */
function FileUploadBadge({
  tone = "neutral",
  size = "40",
  icon,
  className,
  ...props
}: Omit<React.ComponentProps<typeof Badge>, "size" | "color" | "variant" | "shape" | "children"> & {
  tone?: FileUploadBadgeTone
  size?: "40" | "32"
  icon: string
}) {
  return (
    <Badge
      data-slot="file-upload-badge"
      data-tone={tone}
      variant={tone === "neutral" ? "base" : "soft-border"}
      color={tone === "neutral" ? "primary" : badgeColor[tone]}
      size={size === "40" ? "square-40" : "square-32"}
      shape="pill"
      className={cn(fileUploadBadgeVariants({ tone }), className)}
      {...props}
    >
      <FileUploadIcon src={icon} />
    </Badge>
  )
}

/** Figma Head: "Drag & Drop Files or" + the "browse files" link, Inter Bold 11/20. */
function FileUploadTitle({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="file-upload-title"
      className={cn("text-center text-11 leading-20 font-bold text-base-800", className)}
      {...props}
    />
  )
}

/** Figma "browse files": primary text inside the title; the whole area opens the picker. */
function FileUploadBrowse({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="file-upload-browse"
      className={cn(
        "text-primary-600 underline-offset-2 group-hover/file-upload:underline group-has-disabled/file-upload:no-underline",
        className
      )}
      {...props}
    />
  )
}

/** Figma "Max File Size 256MB": Inter Bold 10/16, red on Error. */
function FileUploadHint({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="file-upload-hint"
      className={cn(
        "text-center text-10 leading-16 font-bold text-base-300 group-has-[[aria-invalid=true]]/file-upload:text-danger-600",
        className
      )}
      {...props}
    />
  )
}

const kinds = {
  files: { icon: "/icons/material-upload-file.svg", tone: "neutral", hint: "Max File Size 256MB" },
  images: { icon: "/icons/material-image.svg", tone: "primary", hint: "PNG, JPG, GIF up to 10MB" },
} as const

function FileUpload({
  className,
  kind = "files",
  status = "default",
  hint,
  title = "Drag & Drop Files or",
  browseText = "browse files",
  onFilesChange,
  onChange,
  ...props
}: Omit<React.ComponentProps<"input">, "type" | "title"> & {
  /** Figma set: Form-Upload-Files (`files`) or Form-Upload-Files-Images (`images`). */
  kind?: keyof typeof kinds
  status?: FileUploadStatus
  hint?: React.ReactNode
  title?: React.ReactNode
  browseText?: React.ReactNode
  onFilesChange?: (files: File[]) => void
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = React.useState(false)
  const invalid = props["aria-invalid"] === true || props["aria-invalid"] === "true"
  const config = kinds[kind]

  return (
    <label
      data-slot="file-upload"
      data-kind={kind}
      data-status={status}
      data-dragging={dragging || undefined}
      className={cn(fileUploadVariants({ status }), className)}
      onDragOver={(event) => {
        if (props.disabled) return
        event.preventDefault()
        setDragging(true)
      }}
      onDragLeave={(event) => {
        if (event.currentTarget.contains(event.relatedTarget as Node | null)) return
        setDragging(false)
      }}
      onDrop={(event) => {
        setDragging(false)
        if (props.disabled || !inputRef.current) return
        event.preventDefault()
        inputRef.current.files = event.dataTransfer.files
        onFilesChange?.(Array.from(event.dataTransfer.files))
      }}
    >
      <input
        ref={inputRef}
        type="file"
        data-slot="file-upload-control"
        className="sr-only"
        onChange={(event) => {
          onFilesChange?.(Array.from(event.currentTarget.files ?? []))
          onChange?.(event)
        }}
        {...props}
      />
      <FileUploadBadge icon={config.icon} tone={invalid ? "danger" : config.tone} />
      <span className="flex flex-col items-center gap-2">
        <FileUploadTitle>
          {title} <FileUploadBrowse>{browseText}</FileUploadBrowse>
        </FileUploadTitle>
        <FileUploadHint>{hint ?? config.hint}</FileUploadHint>
      </span>
    </label>
  )
}

export {
  FileUpload,
  FileUploadBadge,
  FileUploadBrowse,
  FileUploadHint,
  FileUploadIcon,
  FileUploadTitle,
  fileUploadVariants,
  type FileUploadBadgeTone,
  type FileUploadStatus,
}
