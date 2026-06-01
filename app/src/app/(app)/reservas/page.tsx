import { createClient } from '@/lib/supabase/server'
import { getCurrentCasa } from '@/lib/tenant'
import { DateNav } from '@/components/reservas/date-nav'
import { NovaReservaForm } from '@/components/reservas/nova-reserva-form'
import { ReservaCounters } from '@/components/reservas/reserva-counters'
import { ReservasView } from '@/components/reservas/reservas-view'
import { PageHeader } from '@/components/shared/page-header'
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

const NOME_CASA: Record<string, string> = {
  bica: 'BiCA',
  amp: 'AMP',
}

export default async function ReservasPage({
  searchParams,
}: {
  searchParams: Promise<{ data?: string }>
}) {
  const { data } = await searchParams
  const casa = await getCurrentCasa()
  const dataAlvo = data ?? new Date().toISOString().split('T')[0]
  const nomeCasa = NOME_CASA[casa] ?? casa.toUpperCase()

  const { reservas, mesas } = await getReservasData(casa, dataAlvo)

  const contagens = {
    pendente: reservas.filter((r) => r.status === 'pendente').length,
    confirmada: reservas.filter((r) => r.status === 'confirmada').length,
    presente: reservas.filter((r) => r.status === 'presente').length,
    concluida: reservas.filter((r) => r.status === 'concluida').length,
    cancelada: reservas.filter((r) => r.status === 'cancelada').length,
    naoCompareceu: reservas.filter((r) => r.status === 'nao_compareceu').length,
  }

  return (
    <main className="p-4 space-y-4 pb-24">
      <PageHeader title="Reservas" />

      <DateNav currentDate={dataAlvo} />

      {reservas.length > 0 && (
        <ReservaCounters
          pendente={contagens.pendente}
          confirmada={contagens.confirmada}
          presente={contagens.presente}
          concluida={contagens.concluida}
          cancelada={contagens.cancelada}
          naoCompareceu={contagens.naoCompareceu}
        />
      )}

      <NovaReservaForm tables={mesas} reservasDoDia={reservas} defaultDate={dataAlvo} />

      <ReservasView
        reservas={reservas}
        mesas={mesas}
        dataAlvo={dataAlvo}
        nomeCasa={nomeCasa}
      />
    </main>
  )
}
