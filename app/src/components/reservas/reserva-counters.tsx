import { cn } from '@/lib/utils'

interface ReservaCountersProps {
  pendente: number
  confirmada: number
  presente: number
  concluida: number
  cancelada: number
  naoCompareceu: number
}

interface CounterItem {
  label: string
  count: number
  accent: 'primary' | 'success' | 'warning' | 'danger'
  /** Quando true, só aparece se count > 0 (estados secundários). */
  condicional?: boolean
}

const accentColors: Record<string, string> = {
  primary: 'bg-primary/12 border-primary/25 text-primary',
  success: 'bg-success/12 border-success/25 text-success',
  warning: 'bg-warning/12 border-warning/25 text-warning',
  danger: 'bg-danger/12 border-danger/25 text-danger',
}

export function ReservaCounters({
  pendente,
  confirmada,
  presente,
  concluida,
  cancelada,
  naoCompareceu,
}: ReservaCountersProps) {
  const items: CounterItem[] = [
    { label: 'Pendentes', count: pendente, accent: 'warning' },
    { label: 'Confirmadas', count: confirmada, accent: 'primary' },
    { label: 'Na casa', count: presente, accent: 'success', condicional: true },
    { label: 'Concluídas', count: concluida, accent: 'primary', condicional: true },
    { label: 'Não veio', count: naoCompareceu, accent: 'danger', condicional: true },
    { label: 'Canceladas', count: cancelada, accent: 'danger' },
  ]

  const visiveis = items.filter((i) => !i.condicional || i.count > 0)

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
      {visiveis.map(({ label, count, accent }) => (
        <div
          key={label}
          className={cn(
            'shrink-0 flex flex-col gap-1 px-4 py-3 rounded-lg border transition-all duration-200',
            '[@media(hover:hover)]:hover:shadow-sm [@media(hover:hover)]:hover:-translate-y-0.5',
            accentColors[accent]
          )}
        >
          <span className="text-2xl font-extrabold leading-none tabular-nums">{count}</span>
          <span className="text-label font-medium opacity-90 leading-none">{label}</span>
        </div>
      ))}
    </div>
  )
}
