import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Figma QR-Code (Type=Default): 76x76 tile, r8, 1px background-100 stroke, 8px padding around a 60x60 code frame
const qrCodeVariants = cva(
  "relative inline-flex size-19 shrink-0 items-center justify-center rounded-r8 bg-background-0 p-2 outline -outline-offset-1 outline-background-100",
  {
    variants: {
      type: {
        default: "",
      },
    },
    defaultVariants: {
      type: "default",
    },
  }
)

function QrCode({
  className,
  type,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof qrCodeVariants>) {
  return (
    <div
      data-slot="qr-code"
      data-type={type ?? "default"}
      className={cn(qrCodeVariants({ type }), className)}
      {...props}
    />
  )
}

// Figma "Code" frame: 60x60 slot that holds the QR image or svg
function QrCodeCode({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="qr-code-code"
      className={cn(
        "flex size-15 shrink-0 items-center justify-center overflow-hidden [&>img]:size-full [&>svg]:size-full",
        className
      )}
      {...props}
    />
  )
}

export { QrCode, QrCodeCode, qrCodeVariants }
