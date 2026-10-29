import { BreadcrumbTrail, type BreadcrumbTrailItem } from "@/components/breadcrumb/BreadcrumbTrail"
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

// Mirrors the Figma Breadcrumbs page (5522:25332): Breadcrumb-Component, Breadcrumb-Group,
// Breadcrumb-Arrow-Component and the Playground.

const sizes: BreadcrumbSize[] = ["lg", "default", "sm"]

const items: BreadcrumbTrailItem[] = Array.from({ length: 6 }, () => ({ label: "Item", href: "#" }))

export default function BreadcrumbPreviewPage() {
  return (
    <main className="flex flex-1 flex-wrap items-start justify-center gap-20 bg-background-10 px-4 py-20">
      <section aria-label="Breadcrumb-Component" className="flex flex-col gap-6">
        {sizes.map((size) => (
          <Breadcrumb key={size}>
            <BreadcrumbList size={size} className="gap-10">
              <BreadcrumbItem>
                <BreadcrumbPage>
                  <BreadcrumbIcon size={size} active />
                  Item
                </BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">
                  <BreadcrumbIcon size={size} />
                  Item
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink aria-disabled="true">
                  <BreadcrumbIcon size={size} />
                  Item
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        ))}
      </section>

      <section aria-label="Breadcrumb-Arrow-Component" className="flex items-center gap-20">
        <ul className="contents">
          <BreadcrumbSeparator />
          <BreadcrumbSeparator variant="active" />
          <BreadcrumbSeparator variant="disabled" />
        </ul>
      </section>

      <section aria-label="Breadcrumb-Group" className="flex flex-col gap-20">
        {sizes.map((size) => (
          <BreadcrumbTrail key={size} size={size} items={items} />
        ))}
      </section>

      <section aria-label="Playground" className="flex flex-col gap-20">
        <BreadcrumbTrail
          size="sm"
          showIcons={false}
          items={[
            { label: "Home", href: "#" },
            { label: "Templates", href: "#" },
            { label: "Dashboards" },
          ]}
        />
        <BreadcrumbTrail
          size="sm"
          items={[
            { label: "Home", href: "#", icon: "/icons/material-home.svg" },
            { label: "Products", href: "#" },
            { label: "Apple", href: "#" },
            { label: "iPhone 40" },
          ]}
        />
        <BreadcrumbTrail
          size="default"
          items={[
            { label: "Home", href: "#", icon: "/icons/material-home.svg" },
            { label: "Account", href: "#" },
            { label: "Orders", disabled: true },
            { label: "Order #1024" },
          ]}
        />
      </section>
    </main>
  )
}
