import "server-only"

import { cacheLife } from "next/cache"

import { getViewerId } from "@/lib/auth/viewer"
import {
  queryAllProjectSlugs,
  queryProjectDetail,
  queryProjectEvents,
  queryProjectFinance,
  queryProjectOptions,
  queryProjects,
  queryProjectTotals,
} from "@/lib/projects/queries"
import type { ProjectOption, ProjectDetail, ProjectEvent, ProjectFinance, ProjectTotals, Project } from "@/lib/projects/types"

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

/** Project / stage / member pickers for the create dialogs. */
export async function getProjectOptions(): Promise<ProjectOption[]> {
  return queryProjectOptions(await getViewerId())
}

/** All slugs, unscoped, for generateStaticParams only (no auth at build time). */
export async function getProjectSlugs(): Promise<string[]> {
  return queryAllProjectSlugs()
}

/** Blank project for the "Add New Project" editor (/dashboard/projects/new). */
/** "Now" for the blank project's default deadline, cached for an hour (cacheComponents rejects a bare new Date()). */
async function cachedNow() {
  "use cache"
  cacheLife("hours")
  return new Date().toISOString()
}

export async function getNewProjectDetail(): Promise<ProjectDetail> {
  const now = await cachedNow()
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
