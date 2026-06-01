'use client'

import { AlertTriangle } from 'lucide-react'
import { calcularKpis, estadoTempoReserva } from '@/lib/reservas-tempo'
import type { Tables } from '@/types/database.types'

interface PainelServicoProps {
  reservas: Tables<'reservations'>[]
  agora: Date
  isHoje: boolean
}

/** Corta segundos de 'HH:MM:SS' → 'HH:MM'. */
function formatarHora(time: string): string {
  return time.slice(0, 5)
}

export function PainelServico({ reservas, agora, isHoje }: PainelServicoProps) {
  const kpis = calcularKpis(reservas, agora, isHoje)

  const atrasadas = isHoje
    ? reservas.filter(
        (r) => r.status === 'confirmada' && estadoTempoReserva(r, agora, isHoje) === 'atrasada',
      )
    : []

  return (
    <div className="space-y-3">
      {/* Linha de KPIs */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
        {/* Capas esperadas — sempre visível */}
        <div className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary/10 text-primary">
          <span className="text-base font-bold tabular-nums leading-none">
            {kpis.capasEsperadas}
          </span>
          <span className="text-xs opacity-80 leading-tight">Capas esperadas</span>
        </div>

        {/* Na casa — só hoje */}
        {isHoje && (
          <div className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-success-bg text-success">
            <span className="text-base font-bold tabular-nums leading-none">{kpis.naCasa}</span>
            <span className="text-xs opacity-80 leading-tight">Na casa</span>
          </div>
        )}

        {/* Próximas chegadas — só hoje */}
        {isHoje && (
          <div className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-warning-bg text-warning">
            <span className="text-base font-bold tabular-nums leading-none">
              {kpis.proximasChegadas}
            </span>
            <span className="text-xs opacity-80 leading-tight">Próximas (30min)</span>
          </div>
        )}

        {/* No-shows — sempre visível */}
        <div className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-muted text-b3">
          <span className="text-base font-bold tabular-nums leading-none">{kpis.noShows}</span>
          <span className="text-xs opacity-80 leading-tight">No-shows</span>
        </div>
      </div>

      {/* Faixa de alerta — atrasadas */}
      {isHoje && atrasadas.length > 0 && (
        <div className="flex items-start gap-2 bg-danger-bg text-danger rounded-lg px-3 py-2">
          <AlertTriangle size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
          <p className="text-xs font-medium leading-snug">
            {atrasadas.length} {atrasadas.length === 1 ? 'atrasada' : 'atrasadas'}:{' '}
            {atrasadas
              .map((r) => `${r.customer_name} ${formatarHora(r.start_time)}`)
              .join(' · ')}
          </p>
        </div>
      )}
    </div>
  )
}
