import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type KPIAccent = 'primary' | 'success' | 'warning' | 'danger'

const accentStyles: Record<KPIAccent, { label: string; value: string; badge: string }> = {
  primary: {
    label: 'text-muted-foreground',
    value: 'text-primary',
    badge: 'bg-primary/15 text-primary border-primary/30',
  },
  success: {
    label: 'text-muted-foreground',
    value: 'text-success',
    badge: 'bg-success/15 text-success border-success/30',
  },
  warning: {
    label: 'text-muted-foreground',
    value: 'text-warning',
    badge: 'bg-warning/15 text-warning border-warning/30',
  },
  danger: {
    label: 'text-muted-foreground',
    value: 'text-danger',
    badge: 'bg-danger/15 text-danger border-danger/30',
  },
}

interface KPICardProps {
  /** Título da métrica */
  label: string
  /** Valor principal (ex: "42" ou "42/100") */
  value: string | number
  /** Subtítulo ou descrição */
  subtitle?: string
  /** Cor/acento */
  accent?: KPIAccent
  /** Ícone à esquerda do label */
  icon?: ReactNode
  /** Visual customizado (ProgressRing, AlertTriangle, etc) */
  visual?: ReactNode
  /** Progress bar (0-100) */
  progress?: number
  className?: string
}

export function KPICard({
  label,
  value,
  subtitle,
  accent = 'primary',
  icon,
  visual,
  progress,
  className,
}: KPICardProps) {
  const styles = accentStyles[accent]

  return (
    <div className={cn('flex flex-col h-full justify-between', className)}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-4">
        <div className="flex-1">
          <h3 className="text-label font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
            {icon && <span className={cn('[&_svg]:size-4', styles.badge)}>{icon}</span>}
            {label}
          </h3>
        </div>
        {visual && <div className="flex-shrink-0">{visual}</div>}
      </div>

      {/* Value */}
      <div className="space-y-2 flex-1 flex flex-col justify-center">
        <p className={cn('text-3xl font-extrabold leading-none tabular-nums tracking-tight', styles.value)}>
          {value}
        </p>
        {subtitle && <p className="text-caption text-muted-foreground">{subtitle}</p>}
      </div>

      {/* Progress bar (optional) */}
      {typeof progress === 'number' && (
        <div className="pt-4 mt-auto">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gradient-surface">
            <div
              className={cn('h-full rounded-full transition-all duration-500', {
                'bg-primary': accent === 'primary',
                'bg-success': accent === 'success',
                'bg-warning': accent === 'warning',
                'bg-danger': accent === 'danger',
              })}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
