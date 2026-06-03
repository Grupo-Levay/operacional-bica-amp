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
    { label: 'Pendentes', count: pendente, className: 'bg-warning-bg text-warning ring-1 ring-warning/20' },
    { label: 'Confirmadas', count: confirmada, className: 'bg-primary/10 text-primary ring-1 ring-primary/25 shadow-glow-brand-sm' },
    { label: 'Na casa', count: presente, className: 'bg-success-bg text-success ring-1 ring-success/20', condicional: true },
    { label: 'Concluídas', count: concluida, className: 'bg-gradient-surface text-b2 ring-1 ring-foreground/10' },
    { label: 'Não veio', count: naoCompareceu, className: 'bg-gradient-surface text-b3 ring-1 ring-foreground/10', condicional: true },
    { label: 'Canceladas', count: cancelada, className: 'bg-danger-bg text-danger ring-1 ring-destructive/20' },
  ]

  const visiveis = items.filter((i) => !i.condicional || i.count > 0)

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
      {visiveis.map(({ label, count, className }) => (
        <div
          key={label}
          className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg shadow-inner-hairline ${className}`}
        >
          <span className="text-base font-bold tabular-nums leading-none">{count}</span>
          <span className="text-xs opacity-80 leading-tight">{label}</span>
        </div>
      ))}
    </div>
  )
}
