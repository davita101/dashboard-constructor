"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

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
      },
      layout: {
        vertical:
          "[&>[data-slot=dialog-description]]:px-4 [&>[data-slot=dialog-description]]:py-2 [&>[data-slot=dialog-footer]]:h-12 [&>[data-slot=dialog-footer]]:items-end [&>[data-slot=dialog-footer]]:px-4 [&>[data-slot=dialog-footer]]:pb-4 [&>[data-slot=dialog-header]]:h-13 [&>[data-slot=dialog-header]]:px-4 [&>[data-slot=dialog-header]]:pt-4",
        horizontal: "gap-2 p-3",
      },
    },
    defaultVariants: { variant: "default", layout: "vertical" },
  }
)

/** Static panel (no portal / overlay): for inline previews and embedding. */
function DialogPanel({
  className,
  variant = "default",
  layout = "vertical",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof dialogContentVariants>) {
  return (
    <DialogPrimitive.Root open modal={false}>
      <div
        data-slot="dialog-panel"
        data-variant={variant}
        className={cn(dialogContentVariants({ variant, layout }), className)}
        {...props}
      />
    </DialogPrimitive.Root>
  )
}

function DialogContent({
  className,
  variant = "default",
  layout = "vertical",
  ...props
}: DialogPrimitive.Popup.Props & VariantProps<typeof dialogContentVariants>) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        data-variant={variant}
        className={cn(
          dialogContentVariants({ variant, layout }),
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

export {
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
