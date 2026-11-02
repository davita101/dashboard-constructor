import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { Button, ButtonIcon } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

// Figma Player-Video (9491:46705, 280x200) and Player-Audio (9493:46882, 280x28).
const playerVariants = cva("flex w-70 flex-col rounded-r16 font-default", {
  variants: {
    variant: {
      video: "h-50 bg-base-500 p-3 text-background-0",
      audio: "h-7 justify-center bg-background-0 px-2 py-1 text-base-800 outline -outline-offset-1 outline-background-100",
    },
  },
  defaultVariants: { variant: "video" },
})

function Player({
  className,
  variant = "video",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof playerVariants>) {
  return (
    <div
      data-slot="player"
      data-variant={variant}
      className={cn(playerVariants({ variant }), className)}
      {...props}
    />
  )
}

/** Video header row: heading left, more action right. */
function PlayerHead({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="player-head"
      className={cn("flex h-5 items-center justify-between", className)}
      {...props}
    />
  )
}

function PlayerTitle({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="player-title"
      className={cn("text-12 leading-20 font-bold", className)}
      {...props}
    />
  )
}

/** Video middle area holding the big play button. */
function PlayerCenter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="player-center"
      className={cn("flex flex-1 items-center justify-center", className)}
      {...props}
    />
  )
}

/** Big Black-Soft play button (60px round, 28px icon). */
function PlayerPlay({
  className,
  icon = "/icons/material-play-arrow-white.svg",
  "aria-label": label = "Play",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "variant" | "size" | "shape"> & { icon?: string }) {
  return (
    <Button
      data-slot="player-play"
      variant="black-soft"
      size="icon-60"
      shape="pill"
      aria-label={label}
      className={className}
      {...props}
    >
      <ButtonIcon src={icon} />
    </Button>
  )
}

/** Footer stack: progress line over controls row. */
function PlayerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="player-footer" className={cn("flex flex-col gap-2", className)} {...props} />
  )
}

/** Controls row (Figma `Content`): left and right groups. */
function PlayerControls({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="player-controls"
      className={cn("flex h-5 items-center justify-between", className)}
      {...props}
    />
  )
}

function PlayerGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="player-group" className={cn("flex items-center gap-2", className)} {...props} />
}

/** 20px icon control that keeps the player's text color. */
function PlayerButton({
  icon,
  className,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "variant" | "size" | "shape" | "children"> & {
  icon: string
}) {
  return (
    <Button
      data-slot="player-button"
      variant="bare"
      size="glyph-20"
      className={className}
      {...props}
    >
      <ButtonIcon src={icon} />
    </Button>
  )
}

function PlayerTime({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="player-time"
      className={cn("text-10 leading-16 font-bold tabular-nums", className)}
      {...props}
    />
  )
}

/** Progress-Line in the player: red on video, blue on audio. */
function PlayerProgress({
  className,
  color,
  ...props
}: React.ComponentProps<typeof Progress>) {
  return (
    <Progress
      data-slot="player-progress"
      color={color ?? "red"}
      className={className}
      {...props}
    />
  )
}

export {
  Player,
  PlayerButton,
  PlayerCenter,
  PlayerControls,
  PlayerFooter,
  PlayerGroup,
  PlayerHead,
  PlayerPlay,
  PlayerProgress,
  PlayerTime,
  PlayerTitle,
  playerVariants,
}
