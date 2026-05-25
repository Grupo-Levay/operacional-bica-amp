interface ReservaCountersProps {
  pendente: number
  confirmada: number
  concluida: number
  cancelada: number
}

interface CounterItem {
  label: string
  count: number
  className: string
}

export function ReservaCounters({ pendente, confirmada, concluida, cancelada }: ReservaCountersProps) {
  const items: CounterItem[] = [
    { label: 'Pendentes', count: pendente, className: 'bg-warning-bg text-warning' },
    { label: 'Confirmadas', count: confirmada, className: 'bg-primary/10 text-primary' },
    { label: 'Concluídas', count: concluida, className: 'bg-success-bg text-success' },
    { label: 'Canceladas', count: cancelada, className: 'bg-danger-bg text-danger' },
  ]

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
      {items.map(({ label, count, className }) => (
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
