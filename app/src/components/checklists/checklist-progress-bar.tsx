import { cn } from '@/lib/utils'

interface ChecklistProgressBarProps {
  total: number
  concluidos: number
  percent: number
  concluido: boolean
}

export function ChecklistProgressBar({ total, concluidos, percent, concluido }: ChecklistProgressBarProps) {
  const barColor = concluido || percent === 100
    ? 'bg-success'
    : percent >= 50
    ? 'bg-primary'
    : 'bg-warning'

  const labelColor = concluido || percent === 100
    ? 'text-success'
    : percent >= 50
    ? 'text-primary'
    : 'text-warning'

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs text-b3">
        <span>{concluidos} de {total} itens</span>
        <span className={cn('font-semibold tabular-nums transition-colors', labelColor)}>
          {percent}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-ink4 overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-300', barColor)}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
