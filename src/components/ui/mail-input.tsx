import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, ButtonIcon } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Figma Forms: Mail (12273:34772), set Add-Mail-Input (12273:40969), State Default | Active.
// Active is the card's focus-within state: stroke base-200 and a 4px base-alpha-20 ring.

/** Whole component: head (sender + reply) over the mail card. */
function MailInput({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="mail-input"
      className={cn("flex w-70 flex-col gap-3 font-default tracking-default", className)}
      {...props}
    />
  )
}

/** Figma Head: sender avatar + name on the left, Replay button on the right. */
function MailInputHead({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="mail-input-head"
      className={cn("flex h-10 items-center justify-between", className)}
      {...props}
    />
  )
}

function MailInputSender({
  name,
  src,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & { name: string; src?: string }) {
  return (
    <div data-slot="mail-input-sender" className={cn("flex items-center gap-4", className)} {...props}>
      <Avatar size="40">
        {src ? <AvatarImage src={src} alt="" /> : null}
        <AvatarFallback>{name.slice(0, 1)}</AvatarFallback>
      </Avatar>
      <span className="text-11 leading-20 font-semibold text-base-700">{name}</span>
    </div>
  )
}

/** Figma Outline-Button "Replay" with a trailing chevron. */
function MailInputReply({ children, ...props }: Omit<React.ComponentProps<typeof Button>, "variant" | "size">) {
  return (
    <Button data-slot="mail-input-reply" variant="outline" size="32" {...props}>
      {children}
      <ButtonIcon position="end" src="/icons/material-expand-more.svg" />
    </Button>
  )
}

const mailInputCardVariants = cva(
  "flex w-full flex-col gap-4 rounded-r16 bg-background-0 p-4 text-11 leading-20 font-semibold text-base-700 shadow-[0_0_0_0_transparent] outline -outline-offset-1 outline-base-100 transition-[outline-color,box-shadow] focus-within:shadow-[0_0_0_4px_var(--base-alpha-20)] focus-within:outline-base-200"
)

/** Figma Content: the white card. Active state = focus-within. */
function MailInputCard({
  className,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof mailInputCardVariants>) {
  return <div data-slot="mail-input-card" className={cn(mailInputCardVariants(), className)} {...props} />
}

/** Card head: recipient on the left, expand action on the right. */
function MailInputCardHead({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="mail-input-card-head"
      className={cn("flex items-center justify-between", className)}
      {...props}
    />
  )
}

/** Free-text mail body; borderless, grows with content. */
function MailInputBody({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="mail-input-body"
      className={cn(
        "field-sizing-content min-h-12 w-full resize-none bg-transparent font-default text-11 leading-20 font-semibold tracking-default text-base-700 outline-none placeholder:text-base-700 focus:text-base-800",
        className
      )}
      {...props}
    />
  )
}

function MailInputFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="mail-input-footer" className={cn("flex flex-col gap-3", className)} {...props} />
}

/** Figma Footer Group: formatting actions left, delete right. */
function MailInputToolbar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="mail-input-toolbar"
      className={cn("flex items-center justify-between", className)}
      {...props}
    />
  )
}

function MailInputActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="mail-input-actions" className={cn("flex items-center gap-3", className)} {...props} />
}

/** One 20px icon action (Figma material-* icon, base-500). */
function MailInputAction({
  icon,
  label,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "variant" | "size" | "children"> & { icon: string; label: string }) {
  return (
    <Button
      data-slot="mail-input-action"
      variant="muted"
      size="glyph-20"
      aria-label={label}
      {...props}
    >
      <ButtonIcon src={icon} />
    </Button>
  )
}

/** Figma Outline-Button full width. */
function MailInputSend({ children, ...props }: Omit<React.ComponentProps<typeof Button>, "variant" | "size">) {
  return (
    <Button data-slot="mail-input-send" variant="outline" size="32" className="w-full" {...props}>
      {children}
    </Button>
  )
}

export {
  MailInput,
  MailInputHead,
  MailInputSender,
  MailInputReply,
  MailInputCard,
  MailInputCardHead,
  MailInputBody,
  MailInputFooter,
  MailInputToolbar,
  MailInputActions,
  MailInputAction,
  MailInputSend,
  mailInputCardVariants,
}
