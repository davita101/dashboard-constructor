"use client"

import * as React from "react"
import { useTranslations } from "next-intl"

import { FormField } from "@/components/projects/FormField"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, ButtonIcon } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogModalBody,
  DialogModalClose,
  DialogModalDescription,
  DialogModalFooter,
  DialogModalHead,
  DialogModalHeading,
  DialogModalIcon,
  DialogModalTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { MemberRow, MemberRowActions, MemberRowInfo, MemberRowName } from "@/components/ui/member-row"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/toast"
import { initialActionState } from "@/lib/projects/action-state"
import { addMemberAction, removeMemberAction, updateMemberRoleAction } from "@/lib/projects/actions"
import type { TeamMember } from "@/lib/projects/types"

/** Project team editor: invite by email (people who signed up), change job title, remove. */
function MembersDialog({
  open,
  onOpenChange,
  projectId,
  team,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  team: TeamMember[]
}) {
  const t = useTranslations("forms.members")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent variant="modal" layout="modal" size="lg" className="max-h-[calc(100dvh-(--spacing(8)))] overflow-y-auto">
        <DialogModalHead>
          <DialogModalIcon src="/icons/material/material-person-add.svg" />
          <DialogModalHeading>
            <DialogModalTitle>{t("title")}</DialogModalTitle>
            <DialogModalDescription>{t("description")}</DialogModalDescription>
          </DialogModalHeading>
          <DialogModalClose aria-label={t("close")} />
        </DialogModalHead>
        <DialogModalBody>
          <AddMemberForm projectId={projectId} />
          <Separator />
        </DialogModalBody>
        <DialogModalFooter>
          <ScrollArea className="max-h-80 w-full">
            <ul className="flex flex-col gap-1.5">
              {team.map((member, index) => (
                <li key={member.id}>
                  <MemberEditRow projectId={projectId} member={member} stripe={index % 2 === 1} canRemove={team.length > 1} />
                </li>
              ))}
            </ul>
          </ScrollArea>
        </DialogModalFooter>
      </DialogContent>
    </Dialog>
  )
}

function AddMemberForm({ projectId }: { projectId: string }) {
  const t = useTranslations("forms.members")
  const [state, action, pending] = React.useActionState(addMemberAction, initialActionState)
  const formRef = React.useRef<HTMLFormElement>(null)

  React.useEffect(() => {
    if (state.status !== "ok") return
    toast.add({ title: t("added"), timeout: 3000 })
    formRef.current?.reset()
  }, [state, t])

  return (
    <form
      ref={formRef}
      // onSubmit instead of `action`: keep the typed email when the server rejects it (React resets after `action`).
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        React.startTransition(() => action(data))
      }}
      noValidate className="flex flex-col gap-3 sm:flex-row sm:items-start">
      <input type="hidden" name="projectId" value={projectId} />
      <div className="flex-1">
        <FormField name="email" label={t("email")} state={state}>
          {(p) => <Input {...p} type="email" required autoComplete="off" placeholder={t("emailPlaceholder")} />}
        </FormField>
      </div>
      <div className="flex-1">
        <FormField name="role" label={t("role")} state={state}>
          {(p) => <Input {...p} maxLength={80} placeholder={t("rolePlaceholder")} />}
        </FormField>
      </div>
      {/* Lines the button up with the inputs (label row is 20px + 8px gap). */}
      <Button type="submit" variant="dark" size="40" disabled={pending} className="sm:mt-7">
        {pending ? t("adding") : t("add")}
      </Button>
    </form>
  )
}

function MemberEditRow({ projectId, member, stripe, canRemove }: { projectId: string; member: TeamMember; stripe: boolean; canRemove: boolean }) {
  const t = useTranslations("forms.members")
  const [roleState, roleAction, rolePending] = React.useActionState(updateMemberRoleAction, initialActionState)
  const [removeState, removeAction, removePending] = React.useActionState(removeMemberAction, initialActionState)
  const roleForm = React.useRef<HTMLFormElement>(null)

  React.useEffect(() => {
    const failed = [roleState, removeState].find((s) => s.status === "error")
    if (failed?.message) toast.add({ title: failed.message, timeout: 4000 })
  }, [roleState, removeState])

  return (
    <MemberRow stripe={stripe}>
      <MemberRowInfo className="flex-1">
        <Avatar size="32">
          <AvatarImage src={member.avatar} alt="" />
          <AvatarFallback>{member.name.slice(0, 1)}</AvatarFallback>
        </Avatar>
        <MemberRowName className="w-32 shrink-0">{member.name}</MemberRowName>
        {/* Saves when the field loses focus with a changed value, or on Enter. */}
        <form ref={roleForm} action={roleAction} className="min-w-0 flex-1">
          <input type="hidden" name="projectId" value={projectId} />
          <input type="hidden" name="userId" value={member.id} />
          <Input
            name="role"
            size="24"
            maxLength={80}
            defaultValue={member.role}
            disabled={rolePending}
            aria-label={t("roleOf", { name: member.name })}
            placeholder={t("rolePlaceholder")}
            onBlur={(e) => {
              if (e.currentTarget.value !== member.role) roleForm.current?.requestSubmit()
            }}
          />
        </form>
      </MemberRowInfo>
      <MemberRowActions>
        <form action={removeAction}>
          <input type="hidden" name="projectId" value={projectId} />
          <input type="hidden" name="userId" value={member.id} />
          <Button
            type="submit"
            variant="outline"
            size="icon-24"
            disabled={!canRemove || removePending}
            aria-label={t("remove", { name: member.name })}
          >
            <ButtonIcon src="/icons/material-close.svg" />
          </Button>
        </form>
      </MemberRowActions>
    </MemberRow>
  )
}

export { MembersDialog }
