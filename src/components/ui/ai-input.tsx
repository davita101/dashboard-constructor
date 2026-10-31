import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { Button, ButtonIcon } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Figma Forms: AI (12814:6371). Sets AI-Form-Chat, AI-Mini-Form, AI-Create-Form (+ -White) and Attachment.
// Tokens inferred from hex (no REST dump). Hover = stroke change, Active = focus-within ring.

const aiInputVariants = cva(
  "group/ai-input flex w-70 flex-col font-default tracking-default text-12 leading-20 font-semibold shadow-[0_0_0_0_transparent] outline -outline-offset-1 transition-[outline-color,box-shadow,background-color]",
  {
    variants: {
      shape: {
        chat: "gap-3 rounded-r20 p-5",
        mini: "h-14 flex-row items-center justify-between gap-2 rounded-r40 p-3",
      },
      tone: {
        light:
          "bg-background-0 text-base-700 outline-base-100 hover:outline-base-150 focus-within:shadow-[0_0_0_4px_var(--base-alpha-20)] focus-within:outline-base-200",
        inverse: "bg-white-alpha-10 text-base-0 outline-white-alpha-10 hover:outline-white-alpha-20 focus-within:shadow-[0_0_0_4px_var(--white-alpha-20)] focus-within:outline-white-alpha-30",
      },
      invalid: {
        true: "bg-danger-50 outline-danger-alpha-20 hover:outline-danger-alpha-20",
        false: "",
      },
    },
    defaultVariants: { shape: "chat", tone: "light", invalid: false },
  }
)

function AiInput({
  className,
  shape,
  tone,
  invalid,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof aiInputVariants>) {
  return (
    <div
      data-slot="ai-input"
      className={cn(aiInputVariants({ shape, tone, invalid }), className)}
      {...props}
    />
  )
}

/** Wraps the card plus an optional error footer so the footer sits flush under it. */
function AiInputRoot({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="ai-input-root" className={cn("flex w-70 flex-col", className)} {...props} />
}

const aiInputTextVariants = cva(
  "min-h-10 w-full resize-none font-default tracking-default bg-transparent text-12 leading-20 font-semibold outline-none",
  {
    variants: {
      tone: {
        light: "text-base-800 placeholder:text-base-500 group-hover/ai-input:placeholder:text-base-600",
        inverse: "text-base-0 placeholder:text-white-alpha-60",
      },
    },
    defaultVariants: { tone: "light" },
  }
)

function AiInputText({
  className,
  tone,
  ...props
}: React.ComponentProps<"textarea"> & VariantProps<typeof aiInputTextVariants>) {
  return <textarea data-slot="ai-input-text" className={cn(aiInputTextVariants({ tone }), className)} {...props} />
}

function AiInputFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="ai-input-footer" className={cn("flex h-8 items-center justify-between", className)} {...props} />
  )
}

function AiInputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="ai-input-group" className={cn("flex items-center gap-2", className)} {...props} />
}

/** Round icon button (plus, tune, mic). `inverse` tone uses the translucent look. */
function AiInputAction({
  icon,
  label,
  tone = "light",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "variant" | "size" | "children"> & {
  icon: string
  label: string
  tone?: "light" | "inverse"
}) {
  return (
    <Button
      data-slot="ai-input-action"
      variant={tone === "inverse" ? "white-soft" : "outline"}
      size="icon-32"
      aria-label={label}
      {...props}
    >
      <ButtonIcon src={icon} />
    </Button>
  )
}

function AiInputSend({
  tone = "light",
  label = "Send",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "variant" | "size" | "children"> & {
  tone?: "light" | "inverse"
  label?: string
}) {
  return (
    <Button
      data-slot="ai-input-send"
      variant={tone === "inverse" ? "white" : "dark"}
      size="icon-32"
      aria-label={label}
      {...props}
    >
      <ButtonIcon src="/icons/material-arrow-upward.svg" />
    </Button>
  )
}

/** Figma GPT button: leading icon, label, trailing chevron. */
function AiInputModel({
  tone = "light",
  children,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "variant" | "size"> & { tone?: "light" | "inverse" }) {
  return (
    <Button data-slot="ai-input-model" variant={tone === "inverse" ? "white-soft" : "outline"} size="32" {...props}>
      <ButtonIcon src="/icons/material-language.svg" />
      {children}
      <ButtonIcon position="end" src="/icons/material-expand-more.svg" />
    </Button>
  )
}

function AiInputAttachments({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="ai-input-attachments" className={cn("flex items-center gap-2", className)} {...props} />
}

const aiInputAttachmentVariants = cva(
  "group/attachment relative inline-flex h-7 items-center gap-1.5 overflow-hidden rounded-r8 p-1 text-11 leading-20 font-semibold outline -outline-offset-1 transition-[outline-color]",
  {
    variants: {
      look: {
        default: "bg-background-0 text-base-800 outline-base-100 hover:outline-base-150",
        black: "bg-white-alpha-20 text-base-0 outline-white-alpha-10",
      },
    },
    defaultVariants: { look: "default" },
  }
)

/** Figma Attachment (Style=Default|Black): file icon or thumbnail + name; hover reveals the close button. */
function AiInputAttachment({
  name,
  image,
  look,
  onRemove,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> &
  VariantProps<typeof aiInputAttachmentVariants> & { name?: string; image?: string; onRemove?: () => void }) {
  return (
    <div data-slot="ai-input-attachment" className={cn(aiInputAttachmentVariants({ look }), className)} {...props}>
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className="size-5 shrink-0 rounded-r4 object-cover" />
      ) : (
        <span
          aria-hidden
          className="size-5 shrink-0 bg-base-500 mask-[url(/icons/material-upload-file.svg)] mask-contain mask-center mask-no-repeat"
        />
      )}
      {name ? <span className="pr-1">{name}</span> : null}
      {onRemove ? (
        <span className="absolute inset-y-0 right-0 flex w-16.5 items-center justify-end bg-linear-to-r from-transparent to-background-0 pr-0.5 opacity-0 transition-opacity group-hover/attachment:opacity-100 group-focus-within/attachment:opacity-100">
          <Button type="button" variant="danger" size="icon-20" aria-label={`Remove ${name ?? "attachment"}`} onClick={onRemove}>
            <ButtonIcon src="/icons/material-close.svg" />
          </Button>
        </span>
      ) : null}
    </div>
  )
}

/** Figma Error footer under the Create form: info icon, message, Dismiss. */
function AiInputError({
  onDismiss,
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & { onDismiss?: () => void }) {
  return (
    <div
      role="alert"
      data-slot="ai-input-error"
      className={cn(
        "flex h-8 items-center justify-between rounded-b-r20 font-default tracking-default bg-danger-50 px-3 py-2 text-10 leading-16 font-semibold text-danger-600 outline -outline-offset-1 outline-danger-alpha-20",
        className
      )}
      {...props}
    >
      <span className="flex items-center gap-1.5">
        <span
          aria-hidden
          className="size-4 bg-current mask-[url(/icons/material-info2.svg)] mask-contain mask-center mask-no-repeat"
        />
        {children}
      </span>
      <button type="button" onClick={onDismiss} className="cursor-pointer outline-none focus-visible:underline">
        Dismiss
      </button>
    </div>
  )
}

export {
  AiInput,
  AiInputRoot,
  AiInputText,
  AiInputFooter,
  AiInputGroup,
  AiInputAction,
  AiInputSend,
  AiInputModel,
  AiInputAttachments,
  AiInputAttachment,
  AiInputError,
  aiInputVariants,
  aiInputAttachmentVariants,
}
