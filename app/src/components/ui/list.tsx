import * as React from 'react'

import { cn } from '@/lib/utils'

function List({
  className,
  ...props
}: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="list"
      className={cn('space-y-2', className)}
      {...props}
    />
  )
}

function ListItem({
  className,
  interactive = false,
  ...props
}: React.ComponentProps<'li'> & {
  /** Adiciona hover lift + glow para itens clicáveis. */
  interactive?: boolean
}) {
  return (
    <li
      data-slot="list-item"
      className={cn(
        // v3: superfície elevada com gradiente sutil, transição suave
        'flex items-center gap-3 rounded-lg bg-gradient-surface-raised p-3 text-sm text-foreground transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ring-1 ring-foreground/10',
        interactive && '[@media(hover:hover)]:hover:-translate-y-0.5 [@media(hover:hover)]:hover:shadow-glow-brand-sm [@media(hover:hover)]:hover:ring-primary/30 cursor-pointer',
        className
      )}
      {...props}
    />
  )
}

export { List, ListItem }
