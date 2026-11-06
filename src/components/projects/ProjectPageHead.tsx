import { getTranslations } from "next-intl/server"

import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button, ButtonIcon } from "@/components/ui/button"
import { NavigateHead, NavigateHeadBody, NavigateHeadGroup, NavigateHeadTitle } from "@/components/ui/navigate-head"

/** Figma Head-Dashboard-17 (1128x84): logo tile + project name | "Save Project" dark pill, bottom divider. */
async function ProjectPageHead({ name, logo }: { name: string; logo: string }) {
  const t = await getTranslations("projectPage.head")

  return (
    <NavigateHead divider>
      <NavigateHeadBody>
        <NavigateHeadGroup gap={3}>
          <Avatar size="60" frame="logo">
            <AvatarImage src={logo} alt={t("logo")} />
          </Avatar>
          <NavigateHeadTitle size="14">{name}</NavigateHeadTitle>
        </NavigateHeadGroup>
        <Button variant="dark" shape="pill" size="32">
          <ButtonIcon src="/icons/material-file-download.svg" />
          {t("save")}
        </Button>
      </NavigateHeadBody>
    </NavigateHead>
  )
}

export { ProjectPageHead }
