import "server-only"

import { createServerSupabase } from "@/lib/supabase/server"
import { LOGO_TYPES, LOGOS_BUCKET, PROJECT_FILES_BUCKET } from "@/lib/files/paths"

// Storage calls made by the server as the signed-in user (Clerk token): the storage.objects policies decide.
// Call them while the user is still a member, i.e. inside the write transaction before it commits.

const logosPrefix = () => `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${LOGOS_BUCKET}/`

/** Object key of a URL in our logos bucket, null for anything else (mock /icons/… paths, other hosts). */
export function logoKeyOf(url: string | null | undefined) {
  return url?.startsWith(logosPrefix()) ? url.slice(logosPrefix().length) : null
}

/** Uploads a validated image to logos/<folder>/<id>/<uuid>.<ext> and returns its public URL. */
export async function uploadLogo(folder: "projects" | "clients", id: string, file: File) {
  const ext = LOGO_TYPES[file.type as keyof typeof LOGO_TYPES]
  const key = `${folder}/${id}/${crypto.randomUUID()}.${ext}`
  const storage = createServerSupabase().storage.from(LOGOS_BUCKET)
  const { error } = await storage.upload(key, file, { contentType: file.type, cacheControl: "31536000" })
  if (error) throw new Error(`Logo upload failed: ${error.message}`)
  return storage.getPublicUrl(key).data.publicUrl
}

/** Removes objects; logs instead of throwing when `bestEffort` (cleanup after the rows are gone). */
export async function removeObjects(bucket: typeof LOGOS_BUCKET | typeof PROJECT_FILES_BUCKET, keys: string[], bestEffort = false) {
  if (!keys.length) return
  const { error } = await createServerSupabase().storage.from(bucket).remove(keys)
  if (!error) return
  if (bestEffort) console.error(`[storage] could not remove ${keys.length} object(s) from ${bucket}:`, error.message)
  else throw new Error(`Storage remove failed: ${error.message}`)
}

/** Short-lived download link for a project file (RLS: the user must be a member). */
export async function signedDownloadUrl(key: string, name: string) {
  const { data, error } = await createServerSupabase().storage.from(PROJECT_FILES_BUCKET).createSignedUrl(key, 60, { download: name })
  if (error) throw new Error(`Signed URL failed: ${error.message}`)
  return data.signedUrl
}
