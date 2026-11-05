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
