import * as React from "react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

// Figma Code-Snippet: Head (heading + outline copy button) over Code (line numbers + code).
function CodeSnippet({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-snippet"
      className={cn(
        "flex w-80 flex-col overflow-hidden rounded-r12 bg-background-0 outline -outline-offset-1 outline-background-100",
        className
      )}
      {...props}
    />
  )
}

function CodeSnippetHead({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-snippet-head"
      className={cn(
        "flex items-center justify-between bg-background-0 px-4 py-3 outline -outline-offset-1 outline-background-100",
        className
      )}
      {...props}
    />
  )
}

function CodeSnippetHeading({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="code-snippet-heading"
      className={cn("text-10 leading-16 font-bold text-base-700", className)}
      {...props}
    />
  )
}

function CodeSnippetAction({ children, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button data-slot="code-snippet-action" variant="outline" size="24" {...props}>
      {children}
    </Button>
  )
}

function CodeSnippetBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-snippet-body"
      className={cn(
        "flex min-h-0 flex-1 bg-background-0 outline -outline-offset-1 outline-background-100",
        className
      )}
      {...props}
    />
  )
}

function CodeSnippetLines({ lines, className }: { lines: number; className?: string }) {
  return (
    <div
      data-slot="code-snippet-lines"
      aria-hidden
      className={cn(
        "flex shrink-0 flex-col gap-2 bg-background-30 px-4 pt-4 pb-7 font-mono text-12 leading-20 font-semibold text-violet-600 outline -outline-offset-1 outline-background-100",
        className
      )}
    >
      {Array.from({ length: lines }, (_, i) => (
        <span key={i} className="text-right">
          {i + 1}
        </span>
      ))}
    </div>
  )
}

function CodeSnippetCode({
  children,
  className,
  ...props
}: React.ComponentProps<typeof ScrollArea>) {
  return (
    <ScrollArea data-slot="code-snippet-code" className={cn("min-w-0 flex-1", className)} {...props}>
      <pre className="flex flex-col gap-2 py-4 pr-6 pl-4 font-mono text-12 leading-20 font-medium whitespace-pre text-base-900">
        <code className="contents">{children}</code>
      </pre>
    </ScrollArea>
  )
}

/** One code line; keeps blank lines at full height. */
function CodeSnippetLine({ className, children, ...props }: React.ComponentProps<"span">) {
  return (
    <span data-slot="code-snippet-line" className={cn("block min-h-5", className)} {...props}>
      {children}
    </span>
  )
}

export {
  CodeSnippet,
  CodeSnippetHead,
  CodeSnippetHeading,
  CodeSnippetAction,
  CodeSnippetBody,
  CodeSnippetLines,
  CodeSnippetCode,
  CodeSnippetLine,
}
