import { cn } from "@/lib/utils"

// Commerce Constructor 7.7 — Activity-Feed-Component (Figma 11119:7753)
// Icon column (ActivityIcon + timeline line) · head (author, time, unread dot) · text · content · footer

type ActivityFeedProps = React.ComponentProps<"div"> & {
  icon: React.ReactNode
  author: string
  time?: string
  text?: string
  unread?: boolean
  showLine?: boolean
}

function ActivityFeed({
  icon,
  author,
  time,
  text,
  unread = false,
  showLine = true,
  className,
  children,
  ...props
}: ActivityFeedProps) {
  return (
    <div
      data-slot="activity-feed"
      className={cn("flex items-start gap-3", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-1 self-stretch">
        {icon}
        {showLine && <div aria-hidden className="w-px flex-1 bg-base-100" />}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex flex-col font-default text-10 leading-16 font-semibold tracking-default">
          <div className="flex items-center gap-2 py-0.5">
            <p className="flex flex-1 items-center gap-2 whitespace-nowrap">
              <span className="text-base-700">{author}</span>
              {time && <span className="text-base-400">{time}</span>}
            </p>
            {unread && (
              <span className="size-2 shrink-0 rounded-full bg-primary-600 shadow-[0_1px_2px_0_var(--shadow-base)] outline -outline-offset-1 outline-white">
                <span className="sr-only">Unread</span>
              </span>
            )}
          </div>
          {text && <p className="text-base-400">{text}</p>}
        </div>
        {children}
      </div>
    </div>
  )
}

export { ActivityFeed }
