// Cache tags for project reads (./queries.ts). Phase 3 writes call revalidateTag/updateTag with these.

/** Everything one user sees in the Projects section (list, totals, finance, events, detail). */
export const userProjectsTag = (userId: string) => `user-projects:${userId}`

/** One project, across every member's cached reads. */
export const projectTag = (projectId: string) => `project:${projectId}`
