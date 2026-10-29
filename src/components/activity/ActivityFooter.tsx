import { cn } from "@/lib/utils"

// Commerce Constructor 7.7 — Activity-Footer-Component (Figma 11119:7737)
// Holds the item's actions, e.g. <Button variant="dark" size="micro">Replay</Button>.

function ActivityFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="activity-footer"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
}

export { ActivityFooter }
