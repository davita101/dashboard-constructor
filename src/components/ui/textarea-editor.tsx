import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { Button, ButtonIcon } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Figma Forms: Text Area Editors (15267:48550), sets Textarea-Editor-Rounded (12116:43093), Textarea-Editor-Pilled
// (12122:46791), Textarea-Footer-Rounded (11150:46313) and Textarea-Footer-Pilled (11153:47817).
// The box is a div holding an optional toolbar (Head), the text area and an optional footer; the label row
// and helper text around it come from Field. States mirror Input: Active = focus-visible inside, Error =
// aria-invalid on the textarea, Filled = a value instead of the placeholder, Disabled = the textarea is disabled.
const textareaEditorVariants = cva(
  "group/editor flex w-full min-w-0 flex-col bg-background-0 font-default font-semibold tracking-default shadow-[inset_0_0_0_4px_var(--editor-ring)] outline outline-(--editor-stroke) -outline-offset-1 transition-[outline-color,box-shadow] [--editor-fg:var(--base-900)] [--editor-placeholder:var(--base-700)] [--editor-ring:transparent] [--editor-stroke:var(--base-100)] " +
    // Filled
    "has-[textarea:not(:placeholder-shown):not(:focus-visible):not(:disabled):not([aria-invalid=true])]:data-[status=default]:[--editor-stroke:var(--base-150)] " +
    // Active
    "has-[textarea:focus-visible:not([aria-invalid=true])]:data-[status=default]:-outline-offset-5 has-[textarea:focus-visible:not([aria-invalid=true])]:data-[status=default]:[--editor-ring:var(--base-alpha-20)] has-[textarea:focus-visible:not([aria-invalid=true])]:data-[status=default]:[--editor-stroke:var(--base-200)] " +
    // Error
    "has-[textarea[aria-invalid=true]]:-outline-offset-5 has-[textarea[aria-invalid=true]]:[--editor-fg:var(--danger-600)] has-[textarea[aria-invalid=true]]:[--editor-placeholder:var(--danger-600)] has-[textarea[aria-invalid=true]]:[--editor-ring:var(--danger-alpha-20)] has-[textarea[aria-invalid=true]]:[--editor-stroke:var(--danger-500)] " +
    // Disabled
    "has-[textarea:disabled]:cursor-not-allowed has-[textarea:disabled]:bg-background-20 has-[textarea:disabled]:shadow-none has-[textarea:disabled]:-outline-offset-1 has-[textarea:disabled]:[--editor-fg:var(--base-300)] has-[textarea:disabled]:[--editor-placeholder:var(--base-300)] has-[textarea:disabled]:[--editor-stroke:var(--base-100)]",
  {
    variants: {
      size: {
        xl: "min-h-32 rounded-r16 text-12 leading-20 [--editor-footer:--spacing(12)] [--editor-head:--spacing(11)] [--editor-px:--spacing(6)] [--editor-py:--spacing(3)]",
        lg: "min-h-34 rounded-r12 text-12 leading-20 [--editor-footer:--spacing(10)] [--editor-head:--spacing(9)] [--editor-px:--spacing(4)] [--editor-py:--spacing(2)]",
        default:
          "min-h-36 rounded-r8 text-11 leading-20 [--editor-footer:--spacing(9)] [--editor-head:--spacing(8)] [--editor-px:--spacing(3)] [--editor-py:--spacing(1.5)]",
        sm: "min-h-38 rounded-r6 text-10 leading-16 [--editor-footer:--spacing(8)] [--editor-head:--spacing(7)] [--editor-px:--spacing(3)] [--editor-py:--spacing(1.5)]",
      },
      shape: {
        rounded: "",
        pill: "",
      },
      status: {
        default: "",
        // Pinned Active look (Figma State=Active) for previews; real focus gets it automatically
        active: "-outline-offset-5 [--editor-ring:var(--base-alpha-20)] [--editor-stroke:var(--base-200)]",
        success:
          "has-[textarea:not([aria-invalid=true])]:-outline-offset-5 has-[textarea:not([aria-invalid=true])]:[--editor-fg:var(--success-600)] has-[textarea:not([aria-invalid=true])]:[--editor-placeholder:var(--success-600)] has-[textarea:not([aria-invalid=true])]:[--editor-ring:var(--success-alpha-20)] has-[textarea:not([aria-invalid=true])]:[--editor-stroke:var(--success-600)]",
      },
    },
    compoundVariants: [
      // Pilled radii: only Extra Large (24) is read from Figma; the rest follow Textarea's pill steps
      { shape: "pill", size: "xl", className: "rounded-r24" },
      { shape: "pill", size: "lg", className: "rounded-r20" },
      { shape: "pill", size: "default", className: "rounded-r16" },
      { shape: "pill", size: "sm", className: "rounded-r12" },
    ],
    defaultVariants: {
      size: "default",
      shape: "rounded",
      status: "default",
    },
  }
)

type TextareaEditorVariantProps = VariantProps<typeof textareaEditorVariants>
type TextareaEditorSize = NonNullable<TextareaEditorVariantProps["size"]>
type TextareaEditorShape = NonNullable<TextareaEditorVariantProps["shape"]>
type TextareaEditorStatus = NonNullable<TextareaEditorVariantProps["status"]>

/** Figma Text Area box: toolbar, text and footer stacked inside one stroked frame. */
function TextareaEditor({
  className,
  size = "default",
  shape = "rounded",
  status = "default",
  ...props
}: React.ComponentProps<"div"> & TextareaEditorVariantProps) {
  return (
    <div
      data-slot="textarea-editor"
      data-size={size}
      data-status={status}
      className={cn(textareaEditorVariants({ size, shape, status }), className)}
      {...props}
    />
  )
}

/** Figma Head: the formatting icon row above the text. */
function TextareaEditorToolbar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="textarea-editor-toolbar"
      role="toolbar"
      className={cn(
        "flex h-(--editor-head) shrink-0 items-center gap-2 px-(--editor-px) group-has-[textarea:disabled]/editor:opacity-50",
        className
      )}
      {...props}
    />
  )
}

/** One Figma material-* icon action (20px, 16px in Small). */
function TextareaEditorAction({
  icon,
  label,
  className,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "variant" | "size" | "children"> & { icon: string; label: string }) {
  return (
    <Button
      data-slot="textarea-editor-action"
      type="button"
      variant="muted"
      size="glyph-20"
      aria-label={label}
      className={cn("group-data-[size=sm]/editor:size-4 group-data-[size=sm]/editor:[--btn-icon:--spacing(4)]", className)}
      {...props}
    >
      <ButtonIcon src={icon} />
    </Button>
  )
}

/** Figma Text: borderless textarea that fills the box. Pass a placeholder so Filled works. */
function TextareaEditorInput({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea-editor-input"
      className={cn(
        "field-sizing-content min-h-0 w-full flex-1 resize-none bg-transparent px-(--editor-px) py-(--editor-py) text-(--editor-fg) outline-none placeholder:text-(--editor-placeholder) disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  )
}

/** Figma Footer: attachment-style actions left, a button right. */
function TextareaEditorFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="textarea-editor-footer"
      className={cn(
        "flex h-(--editor-footer) shrink-0 items-center justify-between gap-2 px-(--editor-px) group-has-[textarea:disabled]/editor:opacity-50",
        className
      )}
      {...props}
    />
  )
}

function TextareaEditorActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="textarea-editor-actions" className={cn("flex items-center gap-2", className)} {...props} />
}

export {
  TextareaEditor,
  TextareaEditorAction,
  TextareaEditorActions,
  TextareaEditorFooter,
  TextareaEditorInput,
  TextareaEditorToolbar,
  textareaEditorVariants,
  type TextareaEditorShape,
  type TextareaEditorSize,
  type TextareaEditorStatus,
}
