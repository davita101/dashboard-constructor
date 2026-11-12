import "server-only"

import { getViewerId } from "@/lib/auth/viewer"
import {
  queryAllProjectSlugs,
  queryProjectDetail,
  queryProjectEvents,
  queryProjectFinance,
  queryProjects,
  queryProjectTotals,
} from "@/lib/projects/queries"
import type { ProjectDetail, ProjectEvent, ProjectFinance, ProjectTotals, Project } from "@/lib/projects/types"

// Projects section data for the signed-in user. Signatures match the old mock getters; the bodies read the
// database through cached, user-scoped queries (./queries.ts). They read auth(): call them inside Suspense.

export async function getProjects(): Promise<Project[]> {
  return queryProjects(await getViewerId())
}

export async function getProjectDetail(slug: string): Promise<ProjectDetail | undefined> {
  return queryProjectDetail(await getViewerId(), slug)
}

export async function getProjectEvents(): Promise<ProjectEvent[]> {
  return queryProjectEvents(await getViewerId())
}

export async function getProjectTotals(): Promise<ProjectTotals> {
  return queryProjectTotals(await getViewerId())
}

export async function getProjectFinance(): Promise<ProjectFinance> {
  return queryProjectFinance(await getViewerId())
}

/** All slugs, unscoped, for generateStaticParams only (no auth at build time). */
export async function getProjectSlugs(): Promise<string[]> {
  return queryAllProjectSlugs()
}

/** Blank project for the "Add New Project" editor (/dashboard/projects/new). */
export async function getNewProjectDetail(): Promise<ProjectDetail> {
  const now = new Date().toISOString()
  return {
    project: { id: "new", slug: "new", name: "", logo: "/icons/material-default-icon.svg", members: [], progress: 0, stages: 0, tasks: 0, income: 0, cost: 0, deadline: now, updatedAt: now },
    company: { name: "", logo: "/icons/material-default-icon.svg", description: "" },
    implementation: 0,
    counts: { messages: 0, stages: 0, members: 0, files: 0 },
    tasks: { new: 0, inWork: 0, done: 0, failed: 0 },
    stages: [],
    team: [],
  }
}
