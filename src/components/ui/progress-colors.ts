// Shared by progress.tsx and progress-circle.tsx; no "use client" so Server Components can read it.

/**
 * Figma Progress `Style` (Progress-Line, Progress-Circular, Progress-Circle-Half).
 * Line has Dark (`primary-dark`) but no Black; Circular and Half have both. Every slot accepts all of them.
 */
export const progressColors = [
  "primary",
  "primary-dark",
  "black",
  "white",
  "orange",
  "purple",
  "red",
  "yellow",
  "green",
  "sky",
  "pink",
  "amber",
  "teal",
  "blue",
  "blue-flat",
  "lime",
  "cyan",
  "emerald",
  "rose",
  "fuchsia",
  "violet",
  "indigo",
  "gray",
] as const

export type ProgressColor = (typeof progressColors)[number]
