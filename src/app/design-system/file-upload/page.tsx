import { Field, FieldHeader, FieldLabel, FieldLabelIcon } from "@/components/ui/field"
import { FileUpload, type FileUploadStatus } from "@/components/ui/file-upload"
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
  type FileUploadItemStatus,
} from "@/components/ui/file-upload-item"
import { Progress, ProgressValue } from "@/components/ui/progress"
import { ProgressCircle } from "@/components/ui/progress-circle"
import { AddFilesCard } from "@/components/upload/AddFilesCard"

// Mirrors the Figma Forms: File Upload page (9402:22988): Form-Upload-Files (9411:3320),
// Form-Upload-Files-Images (11954:8561), File-Item-Component (9413:3004) and Add-Files-Card
// (11956:18823). Hover / Drag / Focused are pinned with `status`; pointer, dragging files and
// keyboard focus apply them live.

const states = ["default", "hover", "drag", "focused", "error", "disabled"] as const
type State = (typeof states)[number]

const kinds = [
  { title: "Form-Upload-Files", kind: "files" },
  { title: "Form-Upload-Files-Images", kind: "images" },
] as const

const itemTypes = ["upload", "progress", "error", "done"] as const satisfies FileUploadItemStatus[]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-default text-14 leading-24 font-bold text-base-800">{title}</h2>
      {children}
    </section>
  )
}

/** Showcase backdrop, like the Figma set frame. Not part of the component. */
function Surface({ children }: { children: React.ReactNode }) {
  return <div className="overflow-x-auto rounded-r40 bg-background-0 p-10">{children}</div>
}

function StateUpload({ kind, state }: { kind: "files" | "images"; state: State }) {
  const id = `file-upload-${kind}-${state}`
  const pinned: FileUploadStatus = state === "hover" || state === "drag" || state === "focused" ? state : "default"
  return (
    <div className="flex w-70 shrink-0 flex-col gap-2">
      <span className="font-default text-10 leading-16 font-semibold text-base-400">{state}</span>
      <Field size="48" className="[--field-px:0px]" data-disabled={state === "disabled" || undefined}>
        <FieldHeader>
          <FieldLabel htmlFor={id}>
            Label
            <FieldLabelIcon />
          </FieldLabel>
        </FieldHeader>
        <FileUpload
          id={id}
          kind={kind}
          status={pinned}
          accept={kind === "images" ? "image/png,image/jpeg,image/gif" : undefined}
          aria-invalid={state === "error" || undefined}
          disabled={state === "disabled"}
        />
      </Field>
    </div>
  )
}

function DemoItem({ type, name = "File Name" }: { type: FileUploadItemStatus; name?: string }) {
  return (
    <FileUploadItem status={type}>
      <FileUploadItemMedia>
        <FileUploadItemBadge />
        <FileUploadItemContent>
          <FileUploadItemName>{name}</FileUploadItemName>
          {type === "progress" ? (
            <Progress value={64} size="small" aria-label={`${name} upload`}>
              <ProgressValue size="default" />
            </Progress>
          ) : (
            <FileUploadItemDescription>
              {type === "error" ? "File Too Large. Try another one." : "5.6mb of 24mb"}
            </FileUploadItemDescription>
          )}
        </FileUploadItemContent>
      </FileUploadItemMedia>
      <FileUploadItemActions>
        {type === "upload" && <ProgressCircle value={75} size="24" aria-label={`${name} upload`} />}
        {type === "error" && <FileUploadItemRetry />}
        {type === "done" && <FileUploadItemStatusIcon />}
        <FileUploadItemRemove />
      </FileUploadItemActions>
    </FileUploadItem>
  )
}

export default function FileUploadPreviewPage() {
  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      {kinds.map((set) => (
        <Section key={set.kind} title={`${set.title} (default, hover, drag, focused, error, disabled)`}>
          <Surface>
            <div className="flex items-start gap-20">
              {states.map((state) => (
                <StateUpload key={state} kind={set.kind} state={state} />
              ))}
            </div>
          </Surface>
        </Section>
      ))}

      <Section title="File-Item-Component (upload, progress, error, done)">
        <Surface>
          <div className="flex items-center gap-20">
            {itemTypes.map((type) => (
              <div key={type} className="w-70 shrink-0">
                <DemoItem type={type} />
              </div>
            ))}
          </div>
        </Surface>
      </Section>

      <Section title="Add-Files-Card (default, uploading)">
        <Surface>
          <div className="flex items-start gap-20">
            <AddFilesCard idPrefix="add-files-default" />
            <AddFilesCard
              idPrefix="add-files-uploading"
              files={itemTypes.map((type) => (
                <li key={type}>
                  <DemoItem type={type} name={type === "upload" ? "Image.png" : "File Name"} />
                </li>
              ))}
            />
          </div>
        </Surface>
      </Section>
    </main>
  )
}
