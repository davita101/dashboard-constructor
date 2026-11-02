import {
  CodeSnippet,
  CodeSnippetAction,
  CodeSnippetBody,
  CodeSnippetCode,
  CodeSnippetHead,
  CodeSnippetHeading,
  CodeSnippetLine,
  CodeSnippetLines,
} from "@/components/ui/code-snippet"

// Mirrors the Figma Code Snippet page (11407:87015): Code-Snippet, single component.

const code = [
  "function factorial(num) {",
  "  // If the number is less than 0, throw an error",
  "  if (num < 0) {",
  "    throw new Error('Cannot calculate factorial of negative number');",
  "  }",
  "",
  "  // If the number is 0 or 1, return 1",
  "  if (num === 0 || num === 1) {",
  "    return 1;",
  "  }",
  "",
  "  // Calculate the factorial recursively",
  "  return num * factorial(num - 1);",
  "}",
  "// Test the function with a few example values",
  "console.log(factorial(5)); // Output: 120",
]

export default function CodeSnippetPreviewPage() {
  return (
    <main className="flex flex-1 flex-wrap items-start justify-center gap-20 bg-background-10 px-4 py-20">
      <CodeSnippet className="h-133">
        <CodeSnippetHead>
          <CodeSnippetHeading>Heading</CodeSnippetHeading>
          <CodeSnippetAction>Copy Code</CodeSnippetAction>
        </CodeSnippetHead>
        <CodeSnippetBody>
          <CodeSnippetLines lines={code.length} />
          <CodeSnippetCode>
            {code.map((line, i) => (
              <CodeSnippetLine key={i}>{line}</CodeSnippetLine>
            ))}
          </CodeSnippetCode>
        </CodeSnippetBody>
      </CodeSnippet>
    </main>
  )
}
