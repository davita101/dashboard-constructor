"use client"

import * as React from "react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogModalActions,
  DialogModalBody,
  DialogModalClose,
  DialogModalDescription,
  DialogModalFooter,
  DialogModalHead,
  DialogModalHeading,
  DialogModalIcon,
  DialogModalTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { toast } from "@/components/ui/toast"
import { initialActionState, type ActionState } from "@/lib/projects/action-state"

type FormAction = (state: ActionState, form: FormData) => Promise<ActionState>

/**
 * Modal form bound to a Projects Server Action (useActionState). Closes and toasts on success, shows the
 * action's message and field errors otherwise. No Figma frame for these forms yet: built from the Figma
 * Modal-* dialog parts (see design/known-gaps.md).
 */
function ActionDialog({
  trigger,
  open: openProp,
  onOpenChange,
  icon,
  title,
  description,
  action,
  submitLabel,
  successMessage,
  hidden,
  submitVariant = "dark",
  extraActions,
  onSuccess,
  children,
}: {
  /** Element that opens the dialog (rendered through DialogTrigger). Omit when `open` is controlled. */
  trigger?: React.ReactElement
  open?: boolean
  onOpenChange?: (open: boolean) => void
  icon?: string
  title: string
  description?: string
  action: FormAction
  submitLabel: string
  successMessage?: string
  /** Hidden inputs (ids) posted with the form. */
  hidden?: Record<string, string>
  submitVariant?: "dark" | "danger"
  /** Extra buttons in the footer (e.g. Delete), left of Cancel. */
  extraActions?: React.ReactNode
  onSuccess?: () => void
  children?: (state: ActionState) => React.ReactNode
}) {
  const t = useTranslations("forms")
  const [innerOpen, setInnerOpen] = React.useState(false)
  const open = openProp ?? innerOpen
  // The popup unmounts when closed, so every open starts with a fresh form and action state.
  function setOpen(next: boolean) {
    setInnerOpen(next)
    onOpenChange?.(next)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? <DialogTrigger render={trigger} /> : null}
      <DialogContent variant="modal" layout="modal" size="md" className="max-h-[calc(100dvh-(--spacing(8)))] overflow-y-auto">
        <ActionDialogForm
          action={action}
          hidden={hidden}
          onDone={() => {
            if (successMessage) toast.add({ title: successMessage, timeout: 3000 })
            setOpen(false)
            onSuccess?.()
          }}
        >
          {(state, pending) => (
            <>
              <DialogModalHead>
                {icon ? <DialogModalIcon src={icon} /> : null}
                <DialogModalHeading>
                  <DialogModalTitle>{title}</DialogModalTitle>
                  {description ? <DialogModalDescription>{description}</DialogModalDescription> : null}
                </DialogModalHeading>
                <DialogModalClose aria-label={t("close")} />
              </DialogModalHead>
              <DialogModalBody>
                {state.status === "error" && state.message && !state.fieldErrors ? (
                  <Alert variant="danger-soft">
                    <AlertTitle>{state.message}</AlertTitle>
                  </Alert>
                ) : null}
                {children?.(state)}
              </DialogModalBody>
              <DialogModalFooter>
                <DialogModalActions>
                  {extraActions}
                  <Button type="button" variant="outline" size="32" onClick={() => setOpen(false)}>
                    {t("cancel")}
                  </Button>
                  <Button type="submit" variant={submitVariant} size="32" disabled={pending}>
                    {pending ? t("saving") : submitLabel}
                  </Button>
                </DialogModalActions>
              </DialogModalFooter>
            </>
          )}
        </ActionDialogForm>
      </DialogContent>
    </Dialog>
  )
}

function ActionDialogForm({
  action,
  hidden,
  onDone,
  children,
}: {
  action: FormAction
  hidden?: Record<string, string>
  onDone: () => void
  children: (state: ActionState, pending: boolean) => React.ReactNode
}) {
  const [state, formAction, pending] = React.useActionState(action, initialActionState)
  const done = React.useEffectEvent(onDone)

  React.useEffect(() => {
    if (state.status === "ok") done()
  }, [state])

  // Submit through onSubmit, not the form `action` prop: React resets a form after its action runs, which would
  // wipe what the user typed when the server sends back field errors.
  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    React.startTransition(() => formAction(data))
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {hidden ? Object.entries(hidden).map(([name, value]) => <input key={name} type="hidden" name={name} value={value} />) : null}
      {children(state, pending)}
    </form>
  )
}

export { ActionDialog, type FormAction }
