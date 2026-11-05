# Style decisions

When Figma shows more than one style for the same thing, one is chosen here and used everywhere.
The builder reads this file first; the user reviews pages against it.
Format: `- <topic>: <choice> (<why>, <date>)`.

- Responsive source of truth: the "Main (360)" frame is the mobile layout of every auth page (same panels as the 1600 frame, stacked). The other 360 frames ("Sing In (360)" with Navigate-01 + Sign-In-02 + Footer, etc.) are app-shell variants and are NOT used for auth pages (2026-11-05).
- Auth form template: Sign-In-01 / Sign-Up-01 (open form on the white panel) at every width; one form component, never rendered twice. Sign-In-02 / Sign-Up-02 are not used on auth pages (2026-11-05).
- Breakpoint: Figma draws only 1600 and 360. Two columns from `lg` (1024px), stacked below. Between 360 and 1024 the stack keeps the 360 spacing and the panels are centered with a max width of 640px (not drawn in Figma, our choice, 2026-11-05).
- Page background: `bg-background-20` (#fafafa), panels `bg-background-0` radius `rounded-r20` (Figma frames, 2026-11-05).
- Page spacing: 24px padding and 24px between panels at 1600; 20px padding and 16px between panels at 360 (Figma, 2026-11-05).
- Inputs: pill (`AuthField`, size 40), buttons size 40 full width (2026-11-05).
- Photo panels: photo plus a 20% black layer in CSS; the photo is exported from Figma without the cards (2026-11-05).
- Photo panel at 360: fixed 852px tall, content inset 20px, "New Features" 18/28, tiles 280x164 stacked one per row 12px apart, dots 28px from the bottom (Figma Main (360), 2026-11-05).
