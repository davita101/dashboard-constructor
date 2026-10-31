import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CloseAction } from "@/components/ui/icon-action"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// Figma Notifications-01…05 (page 12145:243335). Cards are 280px wide; the layout sets padding
// and direction, and `compact` switches to the 11/10 text scale (Notifications-05).
const notificationVariants = cva(
  "group/notification relative flex w-70 max-w-full rounded-r12 bg-background-0 font-default tracking-default text-base-900 outline -outline-offset-1 outline-background-100",
  {
    variants: {
      layout: {
        // 01 Default: thumbnail left, content + close right
        inline: "items-center p-1",
        // 01 Links: content left, stacked links in a divided aside
        aside: "items-stretch",
        // 02: media on top, content below
        media: "flex-col p-1",
        // 03: avatar + text, link column on the right
        split: "items-stretch",
        // 04: avatar + text + footer buttons, close top-right
        footer: "items-start gap-4 py-4 pr-6 pl-4",
        // 05: compact thumbnail card
        compact: "items-stretch gap-3 p-2",
      },
    },
    defaultVariants: { layout: "inline" },
  }
)

function Notification({
  className,
  layout,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof notificationVariants>) {
  return (
    <div
      data-slot="notification"
      data-layout={layout ?? "inline"}
      role="status"
      className={cn(notificationVariants({ layout }), className)}
      {...props}
    />
  )
}

const notificationImageVariants = cva("shrink-0 rounded-r8 bg-base-100 object-cover", {
  variants: {
    size: {
      "64": "size-16",
      "84": "size-21",
      wide: "h-38 w-full",
    },
  },
  defaultVariants: { size: "64" },
})

/** Figma Image rectangle (r8). Decorative unless `alt` is given. */
function NotificationImage({
  className,
  size,
  alt = "",
  ...props
}: React.ComponentProps<"img"> & VariantProps<typeof notificationImageVariants>) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      data-slot="notification-image"
      alt={alt}
      className={cn(notificationImageVariants({ size }), className)}
      {...props}
    />
  )
}

/** Figma Badge-Icon-Pilled: round white badge holding a glyph. */
function NotificationIcon({
  className,
  size = "32",
  icon = "/icons/material-default-icon.svg",
  style,
  ...props
}: Omit<React.ComponentProps<typeof Badge>, "children" | "variant" | "shape" | "size"> & { size?: "32" | "40"; icon?: string }) {
  return (
    <Badge
      data-slot="notification-icon"
      variant="base"
      shape="pill"
      size={size === "40" ? "square-40" : "square-32"}
      className={className}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          "bg-base-500 mask-(--notification-icon) mask-contain mask-center mask-no-repeat",
          size === "40" ? "size-5" : "size-4"
        )}
        style={{ "--notification-icon": `url(${icon})`, ...style } as React.CSSProperties}
      />
    </Badge>
  )
}

/** Body row (padding comes from the usage). */
function NotificationContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="notification-content" className={cn("flex min-w-0 flex-1 gap-3", className)} {...props} />
}

function NotificationText({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="notification-text" className={cn("flex min-w-0 flex-col gap-1", className)} {...props} />
}

/** Heading + additional text on one row (Figma Line). */
function NotificationLine({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="notification-line" className={cn("flex items-center gap-2", className)} {...props} />
}

function NotificationTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="notification-title"
      className={cn(
        "text-12 leading-20 font-semibold whitespace-nowrap text-base-900 group-data-[layout=compact]/notification:text-11",
        className
      )}
      {...props}
    />
  )
}

const notificationMetaVariants = cva(
  "text-12 leading-20 font-semibold whitespace-nowrap group-data-[layout=compact]/notification:text-11",
  {
    variants: { tone: { muted: "text-base-300", default: "text-base-500" } },
    defaultVariants: { tone: "muted" },
  }
)

function NotificationMeta({
  className,
  tone,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof notificationMetaVariants>) {
  return <div data-slot="notification-meta" className={cn(notificationMetaVariants({ tone }), className)} {...props} />
}

function NotificationDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="notification-description"
      className={cn(
        "text-12 leading-20 font-semibold text-base-500 group-data-[layout=compact]/notification:text-10 group-data-[layout=compact]/notification:leading-16",
        className
      )}
      {...props}
    />
  )
}

/** Row of Link actions (Figma Links). */
function NotificationLinks({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="notification-links"
      className={cn("flex items-center gap-3 group-data-[layout=compact]/notification:gap-2", className)}
      {...props}
    />
  )
}

/** Divided aside column (Figma Right): a Separator then the links column. */
function NotificationAside({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <>
      <Separator orientation="vertical" className="h-auto self-stretch bg-background-100" />
      <div
        data-slot="notification-aside"
        className={cn("flex shrink-0 flex-col items-center justify-center", className)}
        {...props}
      />
    </>
  )
}

/** Footer buttons row (Figma Footer). */
function NotificationFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="notification-footer" className={cn("flex items-center gap-2 pt-2", className)} {...props} />
}

/** Figma Close (20px glyph). */
function NotificationClose({ className, ...props }: React.ComponentProps<typeof CloseAction>) {
  return <CloseAction data-slot="notification-close" className={className} {...props} />
}

/** Figma White-Button over the media (32px round close). */
function NotificationMediaClose({ className, children, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="notification-media-close"
      variant="white"
      size="icon-32"
      aria-label="Close"
      className={cn("absolute top-3 right-3", className)}
      {...props}
    >
      {children ?? (
        <span
          aria-hidden
          className="size-4 bg-current mask-[url(/icons/material-close.svg)] mask-contain mask-center mask-no-repeat"
        />
      )}
    </Button>
  )
}

export {
  Notification,
  NotificationAside,
  NotificationClose,
  NotificationContent,
  NotificationDescription,
  NotificationFooter,
  NotificationIcon,
  NotificationImage,
  NotificationLine,
  NotificationLinks,
  NotificationMediaClose,
  NotificationMeta,
  NotificationText,
  NotificationTitle,
  notificationImageVariants,
  notificationMetaVariants,
  notificationVariants,
}
