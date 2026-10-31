# review sidebar attempt 1

audit ok, scope ok, build not run. Reject: icons blank.

1. Sidebar-01 (Default+Icons), all sets: 22 icons 404 -> blank slots. Figma shows them. Missing gap is not allowed (icons are not stroke/effect values). Create SVGs in `public/icons/` (Material, 24px, single-color fill, same style as existing `material-*.svg`): material-bolt, material-arrow-back, material-dashboard, material-apps, material-note, material-cloud, material-account-box, material-forum, material-school, material-brightness-2, material-page-info, material-help-outline, material-mode, material-photo-library, material-folder, material-sort, material-chrome-reader-mode, material-balance, material-file-open, material-remove-red-eye, material-alt-route, material-local-offer. Names must match the 404 urls (`/icons/material-<name>.svg`). Render via mask so token sets color.
2. Sidebar-01 Icons variant: Figma rail shows dashboard/apps/note/cloud/chat/mail/sort/users/calendar/info/account-box/forum/settings/language/brightness-2/school/page/help icons. Code shows only ~8. Fix by 1 + check each rail item exists.
3. Sidebar-01 Default header: Figma has bolt icon left of collapse icon. Code missing (404).
4. Sidebar-01 Default: Navigate/More/Links chevrons: Figma More/Links chevron points up (collapsed look), code points down. Match Figma.
5. Sidebar-01 Default: item labels look bolder than Figma (Figma medium weight, 12px). Check weight token vs figma.md.
6. Re-read sidebar-02..09 vs img/*.png after icons added; fix leftover diffs.
7. Remove known-gaps icon list; keep only Facebook/X glyph, shadow, base-alpha-5 lines. Per-item slot swaps line: ok only if parts composable.
8. Leftover `.codex/`, `design/handoff/message/`, `src/*/message*`: not sidebar; do not touch.
