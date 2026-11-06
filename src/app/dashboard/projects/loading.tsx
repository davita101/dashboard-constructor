import { Skeleton } from "@/components/ui/skeleton"

// Body-area skeleton for /dashboard/projects: same column as DashboardPage, same grid as page.tsx (264 | 456 | 360).
export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-282 flex-col gap-6 md:gap-8 md:px-9 md:py-8 lg:px-0 lg:py-12">
      <div className="px-5 pt-5 md:p-0">
        <Skeleton className="h-10 w-64" />
      </div>
      <div className="px-5 md:px-0">
        <div className="flex flex-col gap-6" role="status" aria-busy="true">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-16 rounded-r36" />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[--spacing(66)_--spacing(114)_--spacing(90)]">
            <div className="flex flex-col gap-6">
              <Skeleton className="h-29 rounded-r20" />
              <Skeleton className="h-30 rounded-r20" />
              <Skeleton className="h-30 rounded-r20" />
              <Skeleton className="h-90 rounded-r20" />
            </div>
            <Skeleton className="h-197 rounded-r20" />
            <Skeleton className="h-197 rounded-r20" />
          </div>
        </div>
      </div>
    </div>
  )
}
