import * as React from "react"

import { Button, ButtonIcon } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Figma Action-Panel (15596:91926), Action-List-Panel (11542:2751), Action-List-Card-Panel (11535:89553):
// a 24px-radius card with Head (heading + close), description, content slot and a Buttons row.

/** Panel shell: background-0 fill, background-100 stroke, 20px padding, 16px gap. */
function ActionPanel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="action-panel"
      className={cn(
        "flex w-fit flex-col gap-4 rounded-r24 bg-background-0 p-5 font-default tracking-default outline outline-background-100 -outline-offset-1",
        className
      )}
      {...props}
    />
  )
}

/** Figma Head: heading on the left, close action on the right. */
function ActionPanelHead({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="action-panel-head" className={cn("flex items-center gap-0", className)} {...props} />
}

/** Figma Heading: Inter SemiBold 14/24, base-900. */
function ActionPanelTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="action-panel-title"
      className={cn("min-w-0 flex-1 text-14 leading-24 font-semibold text-base-900", className)}
      {...props}
    />
  )
}

/** Figma material-close (20px). */
function ActionPanelClose({ className, "aria-label": label = "Close", ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="action-panel-close"
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

/** Figma description: Inter SemiBold 12/20, base-600. */
function ActionPanelDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="action-panel-description"
      className={cn("text-12 leading-20 font-semibold text-base-600", className)}
      {...props}
    />
  )
}

/** Figma Content slot: stacked items, 8px apart. */
function ActionPanelContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="action-panel-content" className={cn("flex flex-col gap-2", className)} {...props} />
}

/** Figma Buttons row. */
function ActionPanelActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="action-panel-actions" className={cn("flex items-center gap-2", className)} {...props} />
}

export {
  ActionPanel,
  ActionPanelActions,
  ActionPanelClose,
  ActionPanelContent,
  ActionPanelDescription,
  ActionPanelHead,
  ActionPanelTitle,
}
