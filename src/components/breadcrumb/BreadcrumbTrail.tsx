import { Fragment } from "react"
import Link from "next/link"

import {
  Breadcrumb,
  BreadcrumbIcon,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  type BreadcrumbSize,
} from "@/components/ui/breadcrumb"

export type BreadcrumbTrailItem = {
  label: string
  href?: string
  /** Single-color SVG URL for the icon badge; omit to use the default dot. */
  icon?: string
  disabled?: boolean
}

type BreadcrumbTrailProps = {
  items: BreadcrumbTrailItem[]
  size?: BreadcrumbSize
  /** Figma "Show Icon". */
  showIcons?: boolean
  className?: string
}

/** Figma Breadcrumb-Group: links, then the last item as the current page. */
export function BreadcrumbTrail({ items, size = "default", showIcons = true, className }: BreadcrumbTrailProps) {
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList size={size}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const icon = showIcons && <BreadcrumbIcon size={size} active={isLast} icon={item.icon} />

          return (
            <Fragment key={`${item.label}-${index}`}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>
                    {icon}
                    {item.label}
                  </BreadcrumbPage>
                ) : item.disabled || !item.href ? (
                  <BreadcrumbLink aria-disabled="true">
                    {icon}
                    {item.label}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbLink render={<Link href={item.href} />}>
                    {icon}
                    {item.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator variant={items[index + 1]?.disabled ? "disabled" : "default"} />}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
