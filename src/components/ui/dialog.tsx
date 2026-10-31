"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button, ButtonIcon } from "@/components/ui/button"

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({ className, ...props }: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-base-900/20 duration-100 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    />
  )
}

/**
 * Figma Dialog-Popup (9457:6527) and Dialog-Horizontal-Popup (9457:6717).
 * `variant` = Figma Type/Style (Default | Black), `layout` = vertical (head,
 * content, footer) or horizontal (head, buttons). Sets --dialog-icon,
 * --dialog-text for the slots.
 */
const dialogContentVariants = cva(
  "flex w-70 flex-col rounded-r20 font-default outline-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-background-0 text-base-700 [--dialog-icon:var(--base-500)] [--dialog-text:var(--base-600)] shadow-[inset_0_0_0_1px_var(--base-100),0_16px_32px_0_var(--shadow-base)]",
        black:
          "bg-base-900/80 text-base-0 [--dialog-icon:var(--base-0)] [--dialog-text:var(--base-200)] shadow-[0_16px_32px_0_var(--shadow-base)]",
        // Figma Modal-* sets (Head-Modal-Component, content, Footer-Modal-Component)
        modal:
          "relative bg-background-0 text-base-700 [--dialog-icon:var(--base-500)] [--dialog-text:var(--base-500)] shadow-[inset_0_0_0_1px_var(--base-100),0_16px_32px_0_var(--shadow-base)]",
      },
      // Panel width: default keeps the dialog width; Modal-Default is 228, content modals 360 / 600
      size: {
        default: "",
        sm: "w-57",
        md: "w-90",
        lg: "w-150",
      },
      layout: {
        vertical:
          "[&>[data-slot=dialog-description]]:px-4 [&>[data-slot=dialog-description]]:py-2 [&>[data-slot=dialog-footer]]:h-12 [&>[data-slot=dialog-footer]]:items-end [&>[data-slot=dialog-footer]]:px-4 [&>[data-slot=dialog-footer]]:pb-4 [&>[data-slot=dialog-header]]:h-13 [&>[data-slot=dialog-header]]:px-4 [&>[data-slot=dialog-header]]:pt-4",
        horizontal: "gap-2 p-3",
        modal: "",
      },
    },
    defaultVariants: { variant: "default", layout: "vertical", size: "default" },
  }
)

/** Static panel (no portal / overlay): for inline previews and embedding. */
function DialogPanel({
  className,
  variant = "default",
  layout = "vertical",
  size = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof dialogContentVariants>) {
  return (
    <DialogPrimitive.Root open modal={false}>
      <div
        data-slot="dialog-panel"
        data-variant={variant}
        className={cn(dialogContentVariants({ variant, layout, size }), className)}
        {...props}
      />
    </DialogPrimitive.Root>
  )
}

function DialogContent({
  className,
  variant = "default",
  layout = "vertical",
  size = "default",
  ...props
}: DialogPrimitive.Popup.Props & VariantProps<typeof dialogContentVariants>) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        data-variant={variant}
        className={cn(
          dialogContentVariants({ variant, layout, size }),
          "fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        )}
        {...props}
      />
    </DialogPortal>
  )
}

/** Figma `Head` (280x52): Group (icon, heading, badge). */
function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
}

/** Figma leading Icon (20px), tinted by the variant. Default: circle-dot placeholder. */
function DialogIcon({
  className,
  src = "/icons/material-default-icon.svg",
  style,
  ...props
}: React.ComponentProps<"span"> & { src?: string }) {
  return (
    <span
      data-slot="dialog-icon"
      aria-hidden
      style={{ maskImage: `url(${src})`, ...style }}
      className={cn(
        "size-5 shrink-0 bg-(--dialog-icon) mask-contain mask-center mask-no-repeat",
        className
      )}
      {...props}
    />
  )
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("truncate text-12 leading-20 font-bold", className)}
      {...props}
    />
  )
}

/** Figma pilled Badge in the head; use `variant="gray"` on the black type. */
function DialogBadge({ ...props }: React.ComponentProps<typeof Badge>) {
  return <Badge data-slot="dialog-badge" size="20" {...props} />
}

/** Figma `Content` (280x36): 12px semibold body text. */
function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-12 leading-20 font-semibold text-(--dialog-text)",
        className
      )}
      {...props}
    />
  )
}

/** Figma `Footer` / `Buttons` row: actions, 8px apart. */
function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
}

/** Figma Head-Modal-Component: Type=Default (left) or Center. Holds icon, heading and the close slot. */
const dialogModalHeadVariants = cva("flex flex-col gap-3 px-5 pt-5", {
  variants: {
    align: { left: "items-start text-left", center: "items-center text-center" },
  },
  defaultVariants: { align: "left" },
})

function DialogModalHead({
  className,
  align = "left",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof dialogModalHeadVariants>) {
  return (
    <div
      data-slot="dialog-modal-head"
      data-align={align}
      className={cn(dialogModalHeadVariants({ align }), className)}
      {...props}
    />
  )
}

/** Figma Badge-Icon-Pilled (40, white fill, base-100 stroke) with a 20px icon. */
function DialogModalIcon({ src, className, ...props }: React.ComponentProps<typeof Badge> & { src?: string }) {
  return (
    <Badge data-slot="dialog-modal-icon" variant="base" size="square-40" shape="pill" className={className} {...props}>
      <DialogIcon src={src} />
    </Badge>
  )
}

/** Figma Heading group: Heading Modal + About Text, 12px apart. */
function DialogModalHeading({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-modal-heading" className={cn("flex w-full flex-col gap-3", className)} {...props} />
}

function DialogModalTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-modal-title"
      className={cn("text-14 leading-24 font-semibold text-base-900", className)}
      {...props}
    />
  )
}

function DialogModalDescription({ className, ...props }: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-modal-description"
      className={cn("text-11 leading-20 font-semibold text-(--dialog-text)", className)}
      {...props}
    />
  )
}

/** Figma Close (24): top-right close button of the modal. */
function DialogModalClose({ className, ...props }: DialogPrimitive.Close.Props) {
  return (
    <DialogPrimitive.Close
      data-slot="dialog-modal-close"
      aria-label="Close"
      className={cn("absolute top-6 right-6", className)}
      render={<Button variant="ghost" size="icon-24" />}
      {...props}
    >
      <ButtonIcon src="/icons/material-close.svg" />
    </DialogPrimitive.Close>
  )
}

/** Modal content area between head and footer. */
function DialogModalBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-modal-body" className={cn("flex flex-col gap-3 px-5 pt-3", className)} {...props} />
}

/** Figma Footer-Modal-Component: Left / Block (full-width buttons) / Center. Style comes from the Button variants. */
const dialogModalFooterVariants = cva("flex flex-col gap-4 px-5 pt-3 pb-5", {
  variants: {
    layout: {
      left: "items-start",
      block: "items-stretch *:data-[slot=dialog-modal-actions]:*:flex-1",
      center: "items-center",
    },
  },
  defaultVariants: { layout: "left" },
})

function DialogModalFooter({
  className,
  layout = "left",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof dialogModalFooterVariants>) {
  return (
    <div
      data-slot="dialog-modal-footer"
      data-layout={layout}
      className={cn(dialogModalFooterVariants({ layout }), className)}
      {...props}
    />
  )
}

/** Figma Buttons row (gap 8). */
function DialogModalActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-modal-actions" className={cn("flex items-center gap-2", className)} {...props} />
}

export {
  DialogModalActions,
  DialogModalBody,
  DialogModalClose,
  DialogModalDescription,
  DialogModalFooter,
  DialogModalHead,
  DialogModalHeading,
  DialogModalIcon,
  DialogModalTitle,
  dialogModalFooterVariants,
  dialogModalHeadVariants,
  Dialog,
  DialogBadge,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogIcon,
  DialogOverlay,
  DialogPanel,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  dialogContentVariants,
}
