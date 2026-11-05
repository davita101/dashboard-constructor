import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton"

// Shown while a /dashboard route streams in (the layout's own first paint uses the same skeleton).
export default function Loading() {
  return <DashboardSkeleton />
}
