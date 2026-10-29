import Image from "next/image"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

// Commerce Constructor 7.7 — Activity-Form-Component (Figma 11526:180720)
// Avatar: Left Large 11155:49984 (32px) · Left Small 11527:274290 (24px) · Top 11527:274358 (20px + name)

type ActivityFormProps = React.ComponentProps<"form"> & {
  avatar?: "left-large" | "left-small" | "top"
  /** Avatar image; falls back to `initials` (Figma Avatar-Text). */
  avatarSrc?: string
  initials?: string
  name?: string
  placeholder?: string
}

const avatarSize = {
  "left-large": "size-8",
  "left-small": "size-6",
  top: "size-5",
} as const

function ActivityForm({
  avatar = "left-large",
  avatarSrc,
  initials,
  name,
  placeholder = "Enter Text Here...",
  className,
  ...props
}: ActivityFormProps) {
  const avatarNode = (
    <Avatar className={cn(avatarSize[avatar], "after:hidden")}>
      {avatarSrc && <AvatarImage src={avatarSrc} alt={name ?? ""} />}
      <AvatarFallback className="bg-linear-to-b from-primary-alpha-5 to-primary-alpha-15 font-default text-10 leading-16 font-bold tracking-default text-primary-600 outline -outline-offset-1 outline-primary-alpha-20">
        {initials}
      </AvatarFallback>
    </Avatar>
  )

  return (
    <form
      data-slot="activity-form"
      className={cn("flex items-start gap-3", avatar === "top" && "flex-col", className)}
      {...props}
    >
      {avatar === "top" ? (
        <div className="flex w-full items-center gap-3">
          {avatarNode}
          {name && (
            <span className="font-default text-10 leading-16 font-semibold tracking-default text-base-700">
              {name}
            </span>
          )}
        </div>
      ) : (
        avatarNode
      )}
      <div
        className={cn(
          "flex h-24 w-full min-w-0 flex-col justify-between rounded-r12 bg-base-0 shadow-[0_1px_2px_0_var(--shadow-base)] outline -outline-offset-1 outline-base-100 focus-within:outline-primary-500",
          // Row layouts: fill the space beside the avatar. In the column (Top) layout flex-1 would zero the height.
          avatar !== "top" && "flex-1"
        )}
      >
        <Textarea
          name="message"
          aria-label="Message"
          placeholder={placeholder}
          className="min-h-0 flex-1 resize-none rounded-none border-0 bg-transparent pt-4 pr-6 pb-0 pl-4 font-default text-10 leading-16 font-semibold tracking-default text-base-800 shadow-none placeholder:text-base-700 focus-visible:ring-0 md:text-10 dark:bg-transparent"
        />
        <div className="flex items-center justify-between px-3 pb-3">
          <div className="flex items-center gap-2">
            <ToolButton src="/icons/material-attachment.svg" label="Attach file" />
            <ToolButton src="/icons/material-mic-none.svg" label="Record voice message" />
            <ToolButton src="/icons/material-mood.svg" label="Add emoji" />
          </div>
          <Button type="submit" variant="outline" size="24">
            Send
          </Button>
        </div>
      </div>
    </form>
  )
}

function ToolButton({ src, label }: { src: string; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
    >
      <Image src={src} alt="" width={16} height={16} />
    </button>
  )
}

export { ActivityForm }
