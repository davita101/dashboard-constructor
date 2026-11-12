import { getTranslations } from "next-intl/server"

import { Button, ButtonIcon } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuItemLeft,
  DropdownMenuItemTitle,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TableCell, TableCellContent, TableCellIcon, TableCellTitle } from "@/components/ui/table-cell"

/** Figma card Head (60): Text-Cell with optional icon + optional more menu (Icon-Cell). */
async function ProjectCardHead({ title, icon, menu = true }: { title: string; icon?: string; menu?: boolean }) {
  const t = await getTranslations("projectPage.card")

  return (
    <div className="flex shrink-0 items-center justify-between">
      <TableCell size="60" padding="loose">
        {icon ? <TableCellIcon src={icon} /> : null}
        <TableCellContent className="py-0">
          <TableCellTitle>{title}</TableCellTitle>
        </TableCellContent>
      </TableCell>
      {menu ? (
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
              <DropdownMenuItem data-soon>
                <DropdownMenuItemLeft>
                  <DropdownMenuItemTitle>{t("viewAll")}</DropdownMenuItemTitle>
                </DropdownMenuItemLeft>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </div>
  )
}

export { ProjectCardHead }
