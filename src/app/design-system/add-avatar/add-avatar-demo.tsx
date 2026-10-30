"use client"

import * as React from "react"

import {
  AddAvatar,
  AddAvatarActions,
  AddAvatarButton,
  AddAvatarContent,
  AddAvatarHeader,
  AddAvatarLabel,
  AddAvatarLabelIcon,
  AddAvatarPreview,
  AddAvatarRemove,
  type AddAvatarSize,
} from "@/components/ui/add-avatar"

/** Live Form-Avatar-Add: pick an image, change it, remove it. */
export function AddAvatarDemo({ size, initialSrc }: { size: AddAvatarSize; initialSrc?: string }) {
  const id = React.useId()
  const [src, setSrc] = React.useState(initialSrc)

  React.useEffect(() => {
    if (!src?.startsWith("blob:")) return
    return () => URL.revokeObjectURL(src)
  }, [src])

  return (
    <AddAvatar size={size} aria-labelledby={id}>
      <AddAvatarHeader>
        <AddAvatarLabel id={id}>
          Label
          <AddAvatarLabelIcon />
        </AddAvatarLabel>
      </AddAvatarHeader>
      <AddAvatarContent>
        <AddAvatarPreview src={src} alt="Selected avatar" />
        <AddAvatarActions>
          <AddAvatarButton onFileSelect={(file) => setSrc(URL.createObjectURL(file))}>
            {src ? "Change Image" : "Select Image"}
          </AddAvatarButton>
          {src ? <AddAvatarRemove onClick={() => setSrc(undefined)} /> : null}
        </AddAvatarActions>
      </AddAvatarContent>
    </AddAvatar>
  )
}
