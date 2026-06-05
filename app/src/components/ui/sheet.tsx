'use client'

// Sheet sobre o Drawer nativo do Base UI (swipe-to-dismiss incluído).
import * as React from 'react'
import { Drawer } from '@base-ui/react/drawer'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

function Sheet(props: React.ComponentProps<typeof Drawer.Root>) {
  return <Drawer.Root data-slot="sheet" {...props} />
}

function SheetTrigger(props: React.ComponentProps<typeof Drawer.Trigger>) {
  return <Drawer.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose(props: React.ComponentProps<typeof Drawer.Close>) {
  return <Drawer.Close data-slot="sheet-close" {...props} />
}

const sheetVariants = cva(
  cn(
    'fixed z-[151] flex flex-col overflow-y-auto bg-gradient-surface-raised shadow-xl ring-1 ring-foreground/10',
    'transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none',
  ),
  {
    variants: {
      side: {
        bottom:
          'inset-x-0 bottom-0 max-h-[92vh] rounded-t-2xl p-4 data-[starting-style]:translate-y-full data-[ending-style]:translate-y-full',
        right:
          'inset-y-0 right-0 h-full w-full p-4 sm:max-w-md data-[starting-style]:translate-x-full data-[ending-style]:translate-x-full',
      },
    },
    defaultVariants: { side: 'bottom' },
  },
)

interface SheetContentProps
  extends React.ComponentProps<typeof Drawer.Popup>,
    VariantProps<typeof sheetVariants> {}

// Content: Portal + Backdrop + Popup. Grabber no topo quando side=bottom.
function SheetContent({ className, children, side = 'bottom', ...props }: SheetContentProps) {
  return (
    <Drawer.Portal>
      <Drawer.Backdrop
        className="fixed inset-0 z-[150] bg-ink/80 backdrop-blur-sm transition-opacity duration-200 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 motion-reduce:transition-none"
      />
      <Drawer.Popup
        data-slot="sheet-content"
        className={cn(sheetVariants({ side }), className)}
        {...props}
      >
        {side === 'bottom' && (
          // Grabber visual; o arraste é tratado pelo Drawer.
          <div className="mx-auto mb-3 h-1.5 w-12 shrink-0 rounded-full bg-foreground/20" aria-hidden />
        )}
        {children}
      </Drawer.Popup>
    </Drawer.Portal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-header"
      className={cn('flex flex-col gap-1.5 pb-2', className)}
      {...props}
    />
  )
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof Drawer.Title>) {
  return (
    <Drawer.Title
      data-slot="sheet-title"
      className={cn('font-display text-xl text-primary', className)}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof Drawer.Description>) {
  return (
    <Drawer.Description
      data-slot="sheet-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn('flex gap-2 pt-2', className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
}
