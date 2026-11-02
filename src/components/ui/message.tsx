import * as React from "react"
import Image from "next/image"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button, ButtonIcon } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { MapImage } from "@/components/ui/map-image"
import { Progress } from "@/components/ui/progress"

// Figma Messages page (11409:1128): Content-Message-Component, Message, Add-Message,
// Reaction-Type / Reactions-Group / Reaction-Component.

/* ---------------------------------------------------------------- Reaction */

// Figma Reaction-Component: Type Emoji (emoji + amount) / Add (plus icon), State Default / Hover / Active.
const reactionVariants = cva(
  "group/reaction inline-flex h-6 shrink-0 cursor-pointer items-center justify-center rounded-full font-default text-11 leading-20 font-bold tracking-default outline -outline-offset-1 transition-colors",
  {
    variants: {
      type: {
        emoji: "px-2 text-base-700",
        add: "w-6 text-base-700",
      },
      state: {
        default: "bg-background-0 outline-background-100 hover:bg-background-20",
        hover: "bg-background-20 outline-background-100",
        active: "bg-primary-600 text-background-0 outline-primary-700",
      },
    },
    compoundVariants: [{ type: "emoji", state: "active", className: "text-background-0" }],
    defaultVariants: { type: "emoji", state: "default" },
  }
)

type ReactionEmoji =
  | "heart"
  | "eyes"
  | "rolling"
  | "sad"
  | "glass"
  | "heart-eyes"
  | "angry"
  | "victory"
  | "thumbs-up"
  | "star"
  | "clapping"
  | "smile"

// Figma Reaction-Type-Component Type values. Figma draws the emoji as image fills; no
// image assets are exported, so the platform emoji glyph stands in (see known-gaps).
const reactionEmoji: Record<ReactionEmoji, string> = {
  heart: "❤️",
  eyes: "👀",
  rolling: "🤣",
  sad: "😥",
  glass: "😎",
  "heart-eyes": "😍",
  angry: "😠",
  victory: "✌️",
  "thumbs-up": "👍",
  star: "🤩",
  clapping: "👏",
  smile: "🙂",
}

function ReactionEmojiGlyph({ emoji, className }: { emoji: ReactionEmoji; className?: string }) {
  return (
    <span
      data-slot="reaction-emoji"
      aria-hidden
      className={cn("flex size-4 shrink-0 items-center justify-center text-12 leading-16", className)}
    >
      {reactionEmoji[emoji]}
    </span>
  )
}

function Reaction({
  className,
  type = "emoji",
  state = "default",
  emoji = "heart",
  count = 1,
  ...props
}: Omit<React.ComponentProps<"button">, "type"> &
  VariantProps<typeof reactionVariants> & { emoji?: ReactionEmoji; count?: number }) {
  return (
    <button
      type="button"
      data-slot="reaction"
      data-type={type}
      data-state={state}
      className={cn(reactionVariants({ type, state }), className)}
      {...props}
    >
      {type === "add" ? (
        <ButtonIcon src="/icons/material-add-circle.svg" className="size-4" />
      ) : (
        <>
          <ReactionEmojiGlyph emoji={emoji ?? "heart"} />
          <span data-slot="reaction-amount" className="px-1">
            {count}
          </span>
        </>
      )}
    </button>
  )
}

/** Figma Reaction-Type-Component: one reaction chip per emoji type. */
function ReactionType({ type, ...props }: Omit<React.ComponentProps<typeof Reaction>, "emoji" | "type"> & { type: ReactionEmoji }) {
  return <Reaction emoji={type} {...props} />
}

/** Figma Reactions-Group-Component: chips in a row with a trailing Add chip. */
function ReactionsGroup({
  className,
  reactions,
  ...props
}: React.ComponentProps<"div"> & { reactions: { emoji: ReactionEmoji; count: number }[] }) {
  return (
    <div data-slot="reactions-group" className={cn("flex flex-wrap items-center gap-2", className)} {...props}>
      {reactions.map((r) => (
        <Reaction key={r.emoji} emoji={r.emoji} count={r.count} />
      ))}
      <Reaction type="add" aria-label="Add reaction" />
    </div>
  )
}

/* ------------------------------------------------- Content-Message-Component */

// Figma Content-Message-Component: the bubble. Message / Message Primary are text,
// the other Types are cards (r16, 12px padding) around media.
const contentMessageVariants = cva(
  "relative flex w-49 flex-col overflow-hidden font-default tracking-default outline -outline-offset-1",
  {
    variants: {
      type: {
        message: "rounded-r12 bg-background-0 px-3 py-2 text-12 leading-20 font-semibold text-base-700 outline-background-100",
        primary: "rounded-r12 bg-primary-600 px-3 py-2 text-12 leading-20 font-semibold text-background-0 outline-primary-700",
        audio: "rounded-full bg-background-0 px-3 py-2 outline-background-100",
        card: "rounded-r16 bg-background-0 p-3 outline-background-100",
      },
    },
    defaultVariants: { type: "message" },
  }
)

function ContentMessage({ className, type = "message", ...props }: React.ComponentProps<"div"> & VariantProps<typeof contentMessageVariants>) {
  return <div data-slot="content-message" data-type={type} className={cn(contentMessageVariants({ type }), className)} {...props} />
}

/** Figma Type=Audio: play, time, progress line, volume. */
function ContentMessageAudio({ className, current = "8:58", total = "20:45", value = 40, ...props }: React.ComponentProps<"div"> & { current?: string; total?: string; value?: number }) {
  return (
    <ContentMessage type="audio" className={className} {...props}>
      <div className="flex items-center gap-2">
        <div className="flex shrink-0 items-center gap-1">
          <ButtonIcon src="/icons/material-play-arrow.svg" className="size-5 text-base-800" />
          <span className="text-10 leading-16 font-bold text-base-800">
            {current} / {total}
          </span>
        </div>
        <Progress value={value} aria-label="Playback" className="min-w-0 flex-1" />
        <ButtonIcon src="/icons/material-volume-up.svg" className="size-5 text-base-800" />
      </div>
    </ContentMessage>
  )
}

const mediaClass = "relative block aspect-[172/160] w-full overflow-hidden rounded-r8 bg-base-100"

/** Figma Image frame (r8 photo, 172x160). */
function MessageImage({ className, src, alt = "", ...props }: React.ComponentProps<"div"> & { src: string; alt?: string }) {
  return (
    <div data-slot="message-image" className={cn(mediaClass, className)} {...props}>
      <Image src={src} alt={alt} fill sizes="172px" className="object-cover" />
    </div>
  )
}

/** Figma Type=Video: photo with heading, play button, progress and times. */
function ContentMessageVideo({ className, heading = "Video Heading", src = "/images/activity/video.jpg", ...props }: React.ComponentProps<"div"> & { heading?: string; src?: string }) {
  return (
    <ContentMessage type="card" className={className} {...props}>
      <div className={cn(mediaClass, "flex flex-col justify-between p-3")}>
        <Image src={src} alt="" fill sizes="172px" className="object-cover" />
        <div className="relative flex items-center justify-between text-12 leading-20 font-bold text-background-0">
          <span>{heading}</span>
          <ButtonIcon src="/icons/material-more-horiz-white.svg" className="size-5" />
        </div>
        <div className="relative flex justify-center">
          <Button variant="black-soft" size="icon-40" aria-label="Play">
            <ButtonIcon src="/icons/material-play-arrow-white.svg" />
          </Button>
        </div>
        <div className="relative flex flex-col gap-2 text-10 leading-16 font-bold text-background-0">
          <Progress value={40} color="white" aria-label="Playback" />
          <div className="flex justify-between">
            <span>8:58</span>
            <span>2:45</span>
          </div>
        </div>
      </div>
    </ContentMessage>
  )
}

/** Figma Type=Image + Text. */
function ContentMessageImageText({ className, src = "/images/activity/image.jpg", children = "Turn on chat features in Messages?", ...props }: React.ComponentProps<"div"> & { src?: string }) {
  return (
    <ContentMessage type="card" className={cn("gap-2", className)} {...props}>
      <MessageImage src={src} />
      <p className="pt-1 pl-1.5 text-12 leading-20 font-semibold text-base-700">{children}</p>
    </ContentMessage>
  )
}

/** Figma Type=Image. */
function ContentMessagePhoto({ className, src = "/images/activity/image.jpg", ...props }: React.ComponentProps<"div"> & { src?: string }) {
  return (
    <ContentMessage type="card" className={className} {...props}>
      <MessageImage src={src} />
    </ContentMessage>
  )
}

/** Figma Type=Images: two thumbnails, the second with a "+N" Badge-Square-Pilled. */
function ContentMessageImages({ className, sources = ["/images/activity/image.jpg", "/images/activity/avatar.jpg"], more = 5, ...props }: React.ComponentProps<"div"> & { sources?: string[]; more?: number }) {
  return (
    <ContentMessage type="card" className={cn("flex-row gap-3", className)} {...props}>
      {sources.map((src, i) => (
        <div key={src} className="relative size-20 shrink-0 overflow-hidden rounded-r8 bg-base-100">
          <Image src={src} alt="" fill sizes="80px" className="object-cover" />
          {i === sources.length - 1 && more > 0 ? (
            <Badge variant="black" size="32" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-11 leading-20 font-bold">
              +{more}
            </Badge>
          ) : null}
        </div>
      ))}
    </ContentMessage>
  )
}

const codeTokens: [RegExp, string][] = [
  [/^\/\/.*/, "text-green-600"],
  [/^(function|if|return|throw|new|const|let)\b/, "text-purple-600"],
  [/^(console|log|Error)\b/, "text-sky-600"],
  [/^'[^']*'/, "text-amber-600"],
  [/^\d+/, "text-sky-600"],
]

function highlight(line: string) {
  const out: React.ReactNode[] = []
  let rest = line
  let key = 0
  while (rest.length > 0) {
    const hit = codeTokens.map(([re, cls]) => ({ m: re.exec(rest), cls })).find((t) => t.m)
    if (hit?.m) {
      out.push(
        <span key={key++} className={hit.cls}>
          {hit.m[0]}
        </span>
      )
      rest = rest.slice(hit.m[0].length)
    } else {
      const next = rest.slice(1).search(/[A-Za-z0-9'/]/)
      const cut = next === -1 ? rest.length : next + 1
      out.push(<React.Fragment key={key++}>{rest.slice(0, cut)}</React.Fragment>)
      rest = rest.slice(cut)
    }
  }
  return out
}

const sampleCode = `function factorial(num) {
  // If the number is less than 0, throw an error
  if (num < 0) {
    throw new Error('Cannot calculate factorial of negative number');
  }

  // If the number is 0 or 1, return 1
  if (num === 0 || num === 1) {
    return 1;
  }

  // Calculate the factorial recursively
  return num * factorial(num - 1);
}

// Test the function with a few example values
console.log(factorial(5)); // Output: 120
console.log(factorial(0)); // Output: 1
console.log(factorial(-3)); // Throws an error`

/** Figma Type=Code: Code Snippet with a heading + Copy Code button and a scrolling code body. */
function ContentMessageCode({ className, heading = "Heading", code = sampleCode, ...props }: React.ComponentProps<"div"> & { heading?: string; code?: string }) {
  return (
    <ContentMessage type="card" className={cn("h-125", className)} {...props}>
      <div data-slot="code-snippet" className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-r12 outline -outline-offset-1 outline-background-100">
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-background-100 bg-background-0 px-4">
          <span className="text-10 leading-16 font-bold text-base-700">{heading}</span>
          <Button variant="outline" size="24" shape="rounded">
            Copy Code
          </Button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto bg-background-0 p-4">
          <pre className="font-mono text-12 leading-20 font-medium whitespace-pre text-base-900">
            {code.split("\n").map((line, i) => (
              <div key={i} className="min-h-5">
                {highlight(line)}
              </div>
            ))}
          </pre>
          <div className="mt-3 h-1 w-13 rounded-r8 bg-base-150" />
        </div>
      </div>
    </ContentMessage>
  )
}

/** Figma Type=Map Dark / Map Light: map photo, fullscreen button, address card, pin. */
function ContentMessageMap({
  className,
  appearance = "light",
  address = "2173 Terry Park Apt. 256 New York, NY 10022",
  ...props
}: React.ComponentProps<"div"> & { appearance?: "light" | "dark"; address?: string }) {
  const dark = appearance === "dark"
  return (
    <ContentMessage type="card" className={className} {...props}>
      <div className="relative flex aspect-[172/200] w-full flex-col justify-between overflow-hidden rounded-r8">
        <MapImage appearance={appearance} className="absolute inset-0 aspect-auto h-full" sizes="172px" />
        <div className="relative p-3">
          <Button variant={dark ? "black" : "outline"} size="icon-32" aria-label="Fullscreen">
            <ButtonIcon src="/icons/material-fullscreen.svg" />
          </Button>
        </div>
        <ButtonIcon src="/icons/material-pin-drop.svg" className={cn("absolute top-1/2 left-1/2 size-6 -translate-x-1/2 -translate-y-1/2", dark ? "text-background-0" : "text-primary-600")} />
        <div
          className={cn(
            "relative mr-5 mb-5 ml-3 w-38 rounded-r12 p-3 text-10 leading-16 font-semibold outline -outline-offset-1",
            dark ? "bg-gray-900 text-background-100 outline-base-800" : "bg-background-0 text-base-700 outline-background-100"
          )}
        >
          {address}
        </div>
      </div>
    </ContentMessage>
  )
}

/* ----------------------------------------------------------------- Message */

// Figma Message: Type Left (avatar left) / Right (avatar right, mirrored) / Full / Typing.
const messageVariants = cva("group/message flex font-default tracking-default", {
  variants: {
    type: {
      left: "w-72 flex-row gap-4",
      right: "w-72 flex-row-reverse gap-4",
      full: "w-72 flex-row gap-4",
      typing: "items-center gap-4",
    },
  },
  defaultVariants: { type: "left" },
})

function Message({ className, type = "left", ...props }: React.ComponentProps<"div"> & VariantProps<typeof messageVariants>) {
  return <div data-slot="message" data-type={type} className={cn(messageVariants({ type }), className)} {...props} />
}

/** Figma Activity column: 40px avatar and, unless typing, a checkbox. */
function MessageActivity({ className, src = "/images/activity/avatar.jpg", selectable = true, ...props }: React.ComponentProps<"div"> & { src?: string; selectable?: boolean }) {
  return (
    <div data-slot="message-activity" className={cn("flex shrink-0 flex-col items-center gap-4", selectable && "pb-13", className)} {...props}>
      <Avatar size="40">
        <AvatarImage src={src} alt="" />
      </Avatar>
      {selectable ? <Checkbox aria-label="Select message" /> : null}
    </div>
  )
}

function MessageBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="message-body" className={cn("flex min-w-0 flex-1 flex-col gap-2", className)} {...props} />
}

/** Figma Name row: author, time and the copy / edit actions. */
function MessageName({ className, name = "John Traveller", time = "2 min ago", children, ...props }: React.ComponentProps<"div"> & { name?: string; time?: string }) {
  return (
    <div data-slot="message-name" className={cn("flex items-center justify-between group-data-[type=right]/message:flex-row-reverse", className)} {...props}>
      <div className="flex items-center gap-2 group-data-[type=right]/message:flex-row-reverse">
        <span className="text-12 leading-20 font-semibold text-base-700">{name}</span>
        {time ? <span className="text-10 leading-16 font-semibold text-base-400">{time}</span> : null}
      </div>
      {children}
    </div>
  )
}

/** Figma Tags row: Tag chips. */
function MessageTags({ className, tags = ["Tag", "Tag", "Tag"], ...props }: React.ComponentProps<"div"> & { tags?: string[] }) {
  return (
    <div data-slot="message-tags" className={cn("flex flex-wrap gap-1", className)} {...props}>
      {tags.map((tag, i) => (
        <Badge key={i} variant="base" shape="rounded" size="24">
          {tag}
        </Badge>
      ))}
    </div>
  )
}

/** Figma Type=Typing line: "<name> is typing...". */
function MessageTyping({ className, name = "John Traveller", ...props }: React.ComponentProps<"div"> & { name?: string }) {
  return (
    <div data-slot="message-typing" className={cn("flex items-center gap-2", className)} {...props}>
      <span className="text-12 leading-20 font-semibold text-base-700">{name}</span>
      <span className="text-10 leading-16 font-semibold text-base-400">is typing...</span>
    </div>
  )
}

/* ------------------------------------------------------------- Add-Message */

// Figma Add-Message: composer pill, Corner Pilled (r20, round avatar) / Rounded (r12, r8 avatar).
const addMessageVariants = cva(
  "flex h-10 min-w-50 items-center justify-between gap-2 whitespace-nowrap bg-background-0 py-1 pr-2 pl-1 font-default tracking-default outline -outline-offset-1 outline-background-100",
  {
    variants: {
      corner: { pilled: "rounded-r20", rounded: "rounded-r12" },
    },
    defaultVariants: { corner: "pilled" },
  }
)

function AddMessage({ className, corner = "pilled", src = "/images/activity/avatar.jpg", placeholder = "Your Message", ...props }: React.ComponentProps<"div"> & VariantProps<typeof addMessageVariants> & { src?: string; placeholder?: string }) {
  const pilled = corner !== "rounded"
  return (
    <div data-slot="add-message" data-corner={corner} className={cn(addMessageVariants({ corner }), className)} {...props}>
      <div className="flex items-center gap-2">
        <Avatar size="32" shape={pilled ? "circle" : "rounded"}>
          <AvatarImage src={src} alt="" />
        </Avatar>
        <span className="text-10 leading-16 font-semibold text-base-700">{placeholder}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-base-500">
          <ButtonIcon src="/icons/material-mic-none.svg" className="size-4" />
          <ButtonIcon src="/icons/material-add-circle.svg" className="size-4" />
          <ReactionEmojiGlyph emoji="smile" />
        </div>
        <Button variant="outline" size="24" shape={pilled ? "pill" : "rounded"}>
          Send
        </Button>
      </div>
    </div>
  )
}

export {
  AddMessage,
  ContentMessage,
  ContentMessageAudio,
  ContentMessageCode,
  ContentMessageImages,
  ContentMessageImageText,
  ContentMessageMap,
  ContentMessagePhoto,
  ContentMessageVideo,
  Message,
  MessageActivity,
  MessageBody,
  MessageImage,
  MessageName,
  MessageTags,
  MessageTyping,
  Reaction,
  ReactionType,
  ReactionsGroup,
  addMessageVariants,
  contentMessageVariants,
  messageVariants,
  reactionVariants,
  type ReactionEmoji,
}
