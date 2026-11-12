import { NotFoundState } from "@/components/layout/NotFoundState"

// Inside the dashboard shell, so the sidebar and navbar stay.
export default function DashboardNotFound() {
  return (
    <main className="flex flex-1 items-center justify-center px-5 py-20">
      <NotFoundState className="max-w-80" />
    </main>
  )
}
