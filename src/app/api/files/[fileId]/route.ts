import { and, eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { z } from "zod"

import { db } from "@/db"
import { files, projectMembers } from "@/db/schema"
import { getViewerId } from "@/lib/auth/viewer"
import { signedDownloadUrl } from "@/lib/files/storage"

/** GET /api/files/<id>: members get a 60-second signed Storage URL (download, original name); others 404. */
export async function GET(_: Request, { params }: { params: Promise<{ fileId: string }> }) {
  const { fileId } = await params
  if (!z.uuid().safeParse(fileId).success) return new NextResponse(null, { status: 404 })

  const userId = await getViewerId()
  const [file] = await db
    .select({ key: files.storagePath, name: files.name })
    .from(files)
    .innerJoin(projectMembers, and(eq(projectMembers.projectId, files.projectId), eq(projectMembers.userId, userId)))
    .where(eq(files.id, fileId))
    .limit(1)
  if (!file) return new NextResponse(null, { status: 404 })

  try {
    return NextResponse.redirect(await signedDownloadUrl(file.key, file.name), { headers: { "Cache-Control": "private, no-store" } })
  } catch (error) {
    console.error("[files] download", error)
    return new NextResponse(null, { status: 502 })
  }
}
