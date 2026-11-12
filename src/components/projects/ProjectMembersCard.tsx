import { getTranslations } from "next-intl/server"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, ButtonIcon } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ProjectCardMenu } from "@/components/projects/ProjectCardMenu"
import {
  MemberRow,
  MemberRowActions,
  MemberRowInfo,
  MemberRowName,
  MemberRowRole,
} from "@/components/ui/member-row"
import { ProjectMembersMenu } from "@/components/projects/ProjectMembersMenu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TableCell, TableCellContent, TableCellTitle } from "@/components/ui/table-cell"
import type { TeamMember } from "@/lib/projects/types"

/** Figma Members card (352x504): Text-Cell + more head, scrolling list of 48px member rows. */
async function ProjectMembersCard({ team, projectId }: { team: TeamMember[]; projectId?: string }) {
  const t = await getTranslations("projectPage.members")

  return (
    <Card variant="panel" className="gap-0">
      <div className="flex items-center justify-between">
        <TableCell size="60" padding="loose">
          <TableCellContent className="py-0">
            <TableCellTitle>{t("title")}</TableCellTitle>
          </TableCellContent>
        </TableCell>
        {projectId ? (
          <ProjectMembersMenu projectId={projectId} team={team} />
        ) : (
          <ProjectCardMenu label={t("more")} items={[{ label: t("viewAll") }]} />
        )}
      </div>
      <ScrollArea className="h-111">
        <ul className="flex flex-col gap-1.5 pr-5 pl-3">
          {team.map((member, index) => (
            <li key={member.id}>
              <MemberRow stripe={index % 2 === 1}>
                <MemberRowInfo>
                  <Avatar size="32">
                    <AvatarImage src={member.avatar} alt="" />
                    <AvatarFallback>{member.name.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-col">
                    <MemberRowName>{member.name}</MemberRowName>
                    <MemberRowRole>{member.role}</MemberRowRole>
                  </div>
                </MemberRowInfo>
                <MemberRowActions>
                  <Button variant="outline" size="icon-24" data-soon aria-label={t("message", { name: member.name })}>
                    <ButtonIcon src="/icons/material-chat-bubble.svg" />
                  </Button>
                  <Button variant="outline" size="icon-24" data-soon aria-label={t("call", { name: member.name })}>
                    <ButtonIcon src="/icons/material-local-phone.svg" />
                  </Button>
                </MemberRowActions>
              </MemberRow>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </Card>
  )
}

export { ProjectMembersCard }
