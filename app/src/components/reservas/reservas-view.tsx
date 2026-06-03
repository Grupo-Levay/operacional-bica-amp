'use client'

import { useState, useMemo } from 'react'
import { LayoutList, GitBranch, Radio } from 'lucide-react'
import { PainelServico } from '@/components/reservas/painel-servico'
import { ReservasToolbar } from '@/components/reservas/reservas-toolbar'
import { ReservaCard } from '@/components/reservas/reserva-card'
import { ReservasTimeline } from '@/components/reservas/reservas-timeline'
import { EmptyState } from '@/components/shared/empty-state'
import { CalendarCheck } from 'lucide-react'
import { ordenarPorRelevancia } from '@/lib/reservas-tempo'
import { useRealtimeTable } from '@/hooks/use-realtime-table'
import type { Tables, Enums } from '@/types/database.types'

type Reserva = Tables<'reservations'>
type Mesa = Tables<'bar_tables'>
type StatusFiltro = Enums<'reservation_status'> | 'todos'

interface ReservasViewProps {
  reservas: Reserva[]
  mesas: Mesa[]
  dataAlvo: string
  nomeCasa: string
  casa: string
}

function isHojeCheck(dataAlvo: string): boolean {
  return dataAlvo === new Date().toISOString().split('T')[0]
}

export function ReservasView({ reservas, mesas, dataAlvo, nomeCasa, casa }: ReservasViewProps) {
  const agora = useMemo(() => new Date(), [])
  const isHoje = isHojeCheck(dataAlvo)
  const mesasPorId = new Map(mesas.map((m) => [m.id, m]))

  // Operação ao vivo: revalida a lista a cada mudança nas reservas desta casa.
  useRealtimeTable({ table: 'reservations', casa })

  const [busca, setBusca] = useState('')
  const [statusFiltro, setStatusFiltro] = useState<StatusFiltro>('todos')
  const [modoTimeline, setModoTimeline] = useState(false)

  const contagens = useMemo(
    () =>
      reservas.reduce(
        (acc, r) => {
          acc[r.status] = (acc[r.status] ?? 0) + 1
          return acc
        },
        {} as Partial<Record<Enums<'reservation_status'>, number>>,
      ),
    [reservas],
  )

  const reservasFiltradas = useMemo(() => {
    let lista = ordenarPorRelevancia(reservas, agora, isHoje)
    if (statusFiltro !== 'todos') lista = lista.filter((r) => r.status === statusFiltro)
    if (busca.trim()) {
      const q = busca.trim().toLowerCase()
      lista = lista.filter(
        (r) =>
          r.customer_name.toLowerCase().includes(q) ||
          (r.customer_phone ?? '').replace(/\D/g, '').includes(q.replace(/\D/g, '')),
      )
    }
    return lista
  }, [reservas, agora, isHoje, statusFiltro, busca])

  return (
    <div className="space-y-4">
      {/* Indicador de operação ao vivo */}
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-success">
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
        </span>
        <Radio size={12} aria-hidden="true" />
        Atualização ao vivo
      </div>

      {/* Painel de serviço — KPIs ao vivo */}
      {reservas.length > 0 && (
        <PainelServico reservas={reservas} agora={agora} isHoje={isHoje} />
      )}

      {/* Toolbar: busca + filtros + toggle de visualização */}
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <ReservasToolbar
            busca={busca}
            onBuscaChange={setBusca}
            statusFiltro={statusFiltro}
            onStatusChange={setStatusFiltro}
            contagens={contagens}
          />
        </div>
        {mesas.length > 0 && (
          <button
            type="button"
            onClick={() => setModoTimeline((v) => !v)}
            className={[
              'shrink-0 mt-0.5 flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium min-h-[40px] transition-[background-color,box-shadow,color] ease-[cubic-bezier(0.16,1,0.3,1)] focus-ring-brand',
              modoTimeline
                ? 'bg-gradient-brand text-primary-foreground shadow-glow-brand-sm'
                : 'bg-muted text-b3 ring-1 ring-foreground/5 hover:bg-muted/80 hover:text-b2',
            ].join(' ')}
            aria-label={modoTimeline ? 'Ver lista' : 'Ver timeline'}
          >
            {modoTimeline ? <LayoutList size={14} /> : <GitBranch size={14} />}
            {modoTimeline ? 'Lista' : 'Timeline'}
          </button>
        )}
      </div>

      {/* Conteúdo: lista ou timeline */}
      {modoTimeline ? (
        <ReservasTimeline reservas={reservasFiltradas} mesas={mesas} />
      ) : reservasFiltradas.length === 0 ? (
        <EmptyState
          icon={<CalendarCheck strokeWidth={1.2} />}
          message={
            busca || statusFiltro !== 'todos'
              ? 'Nenhuma reserva encontrada para este filtro.'
              : 'Nenhuma reserva para este dia.'
          }
        />
      ) : (
        <div className="space-y-3">
          {reservasFiltradas.map((reserva) => {
            const mesa = reserva.table_id ? mesasPorId.get(reserva.table_id) : null
            return (
              <ReservaCard
                key={reserva.id}
                reserva={reserva}
                mesa={mesa ? { number: mesa.number, location: mesa.location } : null}
                tables={mesas}
                reservasDoDia={reservas}
                nomeCasa={nomeCasa}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
