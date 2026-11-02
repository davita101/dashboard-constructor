import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { cn } from "@/lib/utils"

// Figma Newsletter Commerce (Breakpoint) (13595:21583): Type=1600 (1128x168) and Type=360 (360x184).
// Centered title over a 40 high pill input with an inline "Send" button.
const newsletterVariants = cva(
  "group/newsletter flex w-full flex-col items-center gap-4 bg-background-0 py-11 font-default tracking-default outline outline-background-100 -outline-offset-1",
  {
    variants: {
      size: {
        "1600": "px-24",
        "360": "px-20",
      },
    },
    defaultVariants: { size: "1600" },
  }
)

type NewsletterSize = NonNullable<VariantProps<typeof newsletterVariants>["size"]>

/** Figma Newsletter root. `size` = Figma Type. */
function Newsletter({
  className,
  size = "1600",
  ...props
}: React.ComponentProps<"form"> & { size?: NewsletterSize }) {
  return (
    <form
      data-slot="newsletter"
      data-size={size}
      className={cn(newsletterVariants({ size }), className)}
      {...props}
    />
  )
}

/** Figma title: 14/24 bold base-700 (12/20 on 360), centered. */
function NewsletterTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="newsletter-title"
      className={cn(
        "text-center text-14 leading-24 font-bold text-base-700 group-data-[size=360]/newsletter:text-12 group-data-[size=360]/newsletter:leading-20",
        className
      )}
      {...props}
    />
  )
}

/** Figma Input-Pilled 300x40 (200 on 360): e-mail field with the Send button on its right. */
function NewsletterField({
  className,
  placeholder = "E-mail Address",
  action = "Send",
  ...props
}: React.ComponentProps<typeof InputGroupInput> & { action?: React.ReactNode }) {
  return (
    <InputGroup size="40" shape="pill" className={cn("w-75 group-data-[size=360]/newsletter:w-50", className)}>
      <InputGroupInput type="email" placeholder={placeholder} aria-label={placeholder} {...props} />
      <InputGroupAddon align="inline-end">
        <Button type="submit" variant="outline" size="24" shape="pill">
          {action}
        </Button>
      </InputGroupAddon>
    </InputGroup>
  )
}

export { Newsletter, NewsletterTitle, NewsletterField, newsletterVariants }
export type { NewsletterSize }
