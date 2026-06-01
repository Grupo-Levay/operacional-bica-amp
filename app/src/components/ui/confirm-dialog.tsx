'use client'

import * as React from 'react'
import { useState, useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'

interface ConfirmDialogProps {
  /** Elemento que abre o diálogo (recebe onClick automaticamente). */
  trigger: React.ReactElement<{ onClick?: () => void }>
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
 * Segue o padrão de modal mobile-first do projeto (overlay + painel bg-card).
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

  const triggerWithHandler = React.cloneElement(trigger, {
    onClick: () => setOpen(true),
  })

  function handleConfirm() {
    startTransition(async () => {
      try {
        await onConfirm()
        if (successMessage) toast.success(successMessage)
        setOpen(false)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Não foi possível concluir a ação')
      }
    })
  }

  return (
    <>
      {triggerWithHandler}

      {open && (
        <div className="fixed inset-0 z-[150] flex items-end justify-center sm:items-center">
          <button
            type="button"
            aria-label="Fechar"
            onClick={() => {
              if (!pending) setOpen(false)
            }}
            className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
          />
          <div
            role="alertdialog"
            aria-modal="true"
            aria-label={title}
            className="relative w-full space-y-4 rounded-t-2xl bg-card p-5 ring-1 ring-foreground/10 sm:max-w-sm sm:rounded-xl"
          >
            <div className="space-y-1.5">
              <h2 className="text-lg font-semibold text-foreground">{title}</h2>
              {description && (
                <p className="text-sm leading-snug text-muted-foreground">{description}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={pending}
                onClick={() => setOpen(false)}
                className="min-h-[52px] flex-1"
              >
                {cancelLabel}
              </Button>
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
          </div>
        </div>
      )}
    </>
  )
}
