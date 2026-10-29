"use client"

import { useState } from "react"

import {
  Alert,
  AlertClose,
  AlertContent,
  AlertDescription,
  AlertFooter,
  AlertHeader,
  AlertIcon,
  AlertList,
  AlertListItem,
  AlertSeparator,
  AlertTitle,
  type AlertVariant,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

type CardVariant = Exclude<AlertVariant, "white">

// Figma Alert-Buttons: primary + secondary button per type
const buttonVariants = {
  default: ["base-outline", "base-ghost"],
  "primary-soft": ["primary", "primary-soft"],
  "success-soft": ["success", "success-soft"],
  "warning-soft": ["warning", "warning-soft"],
  "danger-soft": ["danger", "danger-soft"],
  black: ["white", "white-soft"],
  primary: ["white", "white-soft"],
  success: ["white", "white-soft"],
  warning: ["white", "white-soft"],
  danger: ["white", "white-soft"],
} as const satisfies Record<CardVariant, readonly [string, string]>

type AlertCardProps = {
  variant?: CardVariant
  title: React.ReactNode
  /** Paragraph body (Alert-Buttons). */
  description?: React.ReactNode
  /** Dash list body (Alert-List-Buttons); takes precedence over `description`. */
  items?: React.ReactNode[]
  primaryLabel?: string
  onPrimary?: () => void
  secondaryLabel?: string
  /** Defaults to dismissing the alert. */
  onSecondary?: () => void
  showIcon?: boolean
  dismissible?: boolean
  onClose?: () => void
  className?: string
}

export function AlertCard({
  variant = "default",
  title,
  description,
  items,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  showIcon = true,
  dismissible = true,
  onClose,
  className,
}: AlertCardProps) {
  const [open, setOpen] = useState(true)
  if (!open) return null

  const close = () => {
    setOpen(false)
    onClose?.()
  }
  const [primaryVariant, secondaryVariant] = buttonVariants[variant]

  return (
    <Alert variant={variant} layout={items ? "list" : "card"} className={className}>
      <AlertContent>
        <AlertHeader>
          {showIcon && <AlertIcon />}
          <AlertTitle>{title}</AlertTitle>
        </AlertHeader>
        <AlertSeparator />
        {items ? (
          <AlertDescription>
            <AlertList>
              {items.map((item, i) => (
                <AlertListItem key={i}>{item}</AlertListItem>
              ))}
            </AlertList>
          </AlertDescription>
        ) : (
          description && <AlertDescription>{description}</AlertDescription>
        )}
        {(primaryLabel || secondaryLabel) && (
          <AlertFooter>
            {primaryLabel && (
              <Button variant={primaryVariant} size="pill" onClick={onPrimary}>
                {primaryLabel}
              </Button>
            )}
            {secondaryLabel && (
              <Button variant={secondaryVariant} size="pill" onClick={onSecondary ?? close}>
                {secondaryLabel}
              </Button>
            )}
          </AlertFooter>
        )}
      </AlertContent>
      {dismissible && <AlertClose onClick={close} />}
    </Alert>
  )
}
