# Page additions

Details a builder added that Figma does not draw (error, loading, empty, focus states, etc.).
One line each: `- <page>: <what> (<why>)`. The user may veto any line.

- Sign In: inline field and global errors from Clerk, submit button disabled while Clerk is fetching (Figma draws only the idle state).
- Sign In: showcase carousel autoplays every 2.5s, paused on hover/focus-in and off when the user prefers reduced motion (Figma draws a static panel).

## Sign In carousel, pass 4 (slides 2-6)
- One-line subtitle under the title on slides 2-6 (Figma draws none): `text-white-alpha-80`, 16/24 at lg, 14/20 at 360.
- Each slide combines several existing components (placeholder copy): Tasks = ProgressCircle + AvatarGroup + TaskList; Notifications = Badge + Button + Notification; Calendar = Button + EventCalendar day heads + CalendarEvent; Files = FileUpload + Progress + FileUploadItem; Team = ProfileCard + AvatarGroup + Badge + Button.
- Extra rows shown only below lg (`lg:hidden`) to fill the taller 360 box.
- Sign Up: Apple button added (not in Figma)
- Check Your Email: copy says "code" not "link" (Clerk sends a reset code), "Resend" resends it and the footer switches to a polite status line saying a new code was sent, errors show above the button (Figma draws only the idle card).

## Dashboard (/dashboard/*, Figma "New Page" 1600 / 768 / 360, my-choosen)
- Dashboard: sidebar toggle (opens Sidebar-01 in a Sheet) shown below 1024 and at 360; Figma draws no way to open the sidebar there.
- Dashboard: sidebar user card signs out on click (Figma draws no sign-out); sign-in and sign-up now land on /dashboard.
- Dashboard: sections are /dashboard/<slug> placeholders (Figma content area is an empty frame); "Dashaord" typo in Figma is written "Dashboard".
