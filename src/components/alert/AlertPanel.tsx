"use client"

import { useState } from "react"

import {
  Alert,
  AlertAction,
  AlertClose,
  AlertDescription,
  AlertDot,
  AlertFooter,
  AlertHeader,
  AlertSeparator,
  AlertTime,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

// Figma Toast (6978:41848): Style = Default | Black
const styles = {
  default: { variant: "default", buttons: ["dark", "outline"] },
  black: { variant: "black", buttons: ["white", "white-soft"] },
} as const

type AlertPanelProps = {
  style?: keyof typeof styles
  title: React.ReactNode
  time?: string
  message: React.ReactNode
  primaryLabel?: string
  onPrimary?: () => void
  secondaryLabel?: string
  onSecondary?: () => void
  onClose?: () => void
  className?: string
}

export function AlertPanel({
  style = "default",
  title,
  time,
  message,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  onClose,
  className,
}: AlertPanelProps) {
  const [open, setOpen] = useState(true)
  if (!open) return null

  const close = () => {
    setOpen(false)
    onClose?.()
  }
  const { variant, buttons } = styles[style]

  return (
    <Alert variant={variant} layout="panel" className={className}>
      <AlertHeader>
        <AlertDot />
        <AlertTitle>{title}</AlertTitle>
        <AlertAction>
          {time && <AlertTime>{time}</AlertTime>}
          <AlertClose onClick={close} />
        </AlertAction>
      </AlertHeader>
      <AlertSeparator />
      <AlertDescription>{message}</AlertDescription>
      {(primaryLabel || secondaryLabel) && (
        <AlertFooter>
          {primaryLabel && (
            <Button variant={buttons[0]} size="28" className="flex-1" onClick={onPrimary}>
              {primaryLabel}
            </Button>
          )}
          {secondaryLabel && (
            <Button variant={buttons[1]} size="28" className="flex-1" onClick={onSecondary ?? close}>
              {secondaryLabel}
            </Button>
          )}
        </AlertFooter>
      )}
    </Alert>
  )
}
