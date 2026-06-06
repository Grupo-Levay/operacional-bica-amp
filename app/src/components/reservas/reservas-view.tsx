'use client'

import { useState, useMemo } from 'react'
import { LayoutList, GitBranch, Radio, CalendarCheck } from 'lucide-react'
import { PainelServico } from '@/components/reservas/painel-servico'
import { ReservasToolbar } from '@/components/reservas/reservas-toolbar'
import { ReservaCard } from '@/components/reservas/reserva-card'
import { ReservasTimeline } from '@/components/reservas/reservas-timeline'
import { EmptyState } from '@/components/shared/empty-state'
import { Tabs, TabsList, TabsIndicator, TabsTab, TabsPanel } from '@/components/ui/tabs'
import { ordenarPorRelevancia } from '@/lib/reservas-tempo'
import { useRealtimeTable } from '@/hooks/use-realtime-table'
import type { Tables, Enums } from '@/types/database.types'

type Reserva = Tables<'reservations'>
type Mesa = Tables<'bar_tables'>
type StatusFiltro = Enums<'reservation_status'> | 'todos'
type Visao = 'lista' | 'timeline'

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
  const [visao, setVisao] = useState<Visao>('lista')

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

  // Conteúdo da visão em lista — reutilizado no TabsPanel e no fallback sem mesas.
  const listaConteudo =
    reservasFiltradas.length === 0 ? (
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
    )

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

      {/* Toolbar: busca + filtros */}
      <ReservasToolbar
        busca={busca}
        onBuscaChange={setBusca}
        statusFiltro={statusFiltro}
        onStatusChange={setStatusFiltro}
        contagens={contagens}
      />

      {/* Visões: lista x timeline (tabs segmentadas). A timeline só existe
          quando há mesas — sem mesas, renderiza só a lista direto. */}
      {mesas.length > 0 ? (
        <Tabs value={visao} onValueChange={(v) => setVisao(v as Visao)}>
          <TabsList className="w-full">
            <TabsIndicator />
            <TabsTab value="lista" className="flex-1 gap-1.5">
              <LayoutList className="size-4" aria-hidden="true" />
              Lista
            </TabsTab>
            <TabsTab value="timeline" className="flex-1 gap-1.5">
              <GitBranch className="size-4" aria-hidden="true" />
              Timeline
            </TabsTab>
          </TabsList>
          <TabsPanel value="lista">{listaConteudo}</TabsPanel>
          <TabsPanel value="timeline">
            <ReservasTimeline reservas={reservasFiltradas} mesas={mesas} />
          </TabsPanel>
        </Tabs>
      ) : (
        listaConteudo
      )}
    </div>
  )
}
