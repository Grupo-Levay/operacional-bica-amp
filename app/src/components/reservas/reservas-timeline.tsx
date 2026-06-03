'use client'

import { calcularBloco, marcasHorario } from '@/lib/reservas-timeline'
import type { Tables } from '@/types/database.types'

type Reserva = Tables<'reservations'>
type Mesa = Tables<'bar_tables'>

interface ReservasTimelineProps {
  reservas: Reserva[]
  mesas: Mesa[]
}

const STATUS_COR: Record<string, string> = {
  pendente:       'bg-warning-bg border-warning text-warning',
  confirmada:     'bg-primary/15 border-primary text-primary',
  presente:       'bg-success-bg border-success text-success',
  concluida:      'bg-muted border-border text-b4',
  nao_compareceu: 'bg-muted border-border text-b4 opacity-60',
  cancelada:      'bg-muted border-border text-b4 opacity-40',
}

export function ReservasTimeline({ reservas, mesas }: ReservasTimelineProps) {
  const marcas = marcasHorario()
  const reservasPorMesa = new Map<string | null, Reserva[]>()

  for (const mesa of mesas) {
    reservasPorMesa.set(mesa.id, [])
  }
  reservasPorMesa.set(null, [])

  for (const r of reservas) {
    const key = r.table_id ?? null
    if (!reservasPorMesa.has(key)) reservasPorMesa.set(key, [])
    reservasPorMesa.get(key)!.push(r)
  }

  const linhas: { label: string; key: string | null; reservas: Reserva[] }[] = mesas.map(
    (m) => ({
      label: `Mesa ${m.number}${m.location ? ` · ${m.location}` : ''}`,
      key: m.id,
      reservas: reservasPorMesa.get(m.id) ?? [],
    }),
  )

  const semMesa = reservasPorMesa.get(null) ?? []
  if (semMesa.length > 0) {
    linhas.push({ label: 'Sem mesa', key: null, reservas: semMesa })
  }

  if (linhas.length === 0) return null

  return (
    <div
      className="overflow-x-auto rounded-xl bg-card bg-gradient-surface p-3 shadow-md shadow-inner-hairline ring-1 ring-foreground/10"
      role="region"
      aria-label="Timeline de mesas"
    >
      <div style={{ minWidth: 560 }}>
        {/* Eixo de horas */}
        <div className="flex mb-1 ml-24 pr-1 relative">
          {marcas.map((h) => (
            <span
              key={h}
              className="flex-1 text-[10px] text-b4 text-left leading-none"
            >
              {h}
            </span>
          ))}
        </div>

        {/* Linhas por mesa */}
        <div className="space-y-1">
          {linhas.map(({ label, key, reservas: rs }) => (
            <div key={key ?? '__sem_mesa__'} className="flex items-center gap-2 min-h-[40px]">
              {/* Label da mesa */}
              <div className="w-24 shrink-0 text-xs text-b3 truncate text-right pr-2">{label}</div>

              {/* Faixa de blocos */}
              <div className="relative flex-1 h-8 bg-muted/60 rounded-md overflow-hidden ring-1 ring-inset ring-foreground/5">
                {rs.map((r) => {
                  const bloco = calcularBloco(r)
                  if (!bloco.visivel) return null
                  const cor = STATUS_COR[r.status] ?? STATUS_COR.pendente

                  return (
                    <div
                      key={r.id}
                      title={`${r.customer_name} · ${r.start_time.slice(0, 5)}–${r.end_time?.slice(0, 5) ?? '?'} · ${r.guest_count}p`}
                      className={`absolute top-1 bottom-1 rounded-md border text-[10px] font-medium flex items-center px-1 overflow-hidden shadow-sm transition-shadow ${cor}`}
                      style={{
                        left: `${bloco.leftPct}%`,
                        width: `${bloco.widthPct}%`,
                      }}
                    >
                      <span className="truncate">{r.customer_name}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
