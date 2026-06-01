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
  className: string
  /** Quando true, só aparece se count > 0 (estados secundários). */
  condicional?: boolean
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
    { label: 'Pendentes', count: pendente, className: 'bg-warning-bg text-warning' },
    { label: 'Confirmadas', count: confirmada, className: 'bg-primary/10 text-primary' },
    { label: 'Na casa', count: presente, className: 'bg-success-bg text-success', condicional: true },
    { label: 'Concluídas', count: concluida, className: 'bg-muted text-b2' },
    { label: 'Não veio', count: naoCompareceu, className: 'bg-muted text-b3', condicional: true },
    { label: 'Canceladas', count: cancelada, className: 'bg-danger-bg text-danger' },
  ]

  const visiveis = items.filter((i) => !i.condicional || i.count > 0)

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
      {visiveis.map(({ label, count, className }) => (
        <div
          key={label}
          className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg ${className}`}
        >
          <span className="text-base font-bold tabular-nums leading-none">{count}</span>
          <span className="text-xs opacity-80 leading-tight">{label}</span>
        </div>
      ))}
    </div>
  )
}
