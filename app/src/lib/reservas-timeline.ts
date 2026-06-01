/**
 * Helpers para a timeline visual de mesas.
 * Janela padrão: 18h–02h (26h na notação estendida).
 * Madrugada (< 6h) é tratada como +24h para manter ordenação contínua.
 */

export const JANELA_INICIO_MIN = 18 * 60  // 1080 — 18:00
export const JANELA_FIM_MIN = 26 * 60     // 1560 — 02:00 do dia seguinte

export interface BlocoTimeline {
  reservaId: string
  leftPct: number
  widthPct: number
  visivel: boolean
}

/** Converte 'HH:MM' ou 'HH:MM:SS' em minutos. Madrugada (< 6h) → +24h. */
export function horaParaMin(t: string): number {
  if (!t) return 0
  const [h, m] = t.split(':').map(Number)
  const total = h * 60 + (m || 0)
  return h < 6 ? total + 24 * 60 : total
}

/** Calcula a posição e largura de uma reserva na timeline (em %). */
export function calcularBloco(
  reserva: { id: string; start_time: string; end_time: string | null },
  inicioMin = JANELA_INICIO_MIN,
  fimMin = JANELA_FIM_MIN,
): BlocoTimeline {
  const janela = fimMin - inicioMin
  const start = horaParaMin(reserva.start_time)
  const end = reserva.end_time ? horaParaMin(reserva.end_time) : start + 90

  const leftMin = Math.max(start - inicioMin, 0)
  const rightMin = Math.min(end - inicioMin, janela)
  const widthMin = rightMin - leftMin

  if (widthMin <= 0 || start >= fimMin || end <= inicioMin) {
    return { reservaId: reserva.id, leftPct: 0, widthPct: 0, visivel: false }
  }

  return {
    reservaId: reserva.id,
    leftPct: (leftMin / janela) * 100,
    widthPct: (widthMin / janela) * 100,
    visivel: true,
  }
}

/** Gera as marcas de hora exibidas no eixo X da timeline. */
export function marcasHorario(
  inicioMin = JANELA_INICIO_MIN,
  fimMin = JANELA_FIM_MIN,
): string[] {
  const marks: string[] = []
  const inicio = Math.ceil(inicioMin / 60) * 60
  for (let m = inicio; m <= fimMin; m += 60) {
    const h = m < 24 * 60 ? m / 60 : (m - 24 * 60) / 60
    marks.push(`${String(Math.floor(h)).padStart(2, '0')}:00`)
  }
  return marks
}
