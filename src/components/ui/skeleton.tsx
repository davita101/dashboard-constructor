import { cn } from "@/lib/utils"

/** Loading placeholder block: pulses in the design-token gray. Size and shape come from `className` (layout only). */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden
      className={cn("animate-pulse rounded-r8 bg-base-100 motion-reduce:animate-none", className)}
      {...props}
    />
  )
}

export { Skeleton }
