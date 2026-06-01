import type { Tables } from '@/types/database.types'

type Reserva = Tables<'reservations'>

export type EstadoTempo = 'atrasada' | 'iminente' | 'em_andamento' | null

export interface KpisDia {
  capasEsperadas: number
  naCasa: number
  proximasChegadas: number
  noShows: number
  atrasados: number
}

/** Converte 'HH:MM' ou 'HH:MM:SS' em minutos do dia. */
function horaParaMin(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

export function estadoTempoReserva(
  reserva: Pick<Reserva, 'status' | 'start_time'>,
  agora: Date,
  isHoje: boolean,
): EstadoTempo {
  if (!isHoje) return null

  const nowMin = agora.getHours() * 60 + agora.getMinutes()
  const startMin = horaParaMin(reserva.start_time)

  if (reserva.status === 'presente') return 'em_andamento'

  if (reserva.status === 'confirmada' && nowMin > startMin) return 'atrasada'

  if (
    (reserva.status === 'confirmada' || reserva.status === 'pendente') &&
    startMin >= nowMin &&
    startMin - nowMin <= 30
  ) {
    return 'iminente'
  }

  return null
}

export function calcularKpis(
  reservas: Pick<Reserva, 'status' | 'start_time' | 'guest_count'>[],
  agora: Date,
  isHoje: boolean,
): KpisDia {
  let capasEsperadas = 0
  let naCasa = 0
  let proximasChegadas = 0
  let noShows = 0
  let atrasados = 0

  for (const r of reservas) {
    if (r.status === 'pendente' || r.status === 'confirmada' || r.status === 'presente') {
      capasEsperadas += r.guest_count
    }
    if (r.status === 'presente') {
      naCasa += r.guest_count
    }
    if (r.status === 'nao_compareceu') {
      noShows += 1
    }

    if (isHoje) {
      const estado = estadoTempoReserva(r, agora, isHoje)
      if (estado === 'atrasada') atrasados += 1
      if (estado === 'iminente') proximasChegadas += 1
    }
  }

  return { capasEsperadas, naCasa, proximasChegadas, noShows, atrasados }
}

function pesoReserva(reserva: Reserva, agora: Date, isHoje: boolean): number {
  const estado = estadoTempoReserva(reserva, agora, isHoje)

  if (estado === 'atrasada') return 0
  if (estado === 'iminente') return 1
  if (estado === 'em_andamento') return 2

  const status = reserva.status
  if (status === 'pendente' || status === 'confirmada') return 3
  if (status === 'concluida') return 4
  if (status === 'nao_compareceu') return 5
  if (status === 'cancelada') return 6

  return 7
}

export function ordenarPorRelevancia(reservas: Reserva[], agora: Date, isHoje: boolean): Reserva[] {
  return [...reservas].sort((a, b) => {
    const pesoDiff = pesoReserva(a, agora, isHoje) - pesoReserva(b, agora, isHoje)
    if (pesoDiff !== 0) return pesoDiff
    return horaParaMin(a.start_time) - horaParaMin(b.start_time)
  })
}
