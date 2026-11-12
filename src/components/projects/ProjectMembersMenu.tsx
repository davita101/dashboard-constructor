"use client"

import * as React from "react"
import { useTranslations } from "next-intl"

import { MembersDialog } from "@/components/projects/MembersDialog"
import { ProjectCardMenu } from "@/components/projects/ProjectCardMenu"
import type { TeamMember } from "@/lib/projects/types"

/** Members card menu: "Manage members" (dialog) + "View all" (not built). */
function ProjectMembersMenu({ projectId, team }: { projectId: string; team: TeamMember[] }) {
  const t = useTranslations("projectPage.members")
  const tForm = useTranslations("forms.members")
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <ProjectCardMenu label={t("more")} items={[{ label: tForm("title"), onSelect: () => setOpen(true) }, { label: t("viewAll") }]} />
      <MembersDialog open={open} onOpenChange={setOpen} projectId={projectId} team={team} />
    </>
  )
}

export { ProjectMembersMenu }
