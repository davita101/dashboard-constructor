"use client"

import { useTranslations } from "next-intl"

import { BreadcrumbTrail, type BreadcrumbTrailItem } from "@/components/breadcrumb/BreadcrumbTrail"
import { useWidgetPicker } from "@/components/dashboard/widgets/widget-picker"
import type { DashboardSize } from "@/components/dashboard/use-dashboard-size"
import { Button, ButtonIcon } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupIcon, InputGroupInput, InputGroupJoin, InputGroupKbd } from "@/components/ui/input-group"
import { KbdGroup } from "@/components/ui/kbd"
import { NavigateHead, NavigateHeadBody, NavigateHeadGroup, NavigateHeadTitle } from "@/components/ui/navigate-head"

const ICON = "/icons/material-default-icon.svg"

/** Figma Head-Dashboard-01: breadcrumb on the left, three ghost actions on the right. */
function DashboardHeadTop({ size, title, crumbs }: { size: DashboardSize; title: string; crumbs?: BreadcrumbTrailItem[] }) {
  const mobile = size === "mobile"
  const actions: [string, string][] = [
    ["Help Chat", "/icons/material-help.svg"],
    ["Docs", "/icons/material-insert-drive-file.svg"],
    ["Print", "/icons/material/material-print.svg"],
  ]
  return (
    <NavigateHead size={mobile ? "mobile" : "desktop"}>
      <NavigateHeadBody>
        <BreadcrumbTrail size="sm" items={crumbs ?? [{ label: title, icon: "/icons/material-home.svg" }]} />
        <NavigateHeadGroup gap={2} wrap={mobile}>
          {actions.map(([label, icon]) => (
            <Button key={label} variant="ghost" shape="rounded" size="32">
              <ButtonIcon src={icon} />
              {label}
            </Button>
          ))}
        </NavigateHeadGroup>
      </NavigateHeadBody>
    </NavigateHead>
  )
}

/** Figma Head-Dashboard-02: icon button and title, search with the command key, dark action. Mobile stacks and fills. */
function DashboardHeadMain({ size, title, widgets = false }: { size: DashboardSize; title: string; widgets?: boolean }) {
  const mobile = size === "mobile"
  const { open, customizing, setCustomizing } = useWidgetPicker()
  const t = useTranslations("widgets")
  return (
    <NavigateHead size={mobile ? "mobile" : "desktop"} divider>
      <NavigateHeadBody>
        <NavigateHeadGroup gap={3}>
          <Button variant="outline" shape="pill" size="icon-32" aria-label="Section">
            <ButtonIcon src={ICON} />
          </Button>
          <NavigateHeadTitle size="14">{title}</NavigateHeadTitle>
        </NavigateHeadGroup>
        <NavigateHeadGroup gap={3} direction={mobile ? "col" : "row"} className={mobile ? "w-full items-stretch" : undefined}>
          {widgets && (
            // Figma Head-Dashboard-03 "Customize": outline pill with a pencil. While editing it reads "Done".
            <Button variant="outline" shape="pill" size="32" aria-pressed={customizing} onClick={() => setCustomizing(!customizing)}>
              <ButtonIcon src={customizing ? "/icons/material-done.svg" : "/icons/material-mode.svg"} />
              {customizing ? t("done") : t("customize")}
            </Button>
          )}
          <InputGroupJoin size="32" shape="pill" className={mobile ? undefined : "w-40"}>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <InputGroupIcon src="/icons/material-search.svg" />
              </InputGroupAddon>
              <InputGroupInput placeholder="Search" aria-label="Search" />
              <InputGroupAddon align="inline-end">
                <KbdGroup>
                  <InputGroupKbd size="16">⌘K</InputGroupKbd>
                </KbdGroup>
              </InputGroupAddon>
            </InputGroup>
          </InputGroupJoin>
          {widgets && (
            <Button variant="dark" shape="pill" size="32" onClick={open}>
              <ButtonIcon src="/icons/material-add-circle.svg" />
              {t("add")}
            </Button>
          )}
        </NavigateHeadGroup>
      </NavigateHeadBody>
    </NavigateHead>
  )
}

export { DashboardHeadMain, DashboardHeadTop }
