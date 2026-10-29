import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Figma Verify-Icon: colored badge (material verified) over a white disc that shows through the check
const verifyIconVariants = cva(
  "relative inline-flex size-6 shrink-0 before:absolute before:inset-1/6 before:rounded-full before:bg-background-0 after:absolute after:inset-0 after:bg-(--verify-color) after:mask-[url(/icons/material-verified.svg)] after:mask-contain after:mask-center after:mask-no-repeat",
  {
    variants: {
      color: {
        primary: "[--verify-color:var(--primary-500)]",
        orange: "[--verify-color:var(--orange-500)]",
        purple: "[--verify-color:var(--purple-500)]",
        red: "[--verify-color:var(--red-500)]",
        yellow: "[--verify-color:var(--yellow-500)]",
        green: "[--verify-color:var(--green-500)]",
        sky: "[--verify-color:var(--sky-500)]",
        pink: "[--verify-color:var(--pink-500)]",
        amber: "[--verify-color:var(--amber-500)]",
        teal: "[--verify-color:var(--teal-500)]",
        blue: "[--verify-color:var(--blue-500)]",
        indigo: "[--verify-color:var(--indigo-500)]",
        violet: "[--verify-color:var(--violet-500)]",
        fuchsia: "[--verify-color:var(--fuchsia-500)]",
        rose: "[--verify-color:var(--rose-500)]",
        emerald: "[--verify-color:var(--emerald-500)]",
        cyan: "[--verify-color:var(--cyan-500)]",
        lime: "[--verify-color:var(--lime-500)]",
        black: "[--verify-color:var(--black)]",
        "base-500": "[--verify-color:var(--base-500)]",
        "base-700": "[--verify-color:var(--base-700)]",
        "base-900": "[--verify-color:var(--base-900)]",
      },
    },
    defaultVariants: {
      color: "primary",
    },
  }
)

type VerifyIconColor = NonNullable<VariantProps<typeof verifyIconVariants>["color"]>

function VerifyIcon({
  className,
  color,
  ...props
}: Omit<React.ComponentProps<"span">, "color"> & VariantProps<typeof verifyIconVariants>) {
  return (
    <span
      data-slot="verify-icon"
      role="img"
      aria-label="Verified"
      className={cn(verifyIconVariants({ color }), className)}
      {...props}
    />
  )
}

export { VerifyIcon, verifyIconVariants, type VerifyIconColor }
