"use client"

import { BreadcrumbTrail } from "@/components/breadcrumb/BreadcrumbTrail"
import type { DashboardSize } from "@/components/dashboard/use-dashboard-size"
import { Button, ButtonIcon } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupIcon, InputGroupInput, InputGroupJoin, InputGroupKbd } from "@/components/ui/input-group"
import { KbdGroup } from "@/components/ui/kbd"
import { NavigateHead, NavigateHeadBody, NavigateHeadGroup, NavigateHeadTitle } from "@/components/ui/navigate-head"

const ICON = "/icons/material-default-icon.svg"

/** Figma Head-Dashboard-01: breadcrumb on the left, three ghost actions on the right. */
function DashboardHeadTop({ size, title }: { size: DashboardSize; title: string }) {
  const mobile = size === "mobile"
  const actions: [string, string][] = [
    ["Help Chat", "/icons/material-help.svg"],
    ["Docs", "/icons/material-insert-drive-file.svg"],
    // Print glyph is not in public/icons yet (design/known-gaps.md).
    ["Print", ICON],
  ]
  return (
    <NavigateHead size={mobile ? "mobile" : "desktop"}>
      <NavigateHeadBody>
        <BreadcrumbTrail size="sm" items={[{ label: title, icon: "/icons/material-home.svg" }]} />
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
function DashboardHeadMain({ size, title }: { size: DashboardSize; title: string }) {
  const mobile = size === "mobile"
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
          <Button variant="dark" shape="pill" size="32">
            <ButtonIcon src="/icons/material-add-circle.svg" />
            Button
          </Button>
        </NavigateHeadGroup>
      </NavigateHeadBody>
    </NavigateHead>
  )
}

export { DashboardHeadMain, DashboardHeadTop }
