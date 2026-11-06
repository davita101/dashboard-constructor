import { getTranslations } from "next-intl/server"

import { RadialChart } from "@/components/charts/radial-chart"
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
import { TableCell, TableCellContent, TableCellTitle } from "@/components/ui/table-cell"
import type { ProjectFinance } from "@/lib/projects/types"

type FinancialStatsCardProps = {
  finance: ProjectFinance
}

/** Figma Financial Statistics (264x360): Text-Cell + Icon-Cell head, concentric Income / Cost / Profit rings. */
async function FinancialStatsCard({ finance }: FinancialStatsCardProps) {
  const t = await getTranslations("projects.financialStats")
  void finance // ring sizes stay the fixed Figma 207/144/90; values are not drawn yet

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
      <div className="flex h-75 items-center justify-center">
        <RadialChart
          kind="rings"
          items={[
            { label: t("income"), color: "blue", size: 207, badge: { left: 146, top: 2 } },
            { label: t("cost"), color: "orange", size: 144, badge: { left: 32.5, top: 141 } },
            { label: t("profit"), color: "green", size: 90, badge: { left: 78.5, top: 91 } },
          ]}
        />
      </div>
    </Card>
  )
}

export { FinancialStatsCard }
