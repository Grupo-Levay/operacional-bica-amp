import { CalendarCheck } from 'lucide-react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getCurrentCasa } from '@/lib/tenant'
import { getTodayISO } from '@/lib/utils'
import { ReservaCard } from '@/components/reservas/reserva-card'
import { NovaReservaForm } from '@/components/reservas/nova-reserva-form'
import type { ReservaStatus } from '@/app/actions/reservas'

type Reserva = {
  id: string
  customer_name: string
  customer_phone: string | null
  reservation_date: string
  start_time: string
  end_time: string
  guest_count: number
  status: ReservaStatus
  notes: string | null
  created_by_name: string | null
  casa: string
}

async function getReservasData(casa: string, data: string) {
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data: reservas } = await supabase
      .from('reservations')
      .select('*')
      .eq('casa', casa)
      .eq('reservation_date', data)
      .order('start_time')
    return { reservas: (reservas ?? []) as Reserva[] }
  } catch {
    return { reservas: [] }
  }
}

function addDays(isoDate: string, days: number): string {
  const [y, m, d] = isoDate.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d + days))
  return dt.toISOString().split('T')[0]
}

function formatDateLabel(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  })
}

type Props = { searchParams: Promise<{ data?: string }> }

export default async function ReservasPage({ searchParams }: Props) {
  const [casa, { data: dataParam }] = await Promise.all([getCurrentCasa(), searchParams])

  const hoje = getTodayISO()
  const dataAtiva = dataParam ?? hoje
  const casaColor = casa === 'bica' ? 'var(--color-bica)' : 'var(--color-amp)'

  const anteriorStr = addDays(dataAtiva, -1)
  const proximoStr = addDays(dataAtiva, 1)
  const isHoje = dataAtiva === hoje

  const { reservas } = await getReservasData(casa, dataAtiva)

  const pendentes = reservas.filter((r) => r.status === 'pendente').length
  const confirmadas = reservas.filter((r) => r.status === 'confirmada').length
  const ativas = reservas.filter((r) => r.status !== 'cancelada' && r.status !== 'concluida')

  return (
    <main className="p-4 space-y-5 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center justify-center size-9 rounded-full border transition-colors hover:bg-accent"
            aria-label="Voltar"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold" style={{ color: casaColor }}>
              Reservas
            </h1>
            <p className="text-xs text-muted-foreground capitalize">
              {formatDateLabel(dataAtiva)}
            </p>
          </div>
        </div>

        {/* Navegação de data */}
        <div className="flex items-center gap-1">
          <a
            href={`/reservas?data=${anteriorStr}`}
            className="flex items-center justify-center size-8 rounded-full border hover:bg-muted text-lg leading-none"
            aria-label="Dia anterior"
          >
            ‹
          </a>
          {!isHoje && (
            <a href="/reservas" className="text-xs px-2 py-1 rounded border hover:bg-muted">
              Hoje
            </a>
          )}
          <a
            href={`/reservas?data=${proximoStr}`}
            className="flex items-center justify-center size-8 rounded-full border hover:bg-muted text-lg leading-none"
            aria-label="Próximo dia"
          >
            ›
          </a>
        </div>
      </div>

      {/* Stats */}
      {reservas.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg border shadow-sm bg-card p-3 flex flex-col gap-0.5">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Total</span>
            <span className="text-2xl font-bold tabular-nums leading-none">{reservas.length}</span>
          </div>
          <div className="rounded-lg border shadow-sm bg-card p-3 flex flex-col gap-0.5">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Pendentes</span>
            <span className="text-2xl font-bold tabular-nums leading-none text-yellow-600">{pendentes}</span>
          </div>
          <div className="rounded-lg border shadow-sm bg-card p-3 flex flex-col gap-0.5">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Confirmadas</span>
            <span className="text-2xl font-bold tabular-nums leading-none text-green-600">{confirmadas}</span>
          </div>
        </div>
      )}

      {/* Nova reserva */}
      <NovaReservaForm casaColor={casaColor} />

      {/* Lista */}
      <section className="space-y-3">
        {ativas.length === 0 && reservas.filter(r => r.status === 'cancelada' || r.status === 'concluida').length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
            <CalendarCheck className="size-10 opacity-30" />
            <p className="text-sm">Nenhuma reserva para este dia</p>
          </div>
        ) : (
          <>
            {ativas.length > 0 && (
              <div className="space-y-3">
                {ativas.map((r) => (
                  <ReservaCard key={r.id} reserva={r} casaColor={casaColor} />
                ))}
              </div>
            )}

            {/* Encerradas */}
            {reservas.some((r) => r.status === 'cancelada' || r.status === 'concluida') && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Encerradas</p>
                {reservas
                  .filter((r) => r.status === 'cancelada' || r.status === 'concluida')
                  .map((r) => (
                    <ReservaCard key={r.id} reserva={r} casaColor={casaColor} />
                  ))}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  )
}
