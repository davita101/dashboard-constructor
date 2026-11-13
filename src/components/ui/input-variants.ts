import { cva, type VariantProps } from "class-variance-authority"

// Figma Forms: Inputs (8928:37150), sets Input-Rounded (358:528) and Input-Pilled (10464:507752).
// Size × Shape set the box (height, radius, text, --input-px / --input-gap / --input-icon);
// the same scale drives InputGroup so both look identical.
const inputSizeVariants = cva("", {
  variants: {
    size: {
      "60": "h-15 rounded-r16 text-12 leading-20 [--input-gap:--spacing(2)] [--input-icon:--spacing(6)] [--input-px:--spacing(5)]",
      "48": "h-12 rounded-r12 text-12 leading-20 [--input-gap:--spacing(2)] [--input-icon:--spacing(6)] [--input-px:--spacing(5)]",
      "40": "h-10 rounded-r8 text-11 leading-20 [--input-gap:--spacing(2)] [--input-icon:--spacing(5)] [--input-px:--spacing(3)]",
      "32": "h-8 rounded-r8 text-10 leading-16 [--input-gap:--spacing(1.5)] [--input-icon:--spacing(4)] [--input-px:--spacing(3)]",
      "24": "h-6 rounded-r6 text-9 leading-16 [--input-gap:--spacing(1)] [--input-icon:--spacing(3)] [--input-px:--spacing(2)]",
    },
    shape: {
      rounded: "",
      pill: "rounded-r32",
    },
  },
  compoundVariants: [
    { shape: "pill", size: "60", className: "[--input-px:--spacing(8)]" },
    { shape: "pill", size: "48", className: "[--input-px:--spacing(6)]" },
    { shape: "pill", size: "40", className: "[--input-px:--spacing(5)]" },
    { shape: "pill", size: "32", className: "[--input-px:--spacing(4)]" },
    { shape: "pill", size: "24", className: "[--input-px:--spacing(3)]" },
  ],
  defaultVariants: {
    size: "40",
    shape: "rounded",
  },
})

// States, highest priority first: Disabled, Error (aria-invalid), Success (status), Active (focus),
// Filled (value shown instead of the placeholder), Default. Each state sets the color vars below;
// Active/Error/Success add Figma's 4px 20% ring inside the box and move the 1px stroke inside it.
// Filled relies on :placeholder-shown, so pass a placeholder.
const inputVariants = cva(
  "w-full min-w-0 bg-background-0 px-(--input-px) font-default font-semibold tracking-default text-(--input-fg) shadow-[inset_0_0_0_4px_var(--input-ring)] outline outline-(--input-stroke) -outline-offset-1 transition-[outline-color,box-shadow,color] [--input-fg:var(--base-900)] [--input-placeholder:var(--base-700)] [--input-ring:transparent] [--input-stroke:var(--base-100)] placeholder:text-(--input-placeholder) " +
    // Filled
    "not-placeholder-shown:not-focus-visible:not-disabled:not-aria-invalid:data-[status=default]:[--input-stroke:var(--base-150)] " +
    // Active
    "focus-visible:not-aria-invalid:data-[status=default]:-outline-offset-5 focus-visible:not-aria-invalid:data-[status=default]:[--input-ring:var(--base-alpha-20)] focus-visible:not-aria-invalid:data-[status=default]:[--input-stroke:var(--base-200)] " +
    // Error
    "aria-invalid:-outline-offset-5 aria-invalid:[--input-fg:var(--danger-600)] aria-invalid:[--input-placeholder:var(--danger-600)] aria-invalid:[--input-ring:var(--danger-alpha-20)] aria-invalid:[--input-stroke:var(--danger-500)] " +
    // Disabled
    "disabled:cursor-not-allowed disabled:bg-background-20 disabled:outline-offset-[-1px] disabled:shadow-none disabled:[--input-fg:var(--base-300)] disabled:[--input-placeholder:var(--base-300)] disabled:[--input-stroke:var(--base-100)]",
  {
    variants: {
      status: {
        default: "",
        // Pinned Active look (Figma State=Active) for previews; real focus gets it automatically
        active: "-outline-offset-5 [--input-ring:var(--base-alpha-20)] [--input-stroke:var(--base-200)]",
        success:
          "not-aria-invalid:-outline-offset-5 not-aria-invalid:[--input-fg:var(--success-600)] not-aria-invalid:[--input-placeholder:var(--success-600)] not-aria-invalid:[--input-ring:var(--success-alpha-20)] not-aria-invalid:[--input-stroke:var(--success-600)]",
      },
    },
    defaultVariants: {
      status: "default",
    },
  }
)

type InputSizeProps = VariantProps<typeof inputSizeVariants>
type InputSize = NonNullable<InputSizeProps["size"]>
type InputShape = NonNullable<InputSizeProps["shape"]>
type InputStatus = NonNullable<VariantProps<typeof inputVariants>["status"]>

export { inputSizeVariants, inputVariants, type InputShape, type InputSize, type InputSizeProps, type InputStatus }
