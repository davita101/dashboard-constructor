# review attempt 1 — REJECTED

1. Date-Picker-Range-Card, Type=Year + Type=Month: Footer missing on /design-system/date-picker. Figma: Footer 196x44 (Year) / 220x44 (Month), pad 0 22 12 12 (Year), 0 46 12 12 (Month), row gap 8. Contains Dark-Button "Confirm" (80x32, r32, fill base-800→base-900) + Ghost-Button "Cancel" (74x32, base-700). Reuse `DatePickerConfirm`/`DatePickerCancel` (already used in double card). Card heights: Year 276, Month 272.
2. Range card Year/Month: active tile digits on black tiles show yellow/orange/pink digits (ex 7-10, 12-15 range). Figma Active/Active First/Active Last digits = white (`background-0`). Fix text color on active tiles so day-colour accents only hit non-active tiles.
3. Same colored digit on Double-Date-Picker + Mobile cards active tiles (ex 3, 10, 15, 19). Same fix, check against img/double-date-picker-card.png: all active digits white.
4. Recheck after fix: `pnpm -s audit:component`, `pnpm -s shot date-picker`, compare range-card png.
