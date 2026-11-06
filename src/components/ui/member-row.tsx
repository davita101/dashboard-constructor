import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Figma Row (320x48 r40): avatar + name/role on the left, icon buttons on the right.
// stripe = the light gray background of every second row.
const memberRowVariants = cva("flex h-12 items-center justify-between gap-3 rounded-r40 px-3", {
  variants: {
    stripe: {
      false: "",
      true: "bg-base-20",
    },
  },
  defaultVariants: { stripe: false },
})

function MemberRow({
  className,
  stripe,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof memberRowVariants>) {
  return <div data-slot="member-row" className={cn(memberRowVariants({ stripe }), className)} {...props} />
}

function MemberRowInfo({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="member-row-info" className={cn("flex min-w-0 items-center gap-3", className)} {...props} />
}

function MemberRowName({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="member-row-name" className={cn("truncate text-11 leading-20 font-bold text-base-800", className)} {...props} />
}

function MemberRowRole({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="member-row-role" className={cn("truncate text-10 leading-16 font-bold text-base-600", className)} {...props} />
}

function MemberRowActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="member-row-actions" className={cn("flex shrink-0 items-center gap-1.5", className)} {...props} />
}

export { MemberRow, MemberRowInfo, MemberRowName, MemberRowRole, MemberRowActions, memberRowVariants }
