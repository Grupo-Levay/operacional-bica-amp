import { cn } from '@/lib/utils'
import { clampPct, ringGeometry } from '@/lib/viz'

type RingAccent = 'primary' | 'success' | 'warning' | 'danger'

const ringColor: Record<RingAccent, string> = {
  primary: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
}

interface ProgressRingProps {
  /** Percentual 0–100. */
  value: number
  size?: number
  strokeWidth?: number
  accent?: RingAccent
  /** Rótulo central; padrão é `{value}%`. */
  label?: string
  className?: string
}

/** Anel de progresso circular em SVG puro — zero dependência. */
export function ProgressRing({
  value,
  size = 52,
  strokeWidth = 5,
  accent = 'primary',
  label,
  className,
}: ProgressRingProps) {
  const pct = clampPct(value)
  const { radius, circumference, dashoffset } = ringGeometry(pct, size, strokeWidth)

  // Glow effect quando progresso > 70% (animação suave)
  const shouldGlow = pct > 70
  const glowClass = shouldGlow ? 'shadow-glow-brand pulse-glow-primary' : ''

  return (
    <div
      className={cn('relative flex items-center justify-center rounded-full transition-shadow', glowClass, className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={label ?? `${pct}%`}
    >
      <svg className="-rotate-90" width={size} height={size} aria-hidden="true">
        <circle
          className="text-ink4"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={cn('transition-all duration-500 ease-in-out', ringColor[accent])}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <span className="absolute text-[10px] font-extrabold leading-none text-foreground tabular-nums">
        {label ?? `${pct}%`}
      </span>
    </div>
  )
}
