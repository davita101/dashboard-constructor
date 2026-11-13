// Supabase Storage layout (buckets + policies: src/db/migrations/0001_storage_buckets.sql). Client-safe.
//
// project-files (private): <projectId>/<uuid>/<name>. The browser uploads with the Clerk token (RLS: project member),
// then registerFileAction records it in `files`. Downloads go through /api/files/<id> (short signed URL).
// logos (public read): projects/<projectId>/<uuid>.<ext>, clients/<clientId>/<uuid>.<ext>. Uploaded by the server.

export const PROJECT_FILES_BUCKET = "project-files"
export const LOGOS_BUCKET = "logos"

/** Bucket limits (keep in sync with the migration). */
export const MAX_FILE_BYTES = 50 * 1024 * 1024
export const MAX_LOGO_BYTES = 2 * 1024 * 1024
export const LOGO_TYPES = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/gif": "gif" } as const

const uuid = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"
const projectFilePattern = new RegExp(`^(${uuid})/${uuid}/[^/]+$`)

/** Storage keys allow a limited character set: keep letters, digits, dot, dash, underscore. */
export function safeFileName(name: string) {
  const dot = name.lastIndexOf(".")
  const base = dot > 0 ? name.slice(0, dot) : name
  const ext = dot > 0 ? name.slice(dot + 1) : ""
  const clean = (s: string) =>
    s
      .normalize("NFKD")
      .replace(/[^\w.-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^[-.]+|[-.]+$/g, "")
  const b = clean(base).slice(0, 80) || "file"
  const e = clean(ext).slice(0, 10)
  return e ? `${b}.${e}` : b
}

/** New object key for a project file. */
export function projectFilePath(projectId: string, name: string) {
  return `${projectId}/${crypto.randomUUID()}/${safeFileName(name)}`
}

/** Project id of a well-formed project file key, else null. */
export function projectIdOfPath(path: string) {
  return projectFilePattern.exec(path)?.[1] ?? null
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}
