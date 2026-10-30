# File Input graph context
Reuse in src/components/ui:
- input.tsx: Input, inputVariants, inputSizeVariants, InputShape/InputSize — base field styling
- input-group.tsx (19K): addon/slots pattern for leading/trailing parts
- field.tsx, label.tsx: label/description/error wrapper
- button.tsx: trigger "Choose file" button
- textarea.tsx: shares inputVariants (extend same cva)
- avatar.tsx, badge.tsx, progress.tsx, loader.tsx/spinner.tsx: file preview / upload state candidates
- separator.tsx
Icons in public/icons: material-attachment.svg, material-insert-drive-file.svg, material-close.svg, material-add.svg, material-check.svg (use CSS mask per CLAUDE.md)
Design-system pages exist: input, input-custom, input-group, text-area, double-input. New page: src/app/design-system/file-input/page.tsx
No file-input primitive exists.
