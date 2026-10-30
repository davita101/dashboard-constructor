import * as React from "react"

import { Field, FieldHeader, FieldLabel, FieldLabelIcon } from "@/components/ui/field"
import { FileUpload } from "@/components/ui/file-upload"
import {
  FileUploadCard,
  FileUploadCardClose,
  FileUploadCardContent,
  FileUploadCardHeader,
  FileUploadCardTitle,
  FileUploadList,
  FileUploadListLabel,
} from "@/components/ui/file-upload-card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupIcon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { SeparatorGroup, SeparatorLabel } from "@/components/ui/separator"

type AddFilesCardProps = Omit<React.ComponentProps<typeof FileUploadCard>, "children"> & {
  /** Prefix for the control ids. */
  idPrefix?: string
  title?: React.ReactNode
  label?: React.ReactNode
  /** File rows (FileUploadItem in an li). When given, the card shows Figma State=Uploading. */
  files?: React.ReactNode
  onClose?: () => void
}

/** Figma Add-Files-Card (11956:18823): State=Default without `files`, State=Uploading with them. */
function AddFilesCard({
  idPrefix = "add-files",
  title = "Upload Files",
  label = "Add the file below",
  files,
  onClose,
  ...props
}: AddFilesCardProps) {
  const uploadId = `${idPrefix}-upload`
  const urlId = `${idPrefix}-url`
  const listId = `${idPrefix}-list`

  return (
    <FileUploadCard data-state={files ? "uploading" : "default"} {...props}>
      <FileUploadCardHeader>
        <FileUploadCardTitle>{title}</FileUploadCardTitle>
        <FileUploadCardClose onClick={onClose} />
      </FileUploadCardHeader>
      <FileUploadCardContent>
        <Field size="48" className="[--field-px:0px]">
          <FieldHeader>
            <FieldLabel htmlFor={uploadId}>
              {label}
              <FieldLabelIcon />
            </FieldLabel>
          </FieldHeader>
          <FileUpload id={uploadId} multiple />
        </Field>
        <SeparatorGroup>
          <SeparatorLabel>Or</SeparatorLabel>
        </SeparatorGroup>
        <InputGroup size="40" shape="pill">
          <InputGroupAddon>
            <InputGroupIcon src="/icons/material-link.svg" />
          </InputGroupAddon>
          <InputGroupInput id={urlId} type="url" placeholder="Add form URL" aria-label="File URL" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton shape="pill">Add File</InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        {files ? (
          <section aria-labelledby={listId} className="flex flex-col gap-5">
            <FileUploadListLabel id={listId}>Uploading Files</FileUploadListLabel>
            <FileUploadList>{files}</FileUploadList>
          </section>
        ) : null}
      </FileUploadCardContent>
    </FileUploadCard>
  )
}

export { AddFilesCard, type AddFilesCardProps }
