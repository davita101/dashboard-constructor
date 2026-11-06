import { getTranslations } from "next-intl/server"

import { ProjectCardHead } from "@/components/projects/ProjectCardHead"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import type { ProjectDetail } from "@/lib/projects/types"

/** Figma Company card (716x212, r16): head + logo tile, name and description. */
async function CompanyCard({ company }: { company: ProjectDetail["company"] }) {
  const t = await getTranslations("projectPage.company")

  return (
    <Card variant="tile" className="lg:h-53">
      <ProjectCardHead title={t("title")} />
      <div className="flex gap-5 px-5 pb-5">
        <Avatar size="96" shape="rounded" frame="logo" className="shrink-0">
          <AvatarImage src={company.logo} alt="" />
        </Avatar>
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="font-default text-13 leading-24 font-bold text-base-900">{company.name}</h3>
          <p className="font-default text-11 leading-20 font-semibold text-base-600">{company.description}</p>
        </div>
      </div>
    </Card>
  )
}

export { CompanyCard }
