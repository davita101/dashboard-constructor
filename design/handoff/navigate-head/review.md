# review attempt 2

Layout, sets, variants, tokens ok. Audit pass. One fix left:

1. Head-08 Desktop+Mobile: `View` Outline button shows default dot icon. Figma shows link icon. `public/icons/material-link.svg` exists, not gap. Fix: `<ButtonIcon src="/icons/material-link.svg" />` on View.
2. Head-07 Message button: Figma chat icon. `public/icons/material-chat-bubble.svg` exists. Use it if Figma icon is chat bubble (check img/head-07.png). Call = phone, gap ok.
3. Re-grep all Head-xx for dot default icon where asset exists in `public/icons/` (link, list, sidebar, chat-bubble, videocam, image, insert-drive-file, expand-more, chevron-left/right, share, more-horiz, search). Replace. Keep rest in known-gaps.
4. Known-gaps line: after fixes remove `edit`/`send` only if still missing (still missing).
Nothing else. Do not touch layout.
