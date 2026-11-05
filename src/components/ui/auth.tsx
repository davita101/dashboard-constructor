import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { Badge, BadgeIcon } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Figma Templates > Auth (page 7058:304041): Sign-In-01/02, Sign-Up-01/02, Forgot-Password,
// New-Password, Check-Email, Password-Reset-Done, Two-Factor-Authentication, Activation.
// These are the shared slots; the domain templates in src/components/auth compose them with
// Input, Button, Link, Checkbox, Separator, Input-OTP and QR-Code.

const authVariants = cva("flex flex-col font-default tracking-default", {
  variants: {
    // Figma frame widths: 280 (Sign-In/Up, 2FA, Activation), 320 (Forgot / New password, Check email, Reset done)
    size: {
      "280": "w-70",
      "320": "w-80",
    },
    gap: {
      "5": "gap-5",
      "6": "gap-6",
      "8": "gap-8",
    },
  },
  defaultVariants: {
    size: "280",
    gap: "5",
  },
})

/** Template frame: a centered column. */
function Auth({ className, size, gap, ...props }: React.ComponentProps<"div"> & VariantProps<typeof authVariants>) {
  return <div data-slot="auth" className={cn(authVariants({ size, gap }), className)} {...props} />
}

/** Figma Form card of Sign-In-02 / Sign-Up-02: 20px radius, background-100 stroke inside. */
const authPanelVariants = cva(
  "flex w-full flex-col rounded-r20 bg-background-0 outline outline-background-100 -outline-offset-1",
  {
    variants: {
      padding: {
        default: "gap-5 p-5",
        tall: "gap-6 px-5 pt-7 pb-5",
        // Sign-In-01: bare on the white page panel below lg, a shadowed card from lg.
        responsive: "gap-0 bg-transparent p-0 outline-transparent lg:gap-5 lg:bg-background-0 lg:p-5 lg:shadow-md lg:outline-background-100",
      },
    },
    defaultVariants: {
      padding: "default",
    },
  }
)

function AuthPanel({ className, padding, ...props }: React.ComponentProps<"div"> & VariantProps<typeof authPanelVariants>) {
  return <div data-slot="auth-panel" className={cn(authPanelVariants({ padding }), className)} {...props} />
}

/** Figma Head: icon, title and text. `compact` is the Sign-In/Up head (title + one line, 12px apart). */
const authHeadVariants = cva("flex flex-col", {
  variants: {
    align: {
      center: "items-center text-center",
      start: "items-start text-left",
    },
    gap: {
      default: "gap-5",
      compact: "gap-3",
    },
  },
  defaultVariants: {
    align: "center",
    gap: "default",
  },
})

function AuthHead({ className, align, gap, ...props }: React.ComponentProps<"div"> & VariantProps<typeof authHeadVariants>) {
  return <div data-slot="auth-head" className={cn(authHeadVariants({ align, gap }), className)} {...props} />
}

/** Figma Badge-Icon-Pilled, 60x60: white disc with a base-100 stroke, or a soft green disc on success. */
const authIconVariants = cva("", {
  variants: {
    tone: {
      default: "text-base-500",
      success: "",
    },
  },
  defaultVariants: {
    tone: "default",
  },
})

function AuthIcon({
  src,
  tone = "default",
  className,
  ...props
}: Omit<React.ComponentProps<typeof Badge>, "children" | "color" | "variant" | "size" | "shape"> &
  VariantProps<typeof authIconVariants> & { src: string }) {
  return (
    <Badge
      data-slot="auth-icon"
      size="square-60"
      shape="pill"
      variant={tone === "success" ? "soft-border" : "base"}
      color={tone === "success" ? "green" : undefined}
      className={cn(authIconVariants({ tone }), className)}
      {...props}
    >
      <BadgeIcon src={src} />
    </Badge>
  )
}

function AuthTitle({ className, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1
      data-slot="auth-title"
      className={cn("text-18 leading-28 font-semibold text-base-700", className)}
      {...props}
    />
  )
}

const authDescriptionVariants = cva("font-bold", {
  variants: {
    tone: {
      muted: "text-11 leading-20 text-base-400",
      subtle: "text-11 leading-20 text-base-500",
      accent: "text-11 leading-20 text-blue-600",
      large: "text-12 leading-20 text-base-500",
    },
  },
  defaultVariants: {
    tone: "muted",
  },
})

function AuthDescription({
  className,
  tone,
  ...props
}: React.ComponentProps<"p"> & VariantProps<typeof authDescriptionVariants>) {
  return <p data-slot="auth-description" className={cn(authDescriptionVariants({ tone }), className)} {...props} />
}

/** Figma Content: fields and buttons, 20px apart. */
function AuthContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="auth-content" className={cn("flex w-full flex-col gap-5", className)} {...props} />
}

/** Figma Inputs: the field stack (12px apart, 20px in Sign-Up-02). */
const authFieldsVariants = cva("flex w-full flex-col", {
  variants: {
    gap: {
      "3": "gap-3",
      "5": "gap-5",
    },
  },
  defaultVariants: {
    gap: "3",
  },
})

function AuthFields({ className, gap, ...props }: React.ComponentProps<"div"> & VariantProps<typeof authFieldsVariants>) {
  return <div data-slot="auth-fields" className={cn(authFieldsVariants({ gap }), className)} {...props} />
}

/** Figma Checkbox row: checkbox text on the left, a link or forgot-password on the right. */
function AuthRow({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="auth-row" className={cn("flex w-full items-center justify-between gap-3 px-2 [&>label]:shrink-0", className)} {...props} />
}

/** Figma Other: the social buttons, 12px apart. */
function AuthSocial({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="auth-social" className={cn("flex w-full flex-col gap-3", className)} {...props} />
}

/** Figma Footer: text and a link, 10px apart. */
function AuthFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="auth-footer"
      className={cn("flex items-center justify-center gap-2.5 text-12 leading-20 font-bold text-base-500", className)}
      {...props}
    />
  )
}

/** Figma Footer buttons of Sign-Up-02 (Go Back / Continue), 16px apart, equal width. */
function AuthActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="auth-actions" className={cn("flex w-full items-center gap-4 [&>*]:flex-1", className)} {...props} />
}

/** Figma QR Code frame: background-20 tile, 20px radius, QR centered. */
function AuthQr({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="auth-qr"
      className={cn("flex w-full items-center justify-center rounded-r20 bg-background-20 px-20 py-5", className)}
      {...props}
    />
  )
}

export {
  Auth,
  AuthActions,
  AuthContent,
  AuthDescription,
  AuthFields,
  AuthFooter,
  AuthHead,
  AuthIcon,
  AuthPanel,
  AuthQr,
  AuthRow,
  AuthSocial,
  AuthTitle,
  authVariants,
}
