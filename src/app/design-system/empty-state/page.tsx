import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyIcon,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

// Mirrors the Figma Empty States page (11951:3850): Empty-States, Type=Default.

export default function EmptyStatePreviewPage() {
  return (
    <main className="flex flex-1 flex-wrap items-start justify-center gap-20 bg-background-10 px-4 py-20">
      <Empty className="w-71">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <EmptyIcon src="/icons/material-search.svg" />
          </EmptyMedia>
          <EmptyTitle>Nothing found</EmptyTitle>
          <EmptyDescription>
            No results were found for your search, please select an action to continue
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline">Back Screen</Button>
          <Button variant="dark">New Search</Button>
        </EmptyContent>
      </Empty>
    </main>
  )
}
