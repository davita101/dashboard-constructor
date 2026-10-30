"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { inputSizeVariants, type InputShape, type InputSize } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// Figma Forms: File Input (12015:2400), sets File-Input-Rounded (12015:19184) and
// File-Input-Pilled (12015:25962). Input row = "Select File" part + value part, two frames that
// overlap by 1px so their strokes form the divider; only the outer corners keep the size radius.
// Size × Shape come from Input (inputSizeVariants: height, radius, type size, --input-px).
// States: Hover (pointer), Active (keyboard focus on the native input, or the pinned status),
// Disabled (disabled input). Colors are set as vars on the root and read by the parts.
const fileInputVariants = cva(
  "group/file-input relative isolate flex w-full min-w-0 cursor-pointer items-stretch font-default font-semibold tracking-default transition-[box-shadow,opacity] " +
    "shadow-[0_0_0_4px_var(--file-input-ring)] [--file-input-ring:transparent] [--file-input-stroke:var(--base-100)] [--file-input-trigger-bg:var(--background-30)] [--file-input-trigger-fg:var(--base-600)] [--file-input-value-bg:var(--background-0)] [--file-input-value-fg:var(--base-700)] " +
    // Hover
    "not-has-disabled:hover:[--file-input-stroke:var(--base-150)] not-has-disabled:hover:[--file-input-trigger-bg:var(--background-60)] not-has-disabled:hover:[--file-input-value-bg:var(--background-10)] not-has-disabled:hover:[--file-input-value-fg:var(--base-600)] " +
    // Active (keyboard focus)
    "has-focus-visible:[--file-input-ring:var(--base-alpha-20)] has-focus-visible:[--file-input-stroke:var(--base-200)] has-focus-visible:[--file-input-trigger-bg:var(--background-60)] has-focus-visible:[--file-input-value-bg:var(--background-10)] has-focus-visible:[--file-input-value-fg:var(--base-600)] " +
    // Disabled
    "has-disabled:cursor-not-allowed has-disabled:opacity-50 has-disabled:[--file-input-value-fg:var(--base-600)]",
  {
    variants: {
      // Pinned Figma State=Hover / Active for previews; pointer and keyboard focus get them automatically
      status: {
        default: "",
        hover:
          "[--file-input-stroke:var(--base-150)] [--file-input-trigger-bg:var(--background-60)] [--file-input-value-bg:var(--background-10)] [--file-input-value-fg:var(--base-600)]",
        active:
          "[--file-input-ring:var(--base-alpha-20)] [--file-input-stroke:var(--base-200)] [--file-input-trigger-bg:var(--background-60)] [--file-input-value-bg:var(--background-10)] [--file-input-value-fg:var(--base-600)]",
      },
    },
    defaultVariants: {
      status: "default",
    },
  }
)

// Shared look of the two Figma Input frames: 1px inside stroke, outer corners only, 1px overlap
const fileInputPartVariants = cva(
  "flex min-w-0 items-center px-(--input-px) outline outline-(--file-input-stroke) -outline-offset-1 transition-[outline-color,background-color,color]",
  {
    variants: {
      part: {
        trigger: "shrink-0 rounded-l-[inherit] bg-(--file-input-trigger-bg) whitespace-nowrap text-(--file-input-trigger-fg)",
        value: "-ml-px flex-1 rounded-r-[inherit] bg-(--file-input-value-bg) text-(--file-input-value-fg)",
      },
    },
  }
)

type FileInputStatus = NonNullable<VariantProps<typeof fileInputVariants>["status"]>

/** Figma left frame: the "Select File" button face. Decorative: the native input is the control. */
function FileInputTrigger({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="file-input-trigger"
      aria-hidden
      className={cn(fileInputPartVariants({ part: "trigger" }), className)}
      {...props}
    />
  )
}

/** Figma right frame: "No files selected" or the chosen file name(s). */
function FileInputValue({ className, children, ...props }: React.ComponentProps<"span">) {
  return (
    <span data-slot="file-input-value" className={cn(fileInputPartVariants({ part: "value" }), className)} {...props}>
      <span className="truncate">{children}</span>
    </span>
  )
}

function describeFiles(files: FileList | null, placeholder: React.ReactNode) {
  if (!files || files.length === 0) return placeholder
  if (files.length === 1) return files[0].name
  return `${files.length} files selected`
}

function FileInput({
  className,
  size = "40",
  shape = "rounded",
  status = "default",
  triggerText = "Select File",
  placeholder = "No files selected",
  onChange,
  ...props
}: Omit<React.ComponentProps<"input">, "size" | "type" | "placeholder"> & {
  size?: InputSize
  shape?: InputShape
  status?: FileInputStatus
  triggerText?: React.ReactNode
  placeholder?: React.ReactNode
}) {
  const [files, setFiles] = React.useState<FileList | null>(null)

  return (
    <label
      data-slot="file-input"
      data-size={size}
      data-status={status}
      className={cn(inputSizeVariants({ size, shape }), fileInputVariants({ status }), className)}
    >
      <input
        type="file"
        data-slot="file-input-control"
        className="sr-only"
        onChange={(event) => {
          setFiles(event.currentTarget.files)
          onChange?.(event)
        }}
        {...props}
      />
      <FileInputTrigger>{triggerText}</FileInputTrigger>
      <FileInputValue>{describeFiles(files, placeholder)}</FileInputValue>
    </label>
  )
}

export { FileInput, FileInputTrigger, FileInputValue, fileInputVariants, type FileInputStatus }
