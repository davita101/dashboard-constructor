import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// Figma Alert-Default (toast), Alert-Buttons (card), Alert-List-Buttons (list).
// Each variant sets the surface and the slot colors as CSS vars:
// --alert-fg (title), --alert-desc (body), --alert-icon (info + close), --alert-divider.
const alertVariants = cva(
  "group/alert relative flex font-default tracking-default text-(--alert-fg) outline -outline-offset-1",
  {
    variants: {
      variant: {
        default:
          "bg-background-0 outline-background-100 shadow-[0_1px_2px_0_var(--shadow-base)] [--alert-desc:var(--base-600)] [--alert-divider:var(--base-150)] [--alert-fg:var(--base-800)] [--alert-icon:var(--base-500)]",
        "primary-soft":
          "bg-primary-alpha-5 outline-primary-alpha-50 [--alert-desc:var(--primary-700)] [--alert-divider:var(--primary-alpha-25)] [--alert-fg:var(--primary-700)] [--alert-icon:var(--primary-600)]",
        "success-soft":
          "bg-success-alpha-5 outline-success-alpha-50 [--alert-desc:var(--success-700)] [--alert-divider:var(--success-alpha-25)] [--alert-fg:var(--success-700)] [--alert-icon:var(--success-600)]",
        "warning-soft":
          "bg-warning-alpha-5 outline-warning-alpha-50 [--alert-desc:var(--warning-700)] [--alert-divider:var(--warning-alpha-25)] [--alert-fg:var(--warning-700)] [--alert-icon:var(--warning-600)]",
        "danger-soft":
          "bg-danger-alpha-5 outline-danger-alpha-50 [--alert-desc:var(--danger-700)] [--alert-divider:var(--danger-alpha-25)] [--alert-fg:var(--danger-700)] [--alert-icon:var(--danger-600)]",
        black:
          "bg-black-alpha-80 outline-transparent [--alert-desc:var(--white-alpha-80)] [--alert-divider:var(--white-alpha-20)] [--alert-fg:var(--background-0)] [--alert-icon:var(--white-alpha-80)]",
        primary:
          "bg-primary-600 outline-primary-700 shadow-[0_1px_2px_0_var(--shadow-primary)] [--alert-desc:var(--primary-50)] [--alert-divider:var(--primary-500)] [--alert-fg:var(--background-0)] [--alert-icon:var(--background-0)]",
        success:
          "bg-success-550 outline-success-600 shadow-[0_1px_2px_0_var(--shadow-success)] [--alert-desc:var(--success-50)] [--alert-divider:var(--success-400)] [--alert-fg:var(--background-0)] [--alert-icon:var(--background-0)]",
        warning:
          "bg-warning-500 outline-warning-550 shadow-[0_1px_2px_0_var(--shadow-warning)] [--alert-desc:var(--warning-50)] [--alert-divider:var(--warning-400)] [--alert-fg:var(--background-0)] [--alert-icon:var(--background-0)]",
        danger:
          "bg-danger-500 outline-danger-alpha-50 shadow-[0_1px_2px_0_var(--shadow-danger)] [--alert-desc:var(--danger-50)] [--alert-divider:var(--danger-400)] [--alert-fg:var(--background-0)] [--alert-icon:var(--background-0)]",
        white:
          "bg-background-0 outline-transparent [--alert-desc:var(--black-alpha-80)] [--alert-divider:var(--black-alpha-5)] [--alert-fg:var(--black-alpha-80)] [--alert-icon:var(--black-alpha-50)]",
      },
      layout: {
        // Alert-Default: 32px pill, single row
        toast: "h-8 w-fit max-w-full items-center gap-1 rounded-r32 px-2",
        // Alert-Buttons: heading + divider + description + footer
        card: "w-full items-start justify-between rounded-r16 px-2",
        // Alert-List-Buttons: heading + divider + dash list + footer
        list: "w-full items-start justify-between rounded-r20 px-3",
      },
    },
    // Toast types differ slightly from the card in Figma
    compoundVariants: [
      { layout: "toast", variant: "warning-soft", className: "outline-warning-alpha-30 [--alert-fg:var(--warning-650)]" },
      { layout: "toast", variant: "danger-soft", className: "outline-danger-alpha-30" },
      { layout: "toast", variant: "black", className: "[--alert-icon:var(--background-0)]" },
      { layout: "toast", variant: "primary", className: "outline-primary-650" },
      { layout: "toast", variant: "success", className: "bg-success-575 outline-success-625" },
      { layout: "toast", variant: "danger", className: "outline-danger-600" },
      { layout: "list", variant: "default", className: "[--alert-divider:var(--background-100)]" },
      { layout: "list", variant: "black", className: "[--alert-desc:var(--white-alpha-90)]" },
    ],
    defaultVariants: {
      variant: "default",
      layout: "card",
    },
  }
)

type AlertVariant = NonNullable<VariantProps<typeof alertVariants>["variant"]>

function Alert({
  className,
  variant,
  layout,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      data-layout={layout ?? "card"}
      role="alert"
      className={cn(alertVariants({ variant, layout }), className)}
      {...props}
    />
  )
}

/** Card/list body column: heading, divider, description, footer. */
function AlertContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-content"
      className={cn(
        "flex min-w-0 flex-1 flex-col pt-2 pb-1 group-data-[layout=list]/alert:pt-3",
        className
      )}
      {...props}
    />
  )
}

/** Card/list heading row. */
function AlertHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="alert-header" className={cn("flex items-center pb-2", className)} {...props} />
  )
}

/** Figma Divider-Horizontal under the heading, in the variant's divider color. */
function AlertSeparator({ className, ...props }: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="alert-separator"
      className={cn("bg-(--alert-divider)", className)}
      {...props}
    />
  )
}

/** Figma material-close (16px), tinted with the variant's icon color. */
function AlertClose({ className, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="alert-close"
      variant="bare"
      size="icon-16"
      aria-label="Close"
      className={cn(
        "group-data-[layout=card]/alert:mt-2 group-data-[layout=list]/alert:mt-3",
        className
      )}
      {...props}
    >
      <span
        aria-hidden
        className="size-4 bg-(--alert-icon) mask-[url(/icons/material-close.svg)] mask-contain mask-center mask-no-repeat"
      />
    </Button>
  )
}

/** Figma material-info2, tinted with the variant's icon color. */
function AlertIcon({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="alert-icon"
      aria-hidden
      className={cn(
        "size-6 shrink-0 bg-(--alert-icon) mask-[url(/icons/material-info2.svg)] mask-contain mask-center mask-no-repeat",
        className
      )}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "min-w-0 truncate px-2 text-11 leading-20 font-bold group-data-[layout=card]/alert:flex-1 group-data-[layout=card]/alert:px-1.5 group-data-[layout=list]/alert:flex-1 group-data-[layout=list]/alert:px-1.5 group-data-[layout=list]/alert:text-12",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "px-2 py-3 text-11 leading-20 font-semibold text-(--alert-desc) group-data-[layout=list]/alert:px-0 group-data-[layout=list]/alert:py-2",
        className
      )}
      {...props}
    />
  )
}

/** Alert-List-Buttons body: em-dash list. */
function AlertList({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="alert-list" className={cn("flex flex-col", className)} {...props} />
}

function AlertListItem({ className, children, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="alert-list-item"
      className={cn(
        "flex items-center gap-2 px-2 py-1 text-10 leading-16 font-semibold text-(--alert-desc)",
        className
      )}
      {...props}
    >
      <span aria-hidden className="text-9 font-bold">
        —
      </span>
      {children}
    </li>
  )
}

/** Card/list footer row with the buttons. */
function AlertFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-footer"
      className={cn("flex items-center gap-2 px-2 pt-1 pb-3", className)}
      {...props}
    />
  )
}

/** Toast trailing slot (button + close); kept for shadcn API parity. */
function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn("flex shrink-0 items-center gap-1", className)}
      {...props}
    />
  )
}

export {
  Alert,
  AlertAction,
  AlertClose,
  AlertContent,
  AlertDescription,
  AlertFooter,
  AlertHeader,
  AlertIcon,
  AlertList,
  AlertListItem,
  AlertSeparator,
  AlertTitle,
  alertVariants,
  type AlertVariant,
}
