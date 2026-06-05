'use client'

// Diálogo de confirmação sobre o AlertDialog do Base UI (semântica correta +
// focus-trap e scroll-lock nativos). API pública idêntica à versão anterior.
import * as React from 'react'
import { useState, useTransition } from 'react'
import { AlertDialog } from '@base-ui/react/alert-dialog'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'

interface ConfirmDialogProps {
  /** Elemento que abre o diálogo (vira o AlertDialog.Trigger via `render`). */
  trigger: React.ReactElement
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  /** Estiliza o botão de confirmação como ação destrutiva. */
  destructive?: boolean
  /** Ação ao confirmar. Erros viram toast e mantêm o diálogo aberto. */
  onConfirm: () => Promise<void> | void
  /** Toast de sucesso opcional após confirmar. */
  successMessage?: string
}

/**
 * Diálogo de confirmação reutilizável para ações sensíveis/destrutivas.
 * Mobile-first: sobe de baixo no mobile, centraliza no sm:.
 */
export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  destructive = false,
  onConfirm,
  successMessage,
}: ConfirmDialogProps) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  function handleConfirm() {
    startTransition(async () => {
      try {
        await onConfirm()
        if (successMessage) toast.success(successMessage)
        setOpen(false)
      } catch (e) {
        // Erro mantém o diálogo aberto para nova tentativa.
        toast.error(e instanceof Error ? e.message : 'Não foi possível concluir a ação')
      }
    })
  }

  return (
    <AlertDialog.Root
      open={open}
      onOpenChange={(next) => {
        // Bloqueia fechamento enquanto a ação está em andamento.
        if (pending) return
        setOpen(next)
      }}
    >
      {/* Base UI usa `render` (não cloneElement) para herdar o trigger. */}
      <AlertDialog.Trigger render={trigger} />

      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="fixed inset-0 z-[150] bg-ink/80 backdrop-blur-sm transition-opacity duration-200 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 motion-reduce:transition-none" />
        <AlertDialog.Popup
          data-slot="confirm-dialog"
          className="fixed inset-x-0 bottom-0 z-[151] w-full max-h-[90vh] space-y-4 overflow-y-auto rounded-t-2xl bg-gradient-surface-raised p-5 shadow-xl ring-1 ring-foreground/10 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:max-w-sm sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl origin-[var(--transform-origin)] transition-[opacity,transform,scale] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] data-[starting-style]:opacity-0 data-[starting-style]:scale-95 data-[ending-style]:opacity-0 data-[ending-style]:scale-95 motion-reduce:transition-none"
        >
          <div className="space-y-1.5">
            <AlertDialog.Title className="text-lg font-semibold text-foreground">
              {title}
            </AlertDialog.Title>
            {description && (
              <AlertDialog.Description className="text-sm leading-snug text-muted-foreground">
                {description}
              </AlertDialog.Description>
            )}
          </div>
          <div className="flex gap-2">
            <AlertDialog.Close
              render={
                <Button type="button" variant="outline" size="sm" className="min-h-[52px] flex-1">
                  {cancelLabel}
                </Button>
              }
              disabled={pending}
            />
            <Button
              type="button"
              variant={destructive ? 'destructive' : 'brand'}
              size="sm"
              disabled={pending}
              onClick={handleConfirm}
              className="min-h-[52px] flex-1"
            >
              {pending ? <Loader2 className="size-4 animate-spin" /> : confirmLabel}
            </Button>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}
