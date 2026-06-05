'use client'

// Dialog mobile-first sobre Base UI. Sobe de baixo no mobile, centraliza no sm:.
import * as React from 'react'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { X } from 'lucide-react'

import { cn } from '@/lib/utils'

// Root: repassa estado controlado/uncontrolado.
function Dialog(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

// Trigger: aceita `render` para virar um Button (ex.: render={<Button />}).
function DialogTrigger(props: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogClose(props: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

// Portal opcional para casos avançados (DialogContent já inclui o seu).
function DialogPortal(props: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

// Backdrop reutilizável com o token padrão.
function DialogBackdrop({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Backdrop>) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-backdrop"
      className={cn(
        'fixed inset-0 z-[150] bg-ink/80 backdrop-blur-sm transition-opacity duration-200 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 motion-reduce:transition-none',
        className,
      )}
      {...props}
    />
  )
}

// Content: Portal + Backdrop + Popup. Bottom-sheet no mobile, centrado no desktop.
function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Popup>) {
  return (
    <DialogPrimitive.Portal>
      <DialogBackdrop />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          // mobile: bottom-sheet
          'fixed inset-x-0 bottom-0 z-[151] w-full max-h-[90vh] overflow-y-auto rounded-t-2xl p-4',
          'bg-gradient-surface-raised shadow-xl ring-1 ring-foreground/10',
          // desktop: centrado
          'sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-md sm:rounded-xl',
          // animação premium
          'origin-[var(--transform-origin)] transition-[opacity,transform,scale] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] data-[starting-style]:opacity-0 data-[starting-style]:scale-95 data-[ending-style]:opacity-0 data-[ending-style]:scale-95 motion-reduce:transition-none',
          className,
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  )
}

// Header com slot para o botão X (ghost) à direita.
function DialogHeader({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn('flex items-start justify-between gap-4 pb-2', className)}
      {...props}
    >
      <div className="flex flex-col gap-1.5">{children}</div>
      <DialogPrimitive.Close
        aria-label="Fechar"
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none"
      >
        <X className="size-4" />
      </DialogPrimitive.Close>
    </div>
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn('font-display text-xl text-primary', className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn('flex gap-2 pt-2', className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogPortal,
  DialogBackdrop,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
}
