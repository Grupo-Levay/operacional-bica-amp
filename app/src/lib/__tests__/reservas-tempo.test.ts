import { describe, it, expect } from 'vitest'
import {
  estadoTempoReserva,
  calcularKpis,
  ordenarPorRelevancia,
  type KpisDia,
} from '../reservas-tempo'
import type { Tables } from '@/types/database.types'

type Reserva = Tables<'reservations'>

// Agora fixo: 2026-06-01 às 20:00
const agora = new Date('2026-06-01T20:00:00')
const isHoje = true
const naoHoje = false

// Fábrica de reserva mínima para estadoTempoReserva
function slot(status: Reserva['status'], start_time: string) {
  return { status, start_time }
}

// Fábrica de reserva completa para ordenarPorRelevancia
function reserva(
  id: string,
  status: Reserva['status'],
  start_time: string,
  guest_count = 2,
): Reserva {
  return {
    id,
    casa: 'bica',
    customer_name: `Cliente ${id}`,
    customer_phone: null,
    reservation_date: '2026-06-01',
    start_time,
    end_time: '23:00:00',
    guest_count,
    table_id: null,
    notes: null,
    status,
    created_by_name: 'test',
  } as Reserva
}

// ---------------------------------------------------------------------------
describe('estadoTempoReserva', () => {
  it('retorna null quando !isHoje independente do status', () => {
    expect(estadoTempoReserva(slot('confirmada', '19:00:00'), agora, naoHoje)).toBeNull()
    expect(estadoTempoReserva(slot('presente', '19:00:00'), agora, naoHoje)).toBeNull()
    expect(estadoTempoReserva(slot('pendente', '20:15:00'), agora, naoHoje)).toBeNull()
  })

  it('retorna em_andamento para status presente', () => {
    expect(estadoTempoReserva(slot('presente', '19:00:00'), agora, isHoje)).toBe('em_andamento')
    // hora futura também — cliente já está na casa
    expect(estadoTempoReserva(slot('presente', '21:00:00'), agora, isHoje)).toBe('em_andamento')
  })

  it('retorna atrasada para confirmada cujo horário já passou', () => {
    expect(estadoTempoReserva(slot('confirmada', '19:30:00'), agora, isHoje)).toBe('atrasada')
    expect(estadoTempoReserva(slot('confirmada', '18:00:00'), agora, isHoje)).toBe('atrasada')
  })

  it('retorna iminente para confirmada ou pendente dentro dos próximos 30 min', () => {
    expect(estadoTempoReserva(slot('confirmada', '20:15:00'), agora, isHoje)).toBe('iminente')
    expect(estadoTempoReserva(slot('pendente', '20:30:00'), agora, isHoje)).toBe('iminente')
    // exatamente no horário atual → iminente (startMin === nowMin)
    expect(estadoTempoReserva(slot('confirmada', '20:00:00'), agora, isHoje)).toBe('iminente')
  })

  it('retorna null para confirmada/pendente com horário > 30 min no futuro', () => {
    expect(estadoTempoReserva(slot('confirmada', '20:31:00'), agora, isHoje)).toBeNull()
    expect(estadoTempoReserva(slot('pendente', '22:00:00'), agora, isHoje)).toBeNull()
  })

  it('retorna null para status terminais (cancelada, concluida, nao_compareceu)', () => {
    expect(estadoTempoReserva(slot('cancelada', '19:00:00'), agora, isHoje)).toBeNull()
    expect(estadoTempoReserva(slot('concluida', '19:00:00'), agora, isHoje)).toBeNull()
    expect(estadoTempoReserva(slot('nao_compareceu', '19:00:00'), agora, isHoje)).toBeNull()
  })
})

// ---------------------------------------------------------------------------
describe('calcularKpis', () => {
  const reservas = [
    { status: 'pendente' as const,        start_time: '22:00:00', guest_count: 3 },
    { status: 'confirmada' as const,      start_time: '19:30:00', guest_count: 2 }, // atrasada
    { status: 'confirmada' as const,      start_time: '20:20:00', guest_count: 4 }, // iminente
    { status: 'presente' as const,        start_time: '18:00:00', guest_count: 5 },
    { status: 'concluida' as const,       start_time: '17:00:00', guest_count: 6 },
    { status: 'cancelada' as const,       start_time: '20:00:00', guest_count: 7 },
    { status: 'nao_compareceu' as const,  start_time: '19:00:00', guest_count: 1 },
    { status: 'nao_compareceu' as const,  start_time: '19:30:00', guest_count: 1 },
  ]

  it('capasEsperadas soma pendente + confirmada + presente', () => {
    const kpis = calcularKpis(reservas, agora, isHoje)
    // 3 + 2 + 4 + 5 = 14
    expect(kpis.capasEsperadas).toBe(14)
  })

  it('naCasa soma apenas presente', () => {
    const kpis = calcularKpis(reservas, agora, isHoje)
    expect(kpis.naCasa).toBe(5)
  })

  it('noShows conta status nao_compareceu', () => {
    const kpis = calcularKpis(reservas, agora, isHoje)
    expect(kpis.noShows).toBe(2)
  })

  it('atrasados conta confirmadas com horário passado (isHoje=true)', () => {
    const kpis = calcularKpis(reservas, agora, isHoje)
    // confirmada 19:30 → atrasada
    expect(kpis.atrasados).toBe(1)
  })

  it('atrasados é 0 quando !isHoje', () => {
    const kpis = calcularKpis(reservas, agora, naoHoje)
    expect(kpis.atrasados).toBe(0)
  })

  it('proximasChegadas conta iminentes (isHoje=true)', () => {
    const kpis = calcularKpis(reservas, agora, isHoje)
    // confirmada 20:20 → iminente; pendente 22:00 → fora dos 30 min
    expect(kpis.proximasChegadas).toBe(1)
  })

  it('proximasChegadas é 0 quando !isHoje', () => {
    const kpis = calcularKpis(reservas, agora, naoHoje)
    expect(kpis.proximasChegadas).toBe(0)
  })

  it('retorna zeros para lista vazia', () => {
    const kpis = calcularKpis([], agora, isHoje)
    const esperado: KpisDia = { capasEsperadas: 0, naCasa: 0, proximasChegadas: 0, noShows: 0, atrasados: 0 }
    expect(kpis).toEqual(esperado)
  })
})

// ---------------------------------------------------------------------------
describe('ordenarPorRelevancia', () => {
  it('não muta o array de entrada', () => {
    const lista = [
      reserva('a', 'cancelada', '20:00:00'),
      reserva('b', 'confirmada', '19:30:00'),
    ]
    const copia = [...lista]
    ordenarPorRelevancia(lista, agora, isHoje)
    expect(lista).toEqual(copia)
  })

  it('atrasada vem antes de iminente, iminente antes de presente, presente antes de futura', () => {
    const lista = [
      reserva('futura', 'confirmada', '22:00:00'),
      reserva('presente', 'presente',  '18:00:00'),
      reserva('iminente', 'confirmada', '20:15:00'),
      reserva('atrasada', 'confirmada', '19:00:00'),
    ]
    const ordenada = ordenarPorRelevancia(lista, agora, isHoje)
    const ids = ordenada.map((r) => r.id)
    expect(ids.indexOf('atrasada')).toBeLessThan(ids.indexOf('iminente'))
    expect(ids.indexOf('iminente')).toBeLessThan(ids.indexOf('presente'))
    expect(ids.indexOf('presente')).toBeLessThan(ids.indexOf('futura'))
  })

  it('ordena concluida → nao_compareceu → cancelada no final', () => {
    const lista = [
      reserva('cancelada', 'cancelada',      '20:00:00'),
      reserva('nao_comp',  'nao_compareceu', '20:00:00'),
      reserva('concluida', 'concluida',      '20:00:00'),
      reserva('pendente',  'pendente',        '22:00:00'),
    ]
    const ordenada = ordenarPorRelevancia(lista, agora, isHoje)
    const ids = ordenada.map((r) => r.id)
    expect(ids.indexOf('pendente')).toBeLessThan(ids.indexOf('concluida'))
    expect(ids.indexOf('concluida')).toBeLessThan(ids.indexOf('nao_comp'))
    expect(ids.indexOf('nao_comp')).toBeLessThan(ids.indexOf('cancelada'))
  })

  it('desempata pelo start_time dentro do mesmo peso', () => {
    const lista = [
      reserva('b', 'pendente', '22:00:00'),
      reserva('a', 'pendente', '21:00:00'),
    ]
    const ordenada = ordenarPorRelevancia(lista, agora, isHoje)
    expect(ordenada[0].id).toBe('a')
    expect(ordenada[1].id).toBe('b')
  })

  it('funciona corretamente com !isHoje (sem estados de tempo)', () => {
    const lista = [
      reserva('cancelada', 'cancelada',  '20:00:00'),
      reserva('confirmada', 'confirmada', '19:00:00'), // não é atrasada fora de hoje
      reserva('pendente',   'pendente',   '21:00:00'),
    ]
    const ordenada = ordenarPorRelevancia(lista, agora, naoHoje)
    const ids = ordenada.map((r) => r.id)
    // confirmada e pendente → peso 3 (sem estado de tempo), cancelada → peso 6
    expect(ids.indexOf('cancelada')).toBeGreaterThan(ids.indexOf('confirmada'))
    expect(ids.indexOf('cancelada')).toBeGreaterThan(ids.indexOf('pendente'))
  })
})
