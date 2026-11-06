"use client"

import { useUser } from "@clerk/nextjs"
import { useTranslations } from "next-intl"
import Image from "next/image"

import { useDashboardSize } from "@/components/dashboard/use-dashboard-size"
import { Badge } from "@/components/ui/badge"
import { Button, ButtonIcon } from "@/components/ui/button"
import { NavigateHead, NavigateHeadBody, NavigateHeadGroup, NavigateHeadTitle } from "@/components/ui/navigate-head"

/** Figma Head-Dashboard-11 (Projects 1600): waving-hand badge + greeting, "Add New Project" dark pill, bottom divider. */
function ProjectsGreeting() {
  const size = useDashboardSize() ?? "desktop"
  const mobile = size === "mobile"
  const { user } = useUser()
  const t = useTranslations("projects")
  const name = user?.fullName ?? user?.username ?? ""

  return (
    <NavigateHead size={mobile ? "mobile" : "desktop"} divider>
      <NavigateHeadBody>
        <NavigateHeadGroup gap={3}>
          <Badge variant="base" size="square-32" shape="pill">
            <Image src="/icons/waving-hand.png" alt="" width={16} height={16} />
          </Badge>
          <NavigateHeadTitle size="14" tone="soft">
            {name ? t("greeting", { name }) : t("greetingAnonymous")}
          </NavigateHeadTitle>
        </NavigateHeadGroup>
        <Button variant="dark" shape="pill" size="32">
          <ButtonIcon src="/icons/material-add-circle.svg" />
          {t("addProject")}
        </Button>
      </NavigateHeadBody>
    </NavigateHead>
  )
}

export { ProjectsGreeting }
