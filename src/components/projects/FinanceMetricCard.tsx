import { getFormatter, getTranslations } from "next-intl/server"

import { ChartTrend, ChartValue } from "@/components/ui/chart-parts"
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
import { Button, ButtonIcon } from "@/components/ui/button"
import { TableCell, TableCellContent, TableCellTitle } from "@/components/ui/table-cell"

type FinanceMetricCardProps = {
  title: string
  amount: number
  /** Percent change; sign picks the arrow and the +/- prefix. */
  trend: number
  tone: "green" | "purple"
}

/** Figma Income / Profit (264x120): Text-Cell + Icon-Cell head, amount and stacked trend below. */
async function FinanceMetricCard({ title, amount, trend, tone }: FinanceMetricCardProps) {
  const t = await getTranslations("projects.finance")
  const format = await getFormatter()
  const up = trend >= 0

  return (
    <Card variant="panel" className="gap-0">
      <div className="flex items-center justify-between">
        <TableCell size="60" padding="loose">
          <TableCellContent className="py-0">
            <TableCellTitle>{title}</TableCellTitle>
          </TableCellContent>
        </TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="muted" size="icon-60" shape="rounded" aria-label={t("more", { title })}>
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
      </div>
      <div className="flex items-start justify-between px-5 pb-0">
        <ChartValue tone={tone}>{format.number(amount, { style: "currency", currency: "USD", maximumFractionDigits: 0 })}</ChartValue>
        <ChartTrend direction={up ? "up" : "down"} size="stack">
          {up ? "+" : "-"}
          {Math.abs(trend)}%
        </ChartTrend>
      </div>
    </Card>
  )
}

export { FinanceMetricCard }
