import { notFound } from "next/navigation"

// Always a 404, so there's no shell to validate for instant navigation.
export const instant = false

// Sidebar sections without their own folder (notes, files, chats, mail, users, …) aren't built yet: show the 404.
// A section gets its own folder here (like projects/) once it has real content.
export default function DashboardSectionPage() {
  notFound()
}
