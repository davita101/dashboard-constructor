import { getTranslations } from "next-intl/server"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, ButtonIcon } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuItemLeft,
  DropdownMenuItemTitle,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MemberRow,
  MemberRowActions,
  MemberRowInfo,
  MemberRowName,
  MemberRowRole,
} from "@/components/ui/member-row"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TableCell, TableCellContent, TableCellTitle } from "@/components/ui/table-cell"
import type { TeamMember } from "@/lib/projects/types"

/** Figma Members card (352x504): Text-Cell + more head, scrolling list of 48px member rows. */
async function ProjectMembersCard({ team }: { team: TeamMember[] }) {
  const t = await getTranslations("projectPage.members")

  return (
    <Card variant="panel" className="gap-0">
      <div className="flex items-center justify-between">
        <TableCell size="60" padding="loose">
          <TableCellContent className="py-0">
            <TableCellTitle>{t("title")}</TableCellTitle>
          </TableCellContent>
        </TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="muted" size="icon-60" shape="rounded" aria-label={t("more")}>
                <ButtonIcon src="/icons/material-more-horiz.svg" />
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <DropdownMenuItemLeft>
                  <DropdownMenuItemTitle>{t("viewAll")}</DropdownMenuItemTitle>
                </DropdownMenuItemLeft>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
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
                  <Button variant="outline" size="icon-24" aria-label={t("message", { name: member.name })}>
                    <ButtonIcon src="/icons/material-chat-bubble.svg" />
                  </Button>
                  <Button variant="outline" size="icon-24" aria-label={t("call", { name: member.name })}>
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
