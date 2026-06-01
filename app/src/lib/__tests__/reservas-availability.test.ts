import { describe, it, expect } from 'vitest'
import {
  horariosColidem,
  mesasOcupadas,
  sugerirMesa,
  type ReservaSlot,
} from '../reservas-availability'

describe('horariosColidem', () => {
  it('detecta sobreposição parcial', () => {
    expect(horariosColidem('19:00', '21:00', '20:00', '22:00')).toBe(true)
  })

  it('não colide quando um termina exatamente quando o outro começa', () => {
    expect(horariosColidem('19:00', '20:00', '20:00', '21:00')).toBe(false)
  })

  it('detecta um intervalo contido no outro', () => {
    expect(horariosColidem('18:00', '23:00', '20:00', '21:00')).toBe(true)
  })

  it('não colide quando são totalmente separados', () => {
    expect(horariosColidem('19:00', '20:00', '21:00', '22:00')).toBe(false)
  })
})

describe('mesasOcupadas', () => {
  const reservas: ReservaSlot[] = [
    { id: 'r1', table_id: 't1', start_time: '19:00', end_time: '21:00', status: 'confirmada' },
    { id: 'r2', table_id: 't2', start_time: '19:00', end_time: '21:00', status: 'cancelada' },
    { id: 'r3', table_id: 't3', start_time: '19:00', end_time: '21:00', status: 'nao_compareceu' },
    { id: 'r4', table_id: null, start_time: '19:00', end_time: '21:00', status: 'pendente' },
  ]

  it('marca mesa com reserva ativa sobreposta como ocupada', () => {
    const ocupadas = mesasOcupadas(reservas, '20:00', '22:00')
    expect(ocupadas.has('t1')).toBe(true)
  })

  it('ignora reservas canceladas e no-show (liberam a mesa)', () => {
    const ocupadas = mesasOcupadas(reservas, '20:00', '22:00')
    expect(ocupadas.has('t2')).toBe(false)
    expect(ocupadas.has('t3')).toBe(false)
  })

  it('ignora reservas sem mesa', () => {
    const ocupadas = mesasOcupadas(reservas, '20:00', '22:00')
    expect(ocupadas.size).toBe(1)
  })

  it('exclui a própria reserva ao editar', () => {
    const ocupadas = mesasOcupadas(reservas, '20:00', '22:00', 'r1')
    expect(ocupadas.has('t1')).toBe(false)
  })

  it('retorna vazio para período inválido', () => {
    expect(mesasOcupadas(reservas, '22:00', '20:00').size).toBe(0)
    expect(mesasOcupadas(reservas, '', '').size).toBe(0)
  })

  it('não marca mesa quando horários não se sobrepõem', () => {
    const ocupadas = mesasOcupadas(reservas, '21:00', '23:00')
    expect(ocupadas.has('t1')).toBe(false)
  })
})

describe('sugerirMesa (best-fit)', () => {
  const mesas = [
    { id: 't1', capacity: 2 },
    { id: 't2', capacity: 4 },
    { id: 't3', capacity: 8 },
  ]

  it('escolhe a menor mesa que comporta o grupo', () => {
    expect(sugerirMesa(mesas, new Set(), 3)).toBe('t2')
  })

  it('escolhe encaixe exato quando existe', () => {
    expect(sugerirMesa(mesas, new Set(), 2)).toBe('t1')
  })

  it('pula mesas ocupadas e usa a próxima que serve', () => {
    expect(sugerirMesa(mesas, new Set(['t2']), 3)).toBe('t3')
  })

  it('retorna null quando nenhuma mesa comporta', () => {
    expect(sugerirMesa(mesas, new Set(), 12)).toBeNull()
  })

  it('retorna null quando todas as mesas que servem estão ocupadas', () => {
    expect(sugerirMesa(mesas, new Set(['t2', 't3']), 3)).toBeNull()
  })
})
