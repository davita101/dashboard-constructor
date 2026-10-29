"use client"

import { useState } from "react"

import {
  Alert,
  AlertAction,
  AlertClose,
  AlertIcon,
  AlertTitle,
  type AlertVariant,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

// Figma Alert-Default ("toast message"): an inline pill alert, not a Base UI toast notification.
// Which button each type uses:
const actionVariant = {
  default: "base-outline",
  "primary-soft": "primary-soft",
  "success-soft": "success-soft",
  "warning-soft": "warning-soft",
  "danger-soft": "danger-soft",
  black: "white-soft",
  primary: "black-soft",
  success: "black-soft",
  warning: "black-soft",
  danger: "black-soft",
  white: "white",
} as const satisfies Record<AlertVariant, string>

type AlertToastProps = {
  variant?: AlertVariant
  title: React.ReactNode
  /** Button label; omit to hide the button. */
  actionLabel?: string
  onAction?: () => void
  showIcon?: boolean
  /** Hides the close button when false. */
  dismissible?: boolean
  onClose?: () => void
  className?: string
}

export function AlertToast({
  variant = "default",
  title,
  actionLabel,
  onAction,
  showIcon = true,
  dismissible = true,
  onClose,
  className,
}: AlertToastProps) {
  const [open, setOpen] = useState(true)
  if (!open) return null

  return (
    <Alert variant={variant} layout="toast" className={className}>
      {showIcon && <AlertIcon />}
      <AlertTitle>{title}</AlertTitle>
      {(actionLabel || dismissible) && (
        <AlertAction>
          {actionLabel && (
            <Button variant={actionVariant[variant]} size="nano" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
          {dismissible && (
            <AlertClose
              onClick={() => {
                setOpen(false)
                onClose?.()
              }}
            />
          )}
        </AlertAction>
      )}
    </Alert>
  )
}
