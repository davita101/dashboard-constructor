"use client"

import { Progress as ProgressPrimitive } from "@base-ui/react/progress"

import { cn } from "@/lib/utils"
import {
  ProgressDot,
  ProgressIndicator,
  ProgressTrack,
} from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

/**
 * Figma Progress-Percent (12178:534): a Progress-Line track with a Progress-Dot thumb at the
 * value and an always-open Tooltip above it showing the value. `size` = Figma Type
 * (Default 4px track + 8px dot, Small 2px track + 6px dot).
 */
function ProgressPercent({
  className,
  value,
  max = 100,
  size = "default",
  ...props
}: Omit<ProgressPrimitive.Root.Props, "color"> & {
  size?: "default" | "small"
}) {
  const percent = Math.min(100, Math.max(0, ((value ?? 0) / max) * 100))
  return (
    <ProgressPrimitive.Root
      value={value}
      max={max}
      data-slot="progress-percent"
      data-size={size}
      className={cn("relative flex w-full items-center", className)}
      {...props}
    >
      <ProgressTrack color="primary" size={size}>
        <ProgressIndicator color="primary" />
      </ProgressTrack>
      <Tooltip open>
        <TooltipTrigger
          render={
            <ProgressDot
              size={size}
              className="absolute top-1/2 -translate-1/2"
              style={{ left: `${percent}%` }}
            />
          }
        />
        <TooltipContent side="top">{`${Math.round(percent)}%`}</TooltipContent>
      </Tooltip>
    </ProgressPrimitive.Root>
  )
}

export { ProgressPercent }
