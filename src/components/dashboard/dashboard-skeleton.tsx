import { Skeleton } from "@/components/ui/skeleton"

/**
 * Placeholder for the dashboard shell while the layout size is still unknown (first paint) and while a section loads.
 * Pure CSS breakpoints, so it matches the final layout at every size without needing JS: sidebar rail from md,
 * full sidebar from lg, same 64px bar on top.
 */
function DashboardSkeleton() {
  return (
    <div role="status" aria-busy="true" aria-label="Loading" className="flex min-h-svh bg-background-20">
      <aside className="sticky top-0 hidden h-svh w-16 shrink-0 flex-col justify-between bg-background-0 p-3 outline outline-background-100 -outline-offset-1 md:flex lg:w-62">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="size-8 shrink-0 rounded-full" />
            <Skeleton className="hidden h-4 w-24 lg:block" />
          </div>
          <div className="flex flex-col gap-2">
            {Array.from({ length: 10 }, (_, i) => (
              <Skeleton key={i} className="h-8 rounded-r32" />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-8 rounded-r32" />
          ))}
          <Skeleton className="h-10 rounded-r32" />
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between gap-3 border-b border-background-100 bg-background-0 p-4">
          <Skeleton className="h-8 w-32 rounded-r32 lg:w-48" />
          <Skeleton className="hidden h-4 w-56 md:block" />
          <div className="flex items-center gap-2">
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="hidden h-8 w-24 rounded-r32 lg:block" />
            <Skeleton className="size-8 rounded-full" />
          </div>
        </header>
        <main className="mx-auto flex w-full max-w-desktop flex-1 flex-col gap-6 p-4 md:p-6 lg:py-8">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-32 rounded-r16" />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Skeleton className="h-72 rounded-r16" />
            <Skeleton className="h-72 rounded-r16" />
          </div>
          <Skeleton className="h-64 rounded-r16" />
        </main>
      </div>
    </div>
  )
}

export { DashboardSkeleton }
