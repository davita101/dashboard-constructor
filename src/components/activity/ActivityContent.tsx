import Image from "next/image"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

// Commerce Constructor 7.7 — Activity-Content-Component (Figma 11119:7736)
// Type: File 11119:7682 · Feed Message 11119:7683 · Player 11119:7684 · Video 11119:7685 · Image 11119:7686

type ActivityContentProps = { className?: string } &
  (
    | { type: "feed-message"; text: string }
    | { type: "file"; fileName: string; fileSize?: string }
    | { type: "player"; currentTime: string; duration: string; progress?: number }
    | {
        type: "video"
        src: string
        heading: string
        currentTime: string
        remainingTime: string
        progress?: number
      }
    | { type: "image"; src: string; alt: string }
  )

const textClass = "font-default text-10 leading-16 tracking-default"

function ActivityContent(props: ActivityContentProps) {
  const { className } = props

  return (
    <Card
      data-slot="activity-content"
      data-type={props.type}
      className={cn(
        // Reset shadcn Card chrome; Figma strokes sit inside the box.
        "w-full gap-0 rounded-r12 bg-base-0 py-0 text-base-700 ring-0 outline -outline-offset-1 outline-base-100",
        props.type === "feed-message" && "py-3 pr-5 pl-3",
        props.type === "file" && "flex-row items-center justify-between py-2 pr-3 pl-2",
        props.type === "player" && "flex-row items-center gap-2 p-2",
        (props.type === "video" || props.type === "image") && "p-3",
        className
      )}
    >
      <ActivityContentBody {...props} />
    </Card>
  )
}

function ActivityContentBody(props: ActivityContentProps) {
  switch (props.type) {
    case "feed-message":
      return <p className={cn(textClass, "font-semibold text-base-700")}>{props.text}</p>

    case "file":
      return (
        <>
          <div className="flex items-center gap-2">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-r6 bg-base-0 shadow-[0_1px_2px_0_var(--shadow-base)] outline -outline-offset-1 outline-base-100">
              <Image src="/icons/material-insert-drive-file.svg" alt="" width={12} height={12} />
            </span>
            <p className={cn(textClass, "flex gap-2 font-semibold whitespace-nowrap")}>
              <span className="text-base-700">{props.fileName}</span>
              {props.fileSize && <span className="text-base-400">{props.fileSize}</span>}
            </p>
          </div>
          <IconButton src="/icons/material-more-horiz.svg" label="More file options" />
        </>
      )

    case "player":
      return (
        <>
          <div className="flex shrink-0 items-center gap-1">
            <IconButton src="/icons/material-play-arrow.svg" label="Play" />
            <span className={cn(textClass, "font-bold whitespace-nowrap text-base-800")}>
              {props.currentTime} / {props.duration}
            </span>
          </div>
          <Progress
            value={props.progress ?? 60}
            aria-label="Playback progress"
            color="primary"
            className="flex-1"
          />
          <IconButton src="/icons/material-volume-up.svg" label="Volume" />
        </>
      )

    case "video":
      return (
        <div className="relative flex h-50 w-full flex-col justify-between overflow-hidden rounded-r8 p-3">
          <Image src={props.src} alt="" fill sizes="300px" className="object-cover" />
          <div className="relative flex items-center justify-between">
            <p className={cn(textClass, "text-12 leading-20 font-bold whitespace-nowrap text-white")}>
              {props.heading}
            </p>
            <IconButton src="/icons/material-more-horiz-white.svg" label="More video options" />
          </div>
          <div className="relative flex justify-center">
            <button
              type="button"
              aria-label="Play video"
              className="flex h-15 cursor-pointer items-center justify-center rounded-full bg-black-alpha-20 p-4 outline -outline-offset-1 outline-black-alpha-5 backdrop-blur-[15px] focus-visible:ring-2 focus-visible:ring-white"
            >
              <Image src="/icons/material-play-arrow-white.svg" alt="" width={28} height={28} />
            </button>
          </div>
          <div className="relative flex flex-col gap-2">
            <Progress
              value={props.progress ?? 60}
              aria-label="Playback progress"
              color="white"
            />
            <div className={cn(textClass, "flex justify-between font-bold text-white")}>
              <span>{props.currentTime}</span>
              <span>{props.remainingTime}</span>
            </div>
          </div>
        </div>
      )

    case "image":
      return (
        <div className="relative h-31 w-full overflow-hidden rounded-r8">
          <Image src={props.src} alt={props.alt} fill sizes="300px" className="object-cover" />
        </div>
      )
  }
}

function IconButton({ src, label }: { src: string; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex shrink-0 cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
    >
      <Image src={src} alt="" width={20} height={20} />
    </button>
  )
}

export { ActivityContent }
