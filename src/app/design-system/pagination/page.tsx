import {
  Pagination,
  PaginationArrow,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationLoadMore,
  PaginationNext,
  PaginationPrevious,
  PaginationSelect,
} from "@/components/ui/pagination"

// Mirrors the Figma Pagination page (9232:577001): Pagination-01, Pagination-02, Pagination-03.
// Desktop 1126, Tablet 768, Mobile 320 (the nav switches layout by container width).

const sizes = [
  { name: "Desktop", width: 1126 },
  { name: "Tablet", width: 768 },
  { name: "Mobile", width: 320 },
]

function Frame({ name, width, children }: { name: string; width: number; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-12 text-base-500">{name}</span>
      <div style={{ width }}>{children}</div>
    </div>
  )
}

function Pages({ withEllipsis, mobile }: { withEllipsis?: boolean; mobile?: boolean }) {
  const first = mobile ? [1, 2] : [1, 2, 3]
  const nums = withEllipsis ? first : [1, 2, 3, 4, 5]
  return (
    <>
      {nums.map((n) => (
        <PaginationItem key={n}>
          <PaginationLink href="#">{n}</PaginationLink>
        </PaginationItem>
      ))}
      {withEllipsis && (
        <>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">21</PaginationLink>
          </PaginationItem>
        </>
      )}
    </>
  )
}

export default function PaginationPreviewPage() {
  return (
    <main className="flex flex-col gap-12 p-10">
      <h1 className="text-24 font-bold text-base-900">Pagination</h1>

      <section className="flex flex-col gap-6">
        <h2 className="text-16 font-bold text-base-900">Pagination-01</h2>
        {sizes.map(({ name, width }) => (
          <Frame key={name} name={name} width={width}>
            <Pagination>
              <PaginationPrevious href="#" className="w-full @2xl:w-auto" />
              <PaginationContent className="col-span-2 row-start-1 @2xl:row-auto">
                <Pages />
              </PaginationContent>
              <PaginationNext href="#" className="w-full @2xl:w-auto" />
            </Pagination>
          </Frame>
        ))}
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-16 font-bold text-base-900">Pagination-02</h2>
        {sizes.map(({ name, width }) => (
          <Frame key={name} name={name} width={width}>
            <Pagination className="grid-cols-[auto_auto] justify-between">
              <PaginationContent gap={16} className="@2xl:justify-start">
                <PaginationItem>
                  <PaginationArrow direction="previous" href="#" />
                </PaginationItem>
                <Pages withEllipsis mobile={name === "Mobile"} />
              </PaginationContent>
              <PaginationLoadMore href="#" className="col-span-2 row-start-2 w-full @2xl:row-auto @2xl:w-auto" />
              <PaginationArrow direction="next" href="#" />
            </Pagination>
          </Frame>
        ))}
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-16 font-bold text-base-900">Pagination-03</h2>
        <Frame name="Desktop (Tablet)" width={1048}>
          <Pagination>
            <PaginationSelect>Page 10</PaginationSelect>
            <PaginationContent gap={8} className="justify-self-end">
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </Frame>
      </section>
    </main>
  )
}
