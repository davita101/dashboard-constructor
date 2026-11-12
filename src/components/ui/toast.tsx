"use client"

import * as React from "react"
import { Toast as ToastPrimitive } from "@base-ui/react/toast"

import { Alert, AlertClose, AlertIcon, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

// shadcn `toast` (Base UI) with the Figma toast look: the Alert-Default black pill (layout="toast").
const toast = ToastPrimitive.createToastManager()

function ToastViewport({ className, ...props }: ToastPrimitive.Viewport.Props) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      className={cn(
        "pointer-events-none fixed inset-x-4 bottom-6 z-50 flex flex-col items-center gap-2 outline-none",
        className
      )}
      {...props}
    />
  )
}

function Toast({ className, ...props }: ToastPrimitive.Root.Props) {
  return (
    <ToastPrimitive.Root
      data-slot="toast"
      render={<Alert layout="toast" variant="black" />}
      className={cn(
        "pointer-events-auto pr-1 shadow-[0_16px_32px_0_var(--shadow-base)] transition-[translate,opacity] duration-300 ease-out data-ending-style:translate-y-4 data-ending-style:opacity-0 data-limited:hidden data-starting-style:translate-y-4 data-starting-style:opacity-0",
        className
      )}
      {...props}
    />
  )
}

function ToastTitle(props: ToastPrimitive.Title.Props) {
  return <ToastPrimitive.Title data-slot="toast-title" render={<AlertTitle />} {...props} />
}

function ToastClose(props: ToastPrimitive.Close.Props) {
  return <ToastPrimitive.Close data-slot="toast-close" render={<AlertClose />} {...props} />
}

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager()
  return toasts.map((item) => (
    <Toast key={item.id} toast={item}>
      <AlertIcon className="size-4" />
      <ToastTitle />
      <ToastClose />
    </Toast>
  ))
}

function Toaster({ children, toastManager = toast, ...props }: ToastPrimitive.Provider.Props) {
  return (
    <ToastPrimitive.Provider toastManager={toastManager} {...props}>
      {children}
      <ToastPrimitive.Portal>
        <ToastViewport>
          <ToastList />
        </ToastViewport>
      </ToastPrimitive.Portal>
    </ToastPrimitive.Provider>
  )
}

export { Toaster, Toast, ToastClose, ToastTitle, ToastViewport, toast }
