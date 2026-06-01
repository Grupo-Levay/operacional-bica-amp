import type { Enums } from '@/types/database.types'

type Status = Enums<'reservation_status'>

/** Status que efetivamente ocupam a mesa num período.
 *  `cancelada` e `nao_compareceu` liberam a mesa para novas reservas. */
export const STATUS_OCUPA_MESA: ReadonlySet<Status> = new Set<Status>([
  'pendente',
  'confirmada',
  'presente',
  'concluida',
])

/** Reserva mínima necessária para cálculo de ocupação. */
export interface ReservaSlot {
  id: string
  table_id: string | null
  start_time: string
  end_time: string
  status: Status
}

/** Mesa mínima necessária para cálculo de disponibilidade. */
export interface MesaSlot {
  id: string
  capacity: number
}

/** Dois intervalos [start, end) se sobrepõem ⇔ aStart < bEnd E aEnd > bStart.
 *  Horários 'HH:MM' / 'HH:MM:SS' comparam corretamente como string. */
export function horariosColidem(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
): boolean {
  return aStart < bEnd && aEnd > bStart
}

/** IDs de mesas ocupadas no período informado. `excluirId` ignora uma reserva
 *  (usado na edição, para não colidir consigo mesma). Período inválido → vazio. */
export function mesasOcupadas(
  reservas: ReservaSlot[],
  inicio: string,
  fim: string,
  excluirId?: string,
): Set<string> {
  const ocupadas = new Set<string>()
  if (!inicio || !fim || fim <= inicio) return ocupadas

  for (const r of reservas) {
    if (!r.table_id) continue
    if (excluirId && r.id === excluirId) continue
    if (!STATUS_OCUPA_MESA.has(r.status)) continue
    if (horariosColidem(r.start_time, r.end_time, inicio, fim)) {
      ocupadas.add(r.table_id)
    }
  }
  return ocupadas
}

/** Sugere a mesa de menor capacidade que comporta `pessoas` (best-fit),
 *  considerando apenas as mesas cujos ids NÃO estão ocupados.
 *  Retorna o id da mesa sugerida ou null se nenhuma serve. */
export function sugerirMesa(
  mesas: MesaSlot[],
  ocupadasIds: ReadonlySet<string>,
  pessoas: number,
): string | null {
  let melhor: MesaSlot | null = null
  for (const m of mesas) {
    if (ocupadasIds.has(m.id)) continue
    if (m.capacity < pessoas) continue
    if (!melhor || m.capacity < melhor.capacity) {
      melhor = m
    }
  }
  return melhor?.id ?? null
}
