"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, ButtonIcon, type ButtonSize } from "@/components/ui/button"
import { FieldLabel, FieldLabelIcon } from "@/components/ui/field"
import { cn } from "@/lib/utils"

// Figma Form-Avatar-Add (11553:39491): Head (Label + help) over Content (avatar + Outline-Button
// "Select Image" / "Change Image" + icon-only remove). Size = the avatar size; it sets the stack
// gaps, the label type and, through context, the avatar and button sizes.
const addAvatarVariants = cva("flex flex-col font-default tracking-default [--field-label-fg:var(--base-600)]", {
  variants: {
    size: {
      "60": "gap-4 text-12 leading-20 [--add-avatar-gap:--spacing(4)] [--add-avatar-icon:--spacing(6)] [--field-icon:--spacing(4)] [--field-label-gap:--spacing(2)]",
      "48": "gap-3 text-12 leading-20 [--add-avatar-gap:--spacing(4)] [--add-avatar-icon:--spacing(6)] [--field-icon:--spacing(4)] [--field-label-gap:--spacing(2)]",
      "40": "gap-2 text-12 leading-20 [--add-avatar-gap:--spacing(3)] [--add-avatar-icon:--spacing(6)] [--field-icon:--spacing(4)] [--field-label-gap:--spacing(2)]",
      "32": "gap-2 text-10 leading-16 [--add-avatar-gap:--spacing(2)] [--add-avatar-icon:--spacing(5)] [--field-icon:--spacing(3)] [--field-label-gap:--spacing(1)]",
      "24": "gap-2 text-9 leading-16 [--add-avatar-gap:--spacing(2)] [--add-avatar-icon:--spacing(4)] [--field-icon:--spacing(3)] [--field-label-gap:--spacing(1)]",
    },
  },
  defaultVariants: {
    size: "60",
  },
})

type AddAvatarSize = NonNullable<VariantProps<typeof addAvatarVariants>["size"]>

// Outline-Button sizes per avatar size (Figma: 40 / 32 / 24 / 24 / 24)
const buttonSizes: Record<AddAvatarSize, { text: ButtonSize; icon: ButtonSize }> = {
  "60": { text: "40", icon: "icon-40" },
  "48": { text: "32", icon: "icon-32" },
  "40": { text: "24", icon: "icon-24" },
  "32": { text: "24", icon: "icon-24" },
  "24": { text: "24", icon: "icon-24" },
}

const AddAvatarContext = React.createContext<AddAvatarSize>("60")

function AddAvatar({
  className,
  size = "60",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof addAvatarVariants>) {
  const resolved = size ?? "60"
  return (
    <AddAvatarContext.Provider value={resolved}>
      <div
        role="group"
        data-slot="add-avatar"
        data-size={resolved}
        className={cn(addAvatarVariants({ size: resolved }), className)}
        {...props}
      />
    </AddAvatarContext.Provider>
  )
}

/** Figma Head: label with the help icon. */
function AddAvatarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="add-avatar-header" className={cn("flex items-center", className)} {...props} />
}

function AddAvatarLabel(props: React.ComponentProps<typeof FieldLabel>) {
  return <FieldLabel data-slot="add-avatar-label" {...props} />
}

/** Figma material-help next to the label. */
function AddAvatarLabelIcon(props: React.ComponentProps<typeof FieldLabelIcon>) {
  return <FieldLabelIcon data-slot="add-avatar-label-icon" {...props} />
}

/** Figma Content: avatar on the left, buttons on the right. */
function AddAvatarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="add-avatar-content"
      className={cn("flex items-center gap-(--add-avatar-gap)", className)}
      {...props}
    />
  )
}

/** Figma Avatar (empty: white disc + material-account_circle) or Avatar-Image (with `src`). */
function AddAvatarPreview({
  src,
  alt = "",
  className,
  ...props
}: Omit<React.ComponentProps<typeof Avatar>, "size" | "shape"> & { src?: string; alt?: string }) {
  const size = React.useContext(AddAvatarContext)
  return (
    <Avatar data-slot="add-avatar-preview" size={size} shape="circle" className={className} {...props}>
      {src ? <AvatarImage src={src} alt={alt} /> : null}
      <AvatarFallback variant="placeholder">
        <span
          aria-hidden
          className="size-(--add-avatar-icon) bg-current mask-[url(/icons/material-account-circle.svg)] mask-contain mask-center mask-no-repeat"
        />
      </AvatarFallback>
    </Avatar>
  )
}

/** Figma inner Content: the action buttons, 8px apart. */
function AddAvatarActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="add-avatar-actions" className={cn("flex items-center gap-2", className)} {...props} />
}

/**
 * Figma Outline-Button "Select Image" / "Change Image". Opens the file picker and hands the
 * chosen image to `onFileSelect`.
 */
function AddAvatarButton({
  accept = "image/*",
  onFileSelect,
  onClick,
  children = "Select Image",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size" | "variant" | "shape"> & {
  accept?: string
  onFileSelect?: (file: File) => void
}) {
  const size = React.useContext(AddAvatarContext)
  const inputRef = React.useRef<HTMLInputElement>(null)
  return (
    <>
      <Button
        data-slot="add-avatar-button"
        variant="outline"
        shape="pill"
        size={buttonSizes[size].text}
        onClick={(event) => {
          onClick?.(event)
          inputRef.current?.click()
        }}
        {...props}
      >
        {children}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        hidden
        tabIndex={-1}
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) onFileSelect?.(file)
          event.target.value = ""
        }}
      />
    </>
  )
}

/** Figma icon-only Outline-Button with a close icon: clears the image. */
function AddAvatarRemove({
  "aria-label": ariaLabel = "Remove image",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size" | "variant" | "shape" | "children">) {
  const size = React.useContext(AddAvatarContext)
  return (
    <Button
      data-slot="add-avatar-remove"
      variant="outline"
      shape="pill"
      size={buttonSizes[size].icon}
      aria-label={ariaLabel}
      {...props}
    >
      <ButtonIcon src="/icons/material-close.svg" />
    </Button>
  )
}

export {
  AddAvatar,
  AddAvatarActions,
  AddAvatarButton,
  AddAvatarContent,
  AddAvatarHeader,
  AddAvatarLabel,
  AddAvatarLabelIcon,
  AddAvatarPreview,
  AddAvatarRemove,
  addAvatarVariants,
  type AddAvatarSize,
}
