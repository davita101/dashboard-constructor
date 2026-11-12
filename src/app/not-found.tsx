import type { Metadata } from "next"

import { NotFoundState } from "@/components/layout/NotFoundState"

export const metadata: Metadata = { title: "Page not found" }

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center bg-background-10 px-4 py-20">
      <NotFoundState className="max-w-80" />
    </main>
  )
}
