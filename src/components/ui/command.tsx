"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { Badge } from "@/components/ui/badge"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { cn } from "@/lib/utils"

// Figma Command Menu (page 9402:27554): Command-Component (13889:5002: Category / Item Line /
// Item 2 Line / Footer × Default / Hover / Active × Rounded / Pilled) and the Command-Menu-*
// frames built from it (Search + Tabs + Content slot + Footer, optional Profile preview panel).
// Corner (Rounded / Pilled) is set once on `Command` and read by every part through `group/command`.
const commandVariants = cva(
  "group/command flex flex-col overflow-hidden bg-background-0 font-default font-semibold shadow-[0_16px_32px_0_var(--shadow-base)] outline -outline-offset-1 outline-base-100",
  {
    variants: {
      corner: {
        rounded: "rounded-r12",
        pilled: "rounded-r20",
      },
      layout: {
        list: "w-90",
        split: "w-150",
      },
    },
    defaultVariants: { corner: "rounded", layout: "list" },
  }
)

type CommandCorner = NonNullable<VariantProps<typeof commandVariants>["corner"]>

const CommandCornerContext = React.createContext<CommandCorner>("rounded")

function Command({
  className,
  corner = "rounded",
  layout,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof commandVariants>) {
  return (
    <CommandCornerContext.Provider value={corner ?? "rounded"}>
      <div
        data-slot="command"
        data-corner={corner}
        role="combobox"
        aria-expanded
        aria-haspopup="listbox"
        className={cn(commandVariants({ corner, layout }), className)}
        {...props}
      />
    </CommandCornerContext.Provider>
  )
}

/** Figma Content: the area above the Footer (Search, Tabs and the list or split body). */
function CommandContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="command-content" className={cn("flex min-h-0 flex-1 flex-col", className)} {...props} />
}

/** Figma Search frame: an Input-32 with a search icon, text and the ⌘K keys. Pilled drops the bottom padding. */
function CommandSearch({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & { children?: React.ReactNode }) {
  const corner = React.useContext(CommandCornerContext)
  return (
    <div
      data-slot="command-search"
      className={cn("p-2 group-data-[corner=pilled]/command:pb-0", className)}
      {...props}
    >
      <InputGroup size="32" shape={corner === "pilled" ? "pill" : "rounded"}>
        {children}
      </InputGroup>
    </div>
  )
}

const CommandSearchAddon = InputGroupAddon
const CommandSearchInput = InputGroupInput

/** Figma Tabs row (Tab-Group): put a `Tabs` + `TabsList` inside. */
function CommandTabs({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="command-tabs" className={cn("flex items-center px-2 py-1", className)} {...props} />
}

/** Figma Content [slot]: the scrolling list of categories and items. */
function CommandList({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="command-list"
      role="listbox"
      className={cn("flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-2 pb-2", className)}
      {...props}
    />
  )
}

/** Figma Type=Category: group title, optional count badge and a "View All" action. */
function CommandCategory({
  className,
  title,
  count,
  action = "View All",
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & { title: React.ReactNode; count?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div
      data-slot="command-category"
      role="presentation"
      className={cn(
        "flex h-9 items-center justify-between rounded-r8 px-2 py-2.5 text-10 leading-16 text-base-600 group-data-[corner=pilled]/command:px-3",
        className
      )}
      {...props}
    >
      <span className="flex items-center gap-2">
        {title}
        {count !== undefined && (
          <Badge variant="base" size="square-16" shape="pill">
            {count}
          </Badge>
        )}
      </span>
      {action && <span>{action}</span>}
    </div>
  )
}

// Figma Type=Item Line (h36) / Item 2 Line (h48). Default is transparent, Hover fills background-20,
// Active adds the 1px base-100 stroke. `state` pins a look for previews; real hover / selection
// (aria-selected, data-active) get it automatically.
const commandItemVariants = cva(
  "group/command-item relative flex w-full cursor-default items-center justify-between gap-2 outline -outline-offset-1 outline-transparent transition-colors hover:bg-background-20 aria-selected:bg-background-20 aria-selected:outline-base-100 data-[active=true]:bg-background-20 data-[active=true]:outline-base-100",
  {
    variants: {
      lines: {
        "1": "h-9",
        "2": "h-12",
      },
      state: {
        default: "",
        hover: "bg-background-20",
        active: "bg-background-20 outline-base-100",
      },
    },
    defaultVariants: { lines: "1", state: "default" },
  }
)

function CommandItem({
  className,
  lines,
  state,
  selected,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> &
  VariantProps<typeof commandItemVariants> & { selected?: boolean; children?: React.ReactNode }) {
  return (
    <div
      data-slot="command-item"
      role="option"
      aria-selected={selected}
      className={cn(
        commandItemVariants({ lines, state }),
        "rounded-r8 py-1 pr-2 pl-1 group-data-[corner=pilled]/command:rounded-r20 group-data-[corner=pilled]/command:pr-3 group-data-[corner=pilled]/command:pl-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/** Figma Left: the leading control or media plus the text column. */
function CommandItemMain({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="command-item-main" className={cn("flex min-w-0 flex-1 items-center gap-2", className)} {...props} />
}

/** Figma leading slot (Icon, Brand, Avatar, Country, Payment, Checkbox, Radio, Switcher, Badge). */
function CommandItemLeading({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-item-leading"
      className={cn("flex shrink-0 items-center justify-center pl-1 [&_img]:size-5 [&_img]:rounded-full", className)}
      {...props}
    />
  )
}

/** Figma Content: Name (+ optional inline trailing text) over an optional description. */
function CommandItemText({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="command-item-text" className={cn("flex min-w-0 flex-col", className)} {...props} />
}

function CommandItemName({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="command-item-name"
      className={cn("flex items-center gap-2 truncate text-10 leading-16 text-base-800", className)}
      {...props}
    />
  )
}

/** Figma gray text: the "Add Text" line under the name (2 Line) or beside it (Users / Country). */
function CommandItemDescription({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="command-item-description" className={cn("truncate text-9 leading-16 text-base-400 [div>&]:text-10", className)} {...props} />
}

/** Figma Right: shortcut keys (Command-Keys-Group). Pass the key labels, e.g. ["⌘", "/"]. */
function CommandItemKeys({ keys, className, ...props }: Omit<React.ComponentProps<typeof KbdGroup>, "children"> & { keys: string[] }) {
  const corner = React.useContext(CommandCornerContext)
  return (
    <KbdGroup size="20" data-slot="command-item-keys" className={cn("shrink-0", className)} {...props}>
      {keys.map((key, index) => (
        <Kbd key={`${key}-${index}`} glyph={key.length === 1} shape={corner === "pilled" ? "pill" : "rounded"}>
          {key}
        </Kbd>
      ))}
    </KbdGroup>
  )
}

/** Figma Type=Footer: select / navigate / close hints. */
function CommandFooter({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="command-footer"
      className={cn(
        "flex items-center gap-2 bg-background-20 p-3 text-10 leading-16 text-base-600 outline -outline-offset-1 outline-base-100 group-data-[corner=pilled]/command:bg-transparent group-data-[corner=pilled]/command:outline-transparent",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          <CommandHint keys={["↵"]}>select</CommandHint>
          <CommandHint keys={["↓"]}>navigate</CommandHint>
          <CommandHint keys={["Esc"]}>close</CommandHint>
        </>
      )}
    </div>
  )
}

function CommandHint({ keys, children, className, ...props }: Omit<React.ComponentProps<"span">, "children"> & { keys: string[]; children: React.ReactNode }) {
  return (
    <span data-slot="command-hint" className={cn("flex items-center gap-2", className)} {...props}>
      <CommandItemKeys keys={keys} />
      {children}
    </span>
  )
}

/** Figma split layout: list on the left, Profile preview on the right (Command-Menu-Profile-*). */
function CommandSplit({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="command-split" className={cn("flex min-h-0 flex-1", className)} {...props} />
}

function CommandPreview({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="command-preview" className={cn("flex w-75 shrink-0 flex-col p-3", className)} {...props} />
}

export {
  Command,
  CommandCategory,
  CommandContent,
  CommandFooter,
  CommandHint,
  CommandItem,
  CommandItemDescription,
  CommandItemKeys,
  CommandItemLeading,
  CommandItemMain,
  CommandItemName,
  CommandItemText,
  CommandList,
  CommandPreview,
  CommandSearch,
  CommandSearchAddon,
  CommandSearchInput,
  CommandSplit,
  CommandTabs,
  commandItemVariants,
  commandVariants,
}
export type { CommandCorner }
