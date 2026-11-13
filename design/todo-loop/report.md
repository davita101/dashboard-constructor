# Report
Changed: catalog.tsx (`demoOnly?` on WidgetDef; set on candle-chart, metric-map), widget-picker-dialog.tsx (filter skips demoOnly), design/known-gaps.md (line appended).
Decision: picker was only catalog consumer besides getWidget; no design-system page lists catalog, so nothing else changed.
Commands: tsc PASS; lint PASS (0 errors, 1 pre-existing warning in ui/command.tsx); build PASS; grep demoOnly: true = 2 entries.
Undone: none.
