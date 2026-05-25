import { CalendarCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getCurrentCasa } from '@/lib/tenant'
import { DateNav } from '@/components/reservas/date-nav'
import { NovaReservaForm } from '@/components/reservas/nova-reserva-form'
import { ReservaCard } from '@/components/reservas/reserva-card'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import type { Tables } from '@/types/database.types'

type Reserva = Tables<'reservations'>
type Mesa = Tables<'bar_tables'>

async function getReservasData(
  casa: string,
  dataAlvo: string,
): Promise<{ reservas: Reserva[]; mesas: Mesa[] }> {
  try {
    const supabase = await createClient()
    const [{ data: reservas }, { data: mesas }] = await Promise.all([
      supabase
        .from('reservations')
        .select('*')
        .eq('casa', casa)
        .eq('reservation_date', dataAlvo)
        .order('start_time'),
      supabase
        .from('bar_tables')
        .select('*')
        .eq('casa', casa)
        .eq('is_active', true)
        .order('sort_order'),
    ])
    return {
      reservas: (reservas as Reserva[]) ?? [],
      mesas: (mesas as Mesa[]) ?? [],
    }
  } catch (e) {
    console.error('[reservas] getReservasData error:', e)
    return { reservas: [], mesas: [] }
  }
}

export default async function ReservasPage({
  searchParams,
}: {
  searchParams: Promise<{ data?: string }>
}) {
  const { data } = await searchParams
  const casa = await getCurrentCasa()
  const dataAlvo = data ?? new Date().toISOString().split('T')[0]

  const { reservas, mesas } = await getReservasData(casa, dataAlvo)

  const mesasPorId = new Map(mesas.map((m) => [m.id, m]))

  const contagens = {
    pendente: reservas.filter((r) => r.status === 'pendente').length,
    confirmada: reservas.filter((r) => r.status === 'confirmada').length,
    concluida: reservas.filter((r) => r.status === 'concluida').length,
    cancelada: reservas.filter((r) => r.status === 'cancelada').length,
  }

  return (
    <main className="p-4 space-y-4 pb-24">
      <PageHeader title="Reservas" />

      <DateNav currentDate={dataAlvo} />

      {reservas.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-b3">
          <span>{contagens.pendente} pendentes</span>
          <span>{contagens.confirmada} confirmadas</span>
          <span>{contagens.concluida} concluídas</span>
          <span>{contagens.cancelada} canceladas</span>
        </div>
      )}

      <NovaReservaForm tables={mesas} defaultDate={dataAlvo} />

      {reservas.length === 0 ? (
        <EmptyState
          icon={<CalendarCheck strokeWidth={1.2} />}
          message="Nenhuma reserva para este dia."
        />
      ) : (
        <div className="space-y-3">
          {reservas.map((reserva) => {
            const mesa = reserva.table_id ? mesasPorId.get(reserva.table_id) : null
            return (
              <ReservaCard
                key={reserva.id}
                reserva={reserva}
                mesa={mesa ? { number: mesa.number, location: mesa.location } : null}
              />
            )
          })}
        </div>
      )}
    </main>
  )
}
