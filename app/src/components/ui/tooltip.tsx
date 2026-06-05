'use client'

// Tooltip sobre o Base UI. Use TooltipProvider uma vez na árvore (delay compartilhado).
import * as React from 'react'
import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip'

import { cn } from '@/lib/utils'

// Provider — atraso padrão de 200ms para abrir.
function TooltipProvider({
  delay = 200,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return <TooltipPrimitive.Provider delay={delay} {...props} />
}

// Root — repassa open/onOpenChange/defaultOpen.
function Tooltip(props: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root {...props} />
}

function TooltipTrigger(props: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

// Content — Portal + Positioner + Popup compacto.
function TooltipContent({
  className,
  children,
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Popup> & {
  sideOffset?: number
}) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner sideOffset={sideOffset} className="z-[150]">
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            'text-xs px-2 py-1 rounded-md bg-popover text-foreground ring-1 ring-foreground/10 shadow-md origin-[var(--transform-origin)] transition-[opacity,transform] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] data-[starting-style]:opacity-0 data-[starting-style]:scale-95 data-[ending-style]:opacity-0 data-[ending-style]:scale-95 motion-reduce:transition-none',
            className,
          )}
          {...props}
        >
          <TooltipPrimitive.Arrow className="data-[side=bottom]:top-[-4px]" />
          {children}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}

export { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent }
