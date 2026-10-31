import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { Button, ButtonIcon } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Figma Misc > Close (11956:33166) and Upload (11956:33373): 20px icon-only actions.
// Colors live in the Button `icon-action` variant; `state` pins Hover/Active for previews.
type IconActionState = "default" | "hover" | "active"

type IconActionProps = Omit<React.ComponentProps<typeof Button>, "variant" | "size" | "shape"> & {
  state?: IconActionState
}

function forced(state: IconActionState | undefined) {
  return state && state !== "default" ? state : undefined
}

/** Figma Close: material-close glyph. */
function CloseAction({ state, className, "aria-label": label = "Close", ...props }: IconActionProps) {
  return (
    <Button
      data-slot="close-action"
      data-force={forced(state)}
      variant="icon-action"
      size="glyph-20"
      aria-label={label}
      className={className}
      {...props}
    >
      <ButtonIcon src="/icons/material-close.svg" />
    </Button>
  )
}

// Figma Upload Type=Active 2 / Active 3 are the reload arrow rotated (spinner frames).
const uploadActionIconVariants = cva("transition-transform", {
  variants: {
    frame: {
      "1": "",
      "2": "rotate-135",
      "3": "-rotate-90",
    },
    loading: {
      true: "animate-spin",
      false: "",
    },
  },
  defaultVariants: { frame: "1", loading: false },
})

/** Figma Upload: material-refresh glyph; `loading` spins it, `frame` pins a spinner frame. */
function UploadAction({
  state,
  frame,
  loading,
  className,
  "aria-label": label = "Reload",
  ...props
}: IconActionProps & VariantProps<typeof uploadActionIconVariants>) {
  const busy = Boolean(loading) || (frame != null && frame !== "1")
  return (
    <Button
      data-slot="upload-action"
      data-force={busy ? "active" : forced(state)}
      aria-busy={loading || undefined}
      variant="icon-action"
      size="glyph-20"
      aria-label={label}
      className={className}
      {...props}
    >
      <ButtonIcon
        src="/icons/material-refresh.svg"
        className={cn(uploadActionIconVariants({ frame, loading }))}
      />
    </Button>
  )
}

export { CloseAction, UploadAction, uploadActionIconVariants, type IconActionState }
