"use client"

import * as React from "react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogModalActions,
  DialogModalBody,
  DialogModalClose,
  DialogModalDescription,
  DialogModalFooter,
  DialogModalHead,
  DialogModalHeading,
  DialogModalIcon,
  DialogModalTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldHeader, FieldLabel } from "@/components/ui/field"
import { FileUpload } from "@/components/ui/file-upload"
import { FileUploadList, FileUploadListLabel } from "@/components/ui/file-upload-card"
import {
  FileUploadItem,
  FileUploadItemActions,
  FileUploadItemBadge,
  FileUploadItemContent,
  FileUploadItemDescription,
  FileUploadItemMedia,
  FileUploadItemName,
  FileUploadItemRemove,
  FileUploadItemRetry,
  FileUploadItemStatusIcon,
} from "@/components/ui/file-upload-item"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { toast } from "@/components/ui/toast"
import { formatBytes, MAX_FILE_BYTES, PROJECT_FILES_BUCKET, projectFilePath } from "@/lib/files/paths"
import { deleteFileAction, registerFileAction } from "@/lib/projects/actions"
import { useSupabase } from "@/lib/supabase/client"

type Item = {
  key: string
  file: File
  projectId: string
  status: "progress" | "done" | "error"
  error?: string
  fileId?: string
}

/**
 * Quick Add "File": pick a project, drop files. Each file goes straight from the browser to Supabase Storage
 * (Clerk token, storage RLS = project member), then registerFileAction records it and logs the "file" event.
 * Built from Figma Add-Files-Card parts (File Upload + File-Item rows) inside the Modal dialog; no Figma frame
 * for this dialog (see design/known-gaps.md).
 */
function UploadFilesDialog({ trigger, projects }: { trigger: React.ReactElement; projects: { id: string; name: string }[] }) {
  const t = useTranslations("forms.files")
  const tf = useTranslations("forms")
  const supabase = useSupabase()
  const [open, setOpen] = React.useState(false)
  const [projectId, setProjectId] = React.useState(projects.length === 1 ? projects[0].id : "")
  const [items, setItems] = React.useState<Item[]>([])
  const selectId = React.useId()
  const uploadId = React.useId()

  const patch = (key: string, next: Partial<Item>) => setItems((list) => list.map((i) => (i.key === key ? { ...i, ...next } : i)))

  async function upload(item: Item) {
    patch(item.key, { status: "progress", error: undefined })
    if (item.file.size > MAX_FILE_BYTES) return patch(item.key, { status: "error", error: t("tooLarge") })

    const path = projectFilePath(item.projectId, item.file.name)
    const storage = supabase.storage.from(PROJECT_FILES_BUCKET)
    const { error } = await storage.upload(path, item.file, { contentType: item.file.type || undefined })
    if (error) return patch(item.key, { status: "error", error: t("failed") })

    const state = await registerFileAction({ projectId: item.projectId, path, name: item.file.name })
    if (state.status !== "ok") {
      await storage.remove([path])
      return patch(item.key, { status: "error", error: state.message ?? t("failed") })
    }
    patch(item.key, { status: "done", fileId: state.fileId })
  }

  function addFiles(files: File[]) {
    if (!projectId || !files.length) return
    const added = files.map((file) => ({ key: crypto.randomUUID(), file, projectId, status: "progress" as const }))
    setItems((list) => [...added, ...list])
    for (const item of added) void upload(item)
  }

  async function remove(item: Item) {
    if (item.fileId) {
      const state = await deleteFileAction({ fileId: item.fileId })
      if (state.status !== "ok") {
        toast.add({ title: state.message ?? t("failed"), timeout: 3000 })
        return
      }
    }
    setItems((list) => list.filter((i) => i.key !== item.key))
  }

  function onOpenChange(next: boolean) {
    setOpen(next)
    // Finished rows stay uploaded; a fresh open starts with an empty list.
    if (!next) setItems((list) => list.filter((i) => i.status === "progress"))
  }

  const uploading = items.some((i) => i.status === "progress")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger render={trigger} />
      <DialogContent variant="modal" layout="modal" size="md" className="max-h-[calc(100dvh-(--spacing(8)))] overflow-y-auto">
        <DialogModalHead>
          <DialogModalIcon src="/icons/material/material-cloud-done.svg" />
          <DialogModalHeading>
            <DialogModalTitle>{t("title")}</DialogModalTitle>
            <DialogModalDescription>{t("description")}</DialogModalDescription>
          </DialogModalHeading>
          <DialogModalClose aria-label={tf("close")} />
        </DialogModalHead>
        <DialogModalBody>
          <FieldGroup>
            {projects.length > 1 ? (
              <Field size="40">
                <FieldHeader>
                  <FieldLabel htmlFor={selectId}>{t("project")}</FieldLabel>
                </FieldHeader>
                <NativeSelect id={selectId} value={projectId} onChange={(e) => setProjectId(e.currentTarget.value)}>
                  <NativeSelectOption value="" disabled>
                    {t("projectPlaceholder")}
                  </NativeSelectOption>
                  {projects.map((project) => (
                    <NativeSelectOption key={project.id} value={project.id}>
                      {project.name}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </Field>
            ) : null}
            <FileUpload
              id={uploadId}
              aria-label={t("title")}
              multiple
              disabled={!projectId}
              title={t("dropTitle")}
              browseText={t("browse")}
              hint={projectId ? t("hint") : t("chooseProject")}
              onFilesChange={addFiles}
              // Same file twice in a row must fire change again.
              onClick={(e) => {
                e.currentTarget.value = ""
              }}
            />
            {items.length ? (
              <section className="flex flex-col gap-5" aria-live="polite">
                <FileUploadListLabel>{t("list")}</FileUploadListLabel>
                <FileUploadList>
                  {items.map((item) => (
                    <li key={item.key}>
                      <FileUploadItem status={item.status}>
                        <FileUploadItemMedia>
                          <FileUploadItemBadge />
                          <FileUploadItemContent>
                            <FileUploadItemName>
                              {item.fileId ? (
                                <a href={`/api/files/${item.fileId}`} className="hover:underline">
                                  {item.file.name}
                                </a>
                              ) : (
                                item.file.name
                              )}
                            </FileUploadItemName>
                            <FileUploadItemDescription>
                              {item.status === "progress" ? t("uploading") : item.status === "error" ? item.error : formatBytes(item.file.size)}
                            </FileUploadItemDescription>
                          </FileUploadItemContent>
                        </FileUploadItemMedia>
                        <FileUploadItemActions>
                          {item.status === "done" ? <FileUploadItemStatusIcon /> : null}
                          {item.status === "error" && item.file.size <= MAX_FILE_BYTES ? (
                            <FileUploadItemRetry aria-label={t("retry", { name: item.file.name })} onClick={() => void upload(item)} />
                          ) : null}
                          {item.status !== "progress" ? (
                            <FileUploadItemRemove
                              aria-label={t(item.fileId ? "remove" : "dismiss", { name: item.file.name })}
                              onClick={() => void remove(item)}
                            />
                          ) : null}
                        </FileUploadItemActions>
                      </FileUploadItem>
                    </li>
                  ))}
                </FileUploadList>
              </section>
            ) : null}
          </FieldGroup>
        </DialogModalBody>
        <DialogModalFooter>
          <DialogModalActions>
            <Button type="button" variant="dark" size="32" disabled={uploading} onClick={() => onOpenChange(false)}>
              {uploading ? t("uploading") : t("done")}
            </Button>
          </DialogModalActions>
        </DialogModalFooter>
      </DialogContent>
    </Dialog>
  )
}

export { UploadFilesDialog }
