"use client"

import * as React from "react"

import type { DashboardCharts, Project, ProjectFinance, ProjectTotals } from "@/lib/projects/types"

// Real numbers for the dashboard widgets: the /dashboard page reads them on the server (user-scoped project
// queries) and provides them here. Outside the provider (the widget picker's previews) widgets keep their
// Figma placeholder values.

type WidgetData = { totals: ProjectTotals; finance: ProjectFinance; charts: DashboardCharts; projects: Project[] }

const WidgetDataContext = React.createContext<WidgetData | null>(null)

function WidgetDataProvider({ value, children }: { value: WidgetData; children: React.ReactNode }) {
  return <WidgetDataContext.Provider value={value}>{children}</WidgetDataContext.Provider>
}

const useWidgetData = () => React.useContext(WidgetDataContext)

export { useWidgetData, WidgetDataProvider, type WidgetData }
