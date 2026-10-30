import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Figma Forms: Payment Card Input (12008:2462), sets Input-Payment-Rounded (11999:48375) and
// Input-Payment-Pilled (12012:1345). The card brand tile sitting at the right edge of the card
// number row: a white box with the same 1px stroke as the input, holding the brand artwork.
// Rounded = r6 tile (Mastercard-Rounded 11999:49888), Pilled = fully pilled tile
// (Mastercard-Pilled 12012:1357). Shape only changes the tile: box size and radius.
// The artwork is multi-color brand art, so it is a background image, not a token-colored mask.
const paymentCardBrandVariants = cva(
  "inline-flex h-(--brand-h) w-(--brand-w) shrink-0 items-center justify-center bg-background-0 outline outline-base-100 -outline-offset-1",
  {
    variants: {
      shape: {
        rounded: "rounded-r6",
        pilled: "rounded-r72",
      },
      size: {
        "60": "",
        "48": "",
        "40": "",
        "32": "",
        "24": "",
      },
    },
    // Tile and artwork sizes measured per Size × Shape in Figma
    compoundVariants: [
      {
        shape: "rounded",
        size: "60",
        className: "[--brand-glyph-h:--spacing(5)] [--brand-glyph-w:--spacing(8)] [--brand-h:--spacing(8)] [--brand-w:--spacing(13)]",
      },
      {
        shape: "rounded",
        size: "48",
        className: "[--brand-glyph-h:--spacing(3.5)] [--brand-glyph-w:--spacing(5.5)] [--brand-h:--spacing(6)] [--brand-w:--spacing(9.5)]",
      },
      {
        shape: "rounded",
        size: ["40", "32"],
        className: "[--brand-glyph-h:--spacing(3)] [--brand-glyph-w:--spacing(5)] [--brand-h:--spacing(5)] [--brand-w:--spacing(8)]",
      },
      {
        shape: "rounded",
        size: "24",
        className: "[--brand-glyph-h:--spacing(2.5)] [--brand-glyph-w:--spacing(4)] [--brand-h:--spacing(4)] [--brand-w:--spacing(6.5)]",
      },
      {
        shape: "pilled",
        size: "60",
        className: "[--brand-glyph-h:--spacing(4.5)] [--brand-glyph-w:--spacing(7)] [--brand-h:--spacing(7)] [--brand-w:--spacing(12.5)]",
      },
      {
        shape: "pilled",
        size: "48",
        className: "[--brand-glyph-h:--spacing(3.5)] [--brand-glyph-w:--spacing(5.5)] [--brand-h:--spacing(6)] [--brand-w:--spacing(11)]",
      },
      {
        shape: "pilled",
        size: "40",
        className: "[--brand-glyph-h:--spacing(3)] [--brand-glyph-w:--spacing(5)] [--brand-h:--spacing(5)] [--brand-w:--spacing(9)]",
      },
      {
        shape: "pilled",
        size: ["32", "24"],
        className: "[--brand-glyph-h:--spacing(2.5)] [--brand-glyph-w:--spacing(4)] [--brand-h:--spacing(4)] [--brand-w:--spacing(7)]",
      },
    ],
    defaultVariants: {
      shape: "rounded",
      size: "40",
    },
  }
)

type PaymentCardBrandShape = NonNullable<VariantProps<typeof paymentCardBrandVariants>["shape"]>

/**
 * Figma Right > Mastercard-Rounded / Mastercard-Pilled: the brand tile of a payment card input.
 * Put it in an InputGroupAddon align="inline-end" so it fades with the disabled input.
 */
function PaymentCardBrand({
  className,
  shape = "rounded",
  size = "40",
  src = "/icons/mastercard.svg",
  brand = "Mastercard",
  style,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof paymentCardBrandVariants> & {
    /** Brand artwork, a multi-color SVG in /public/icons. */
    src?: string
    /** Accessible name of the card brand. */
    brand?: string
  }) {
  return (
    <span
      data-slot="payment-card-brand"
      data-shape={shape}
      data-size={size}
      className={cn(paymentCardBrandVariants({ shape, size }), className)}
      {...props}
    >
      <span
        aria-hidden
        className="h-(--brand-glyph-h) w-(--brand-glyph-w) bg-contain bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${src})`, ...style }}
      />
      <span className="sr-only">{brand}</span>
    </span>
  )
}

export { PaymentCardBrand, paymentCardBrandVariants, type PaymentCardBrandShape }
