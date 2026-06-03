import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BentoItemProps {
  children: ReactNode
  className?: string
  /** Span multiple columns on desktop */
  colSpan?: 'col-span-1' | 'col-span-2'
  /** Span multiple rows on desktop */
  rowSpan?: 'row-span-1' | 'row-span-2'
}

function BentoItem({ children, className, colSpan = 'col-span-1', rowSpan = 'row-span-1' }: BentoItemProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-card border border-foreground/10 p-5 shadow-sm transition-all duration-200 ease-out',
        '[@media(hover:hover)]:hover:shadow-md [@media(hover:hover)]:hover:-translate-y-1',
        colSpan,
        rowSpan,
        className
      )}
    >
      {children}
    </div>
  )
}

interface BentoGridProps {
  children: ReactNode
  className?: string
}

function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        'grid gap-5',
        'grid-cols-1',
        'sm:grid-cols-2',
        'lg:grid-cols-4',
        className
      )}
    >
      {children}
    </div>
  )
}

export { BentoGrid, BentoItem }
