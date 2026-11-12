"use client"

import * as React from "react"
import { useTranslations } from "next-intl"

import { ProjectCardMenu } from "@/components/projects/ProjectCardMenu"
import { StageFormDialog } from "@/components/projects/StageFormDialog"

/** Project Stages card menu: "Add stage" (dialog) + "View all" (not built). */
function ProjectStagesMenu({ projectId }: { projectId: string }) {
  const t = useTranslations("projectPage.card")
  const tStage = useTranslations("forms.stage")
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <ProjectCardMenu label={t("more")} items={[{ label: tStage("createTitle"), onSelect: () => setOpen(true) }, { label: t("viewAll") }]} />
      <StageFormDialog open={open} onOpenChange={setOpen} projectId={projectId} />
    </>
  )
}

export { ProjectStagesMenu }
