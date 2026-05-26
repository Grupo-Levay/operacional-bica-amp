"use client"

import type { ReactNode } from "react"
import { Toast } from "@base-ui/react/toast"
import { CheckCircle2, Info, TriangleAlert, X, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export const toastManager = Toast.createToastManager()

type ToastKind = "success" | "error" | "warning" | "info"

function show(type: ToastKind, title: string, description?: string) {
  return toastManager.add({ title, description, type })
}

export const toast = {
  success: (title: string, description?: string) => show("success", title, description),
  error: (title: string, description?: string) => show("error", title, description),
  warning: (title: string, description?: string) => show("warning", title, description),
  info: (title: string, description?: string) => show("info", title, description),
}

const iconByType: Record<string, ReactNode> = {
  success: <CheckCircle2 className="size-5 text-success" />,
  error: <XCircle className="size-5 text-danger" />,
  warning: <TriangleAlert className="size-5 text-warning" />,
  info: <Info className="size-5 text-primary" />,
}

const accentByType: Record<string, string> = {
  success: "border-l-success",
  error: "border-l-danger",
  warning: "border-l-warning",
  info: "border-l-primary",
}

function ToastList() {
  const { toasts } = Toast.useToastManager()

  return toasts.map((t) => {
    const kind = t.type ?? "info"
    return (
      <Toast.Root
        key={t.id}
        toast={t}
        className={cn(
          "flex w-full items-start gap-3 rounded-lg border border-l-2 border-border bg-ink4 p-3 shadow-lg ring-1 ring-foreground/10",
          "transition-all duration-200 ease-out",
          "data-[starting-style]:translate-y-3 data-[starting-style]:opacity-0",
          "data-[ending-style]:translate-y-1 data-[ending-style]:opacity-0",
          accentByType[kind]
        )}
      >
        <span className="mt-0.5 shrink-0">{iconByType[kind]}</span>
        <div className="min-w-0 flex-1">
          <Toast.Title className="text-sm font-medium leading-snug text-b1" />
          {t.description && (
            <Toast.Description className="mt-0.5 text-xs leading-snug text-b3" />
          )}
        </div>
        <Toast.Close
          aria-label="Fechar notificação"
          className="-mr-1 -mt-1 grid size-7 shrink-0 place-items-center rounded-md text-b4 transition-colors hover:bg-ink2 hover:text-b1"
        >
          <X className="size-4" />
        </Toast.Close>
      </Toast.Root>
    )
  })
}

export function Toaster() {
  return (
    <Toast.Provider toastManager={toastManager} limit={3}>
      <Toast.Portal>
        <Toast.Viewport className="fixed inset-x-0 bottom-[calc(64px+env(safe-area-inset-bottom)+0.75rem)] z-[200] mx-auto flex w-full max-w-sm flex-col gap-2 px-4 md:bottom-6 md:left-auto md:right-6 md:mx-0 md:px-0">
          <ToastList />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  )
}
