import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
        // Commerce Constructor 7.7 buttons (Figma Dark-Button / Ghost-Button / Outline-Button)
        dark: "border-base-775 bg-linear-to-b from-base-800 to-base-900 text-base-0 shadow-[0_1px_2px_0_var(--shadow-base)] hover:from-base-700 hover:to-base-800",
        "base-ghost": "text-base-700 hover:bg-base-alpha-5",
        "base-outline":
          "border-base-70 bg-linear-to-b from-base-0 to-base-20 text-base-800 shadow-[0_1px_2px_0_var(--shadow-base)] hover:to-base-70",
        // Figma Primary/Success/Warning/Danger-Button and their -Soft variants
        primary:
          "border-primary-450 bg-linear-to-b from-primary-500 to-primary-550 text-primary-50 shadow-[0_1px_2px_0_var(--shadow-primary)] hover:to-primary-650",
        "primary-soft":
          "border-primary-alpha-5 bg-linear-to-b from-primary-alpha-5 to-primary-alpha-15 text-primary-600 hover:to-primary-alpha-25",
        success:
          "border-success-450 bg-linear-to-b from-success-500 to-success-550 text-success-25 shadow-[0_1px_2px_0_var(--shadow-success)] hover:to-success-650",
        "success-soft":
          "border-success-alpha-10 bg-linear-to-b from-success-alpha-5 to-success-alpha-10 text-success-650 hover:to-success-alpha-20",
        warning:
          "border-warning-400 bg-linear-to-b from-warning-500 to-warning-550 text-warning-25 shadow-[0_1px_2px_0_var(--shadow-warning)] hover:to-warning-650",
        "warning-soft":
          "border-warning-alpha-10 bg-linear-to-b from-warning-alpha-5 to-warning-alpha-10 text-warning-600 hover:to-warning-alpha-20",
        danger:
          "border-danger-400 bg-linear-to-b from-danger-500 to-danger-550 text-danger-25 shadow-[0_1px_2px_0_var(--shadow-danger)] hover:to-danger-650",
        "danger-soft":
          "border-danger-alpha-10 bg-linear-to-b from-danger-alpha-5 to-danger-alpha-10 text-danger-600 hover:to-danger-alpha-20",
        // Figma White-Button / White-Soft-Button / Black-Soft-Button (on colored surfaces)
        white: "border-background-0 bg-white-alpha-90 text-black-alpha-80 hover:bg-background-0",
        "white-soft":
          "border-white-alpha-15 bg-white-alpha-20 text-background-0 backdrop-blur-[15px] hover:bg-white-alpha-30",
        "black-soft":
          "border-black-alpha-5 bg-black-alpha-20 text-background-0 backdrop-blur-[15px] hover:bg-black-alpha-30",
        // Icon-only control that keeps its parent's color (e.g. alert close)
        bare: "border-0 bg-transparent text-current hover:opacity-70",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
        // Figma 16px icon (material-close)
        "icon-micro": "size-4 rounded-r4 p-0",
        // Figma 24px pill: 8px + 4px text padding, Bold 700/10
        micro:
          "h-6 gap-1 rounded-r32 px-3 font-default text-10 leading-16 font-bold tracking-default",
        // Figma 20px pill (Alert-Default): 4px + 4px text padding, Bold 700/10
        nano: "h-5 gap-1 rounded-r32 px-2 font-default text-10 leading-16 font-bold tracking-default",
        // Figma 28px pill (Alert-Buttons): 8px + 4px text padding, Bold 700/11
        pill: "h-7 gap-1 rounded-r32 px-3 font-default text-11 leading-20 font-bold tracking-default",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
