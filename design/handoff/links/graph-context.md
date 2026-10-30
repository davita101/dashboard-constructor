# Links: graph context

graphify query "Links: which ui primitives, cva variants, icons and design-system pages already exist that this should reuse" (graph has no Links node; existing pieces confirmed in code):

- `src/components/ui/button.tsx`: `buttonVariants` (cva variant/size/shape). shadcn has a `link` button variant upstream; there is no `link` variant here yet. A text link that looks like a button-ish link could be a Button `link` variant, but a standalone `link.tsx` (cva on `<a>`, `render`/asChild for next/link) is likely cleaner.
- `src/components/ui/breadcrumb.tsx`: `BreadcrumbLink` styling (text-base-700, hover:text-primary-600, focus-visible:ring-3 ring-primary-alpha-30, aria-disabled:text-base-200). Align states with it.
- `src/components/ui/checkbox-card.tsx` (`CheckboxCardLink`, `CheckboxCardLinks`), radio-card.tsx, switch-card.tsx: card "Links" rows (12/20 semibold). If the Figma Links component is the same thing, those could compose the new Link.
- Icons: CSS mask pattern (`AlertIcon` in alert.tsx); `public/icons/` Material paths.
- Pattern: cva + cn from `@/lib/utils`, semantic tokens only, preview at `src/app/design-system/<slug>/page.tsx`.
