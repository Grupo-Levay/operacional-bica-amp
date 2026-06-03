'use client'

import { Search } from 'lucide-react'
import type { Enums } from '@/types/database.types'

type StatusFiltro = Enums<'reservation_status'> | 'todos'

interface ReservasToolbarProps {
  busca: string
  onBuscaChange: (v: string) => void
  statusFiltro: StatusFiltro
  onStatusChange: (s: StatusFiltro) => void
  contagens: Partial<Record<Enums<'reservation_status'>, number>>
}

interface ChipDef {
  valor: StatusFiltro
  label: string
}

const CHIPS: ChipDef[] = [
  { valor: 'todos',          label: 'Todos' },
  { valor: 'pendente',       label: 'Pendente' },
  { valor: 'confirmada',     label: 'Confirmada' },
  { valor: 'presente',       label: 'Na casa' },
  { valor: 'concluida',      label: 'Concluída' },
  { valor: 'nao_compareceu', label: 'Não veio' },
  { valor: 'cancelada',      label: 'Cancelada' },
]

export function ReservasToolbar({
  busca,
  onBuscaChange,
  statusFiltro,
  onStatusChange,
  contagens,
}: ReservasToolbarProps) {
  return (
    <div className="space-y-3">
      {/* Campo de busca */}
      <div className="relative w-full">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-b4"
          aria-hidden="true"
        />
        <input
          type="search"
          value={busca}
          onChange={(e) => onBuscaChange(e.target.value)}
          placeholder="Buscar por nome ou telefone"
          className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm transition-colors hover:border-foreground/20 focus:outline-none focus-ring-brand"
        />
      </div>

      {/* Chips de filtro de status */}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none">
        {CHIPS.map(({ valor, label }) => {
          const ativo = statusFiltro === valor
          const contagem = valor !== 'todos'
            ? (contagens[valor as Enums<'reservation_status'>] ?? 0)
            : undefined

          return (
            <button
              key={valor}
              type="button"
              onClick={() => onStatusChange(valor)}
              className={[
                'shrink-0 min-h-[40px] rounded-lg px-3 py-1.5 text-xs font-medium transition-[background-color,box-shadow,color] ease-[cubic-bezier(0.16,1,0.3,1)] focus-ring-brand',
                ativo
                  ? 'bg-gradient-brand text-primary-foreground shadow-glow-brand-sm'
                  : 'bg-muted text-b3 ring-1 ring-foreground/5 hover:bg-muted/80 hover:text-b2',
              ].join(' ')}
            >
              {label}
              {contagem !== undefined && contagem > 0 && (
                <span
                  className={[
                    'ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums',
                    ativo ? 'bg-primary-foreground/20' : 'bg-background/60',
                  ].join(' ')}
                >
                  {contagem}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
