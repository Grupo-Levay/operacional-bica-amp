import { describe, it, expect } from 'vitest'
import {
  horaParaMin,
  calcularBloco,
  marcasHorario,
  JANELA_INICIO_MIN,
  JANELA_FIM_MIN,
} from '../reservas-timeline'

describe('horaParaMin', () => {
  it('converte hora normal', () => {
    expect(horaParaMin('18:00')).toBe(1080)
  })

  it('converte hora com segundos', () => {
    expect(horaParaMin('20:30:00')).toBe(1230)
  })

  it('trata madrugada (< 6h) como +24h', () => {
    expect(horaParaMin('01:00')).toBe(25 * 60)
  })

  it('retorna 0 para string vazia', () => {
    expect(horaParaMin('')).toBe(0)
  })
})

describe('calcularBloco', () => {
  const reserva = (start: string, end: string | null, id = 'r1') => ({
    id,
    start_time: start,
    end_time: end,
  })

  it('calcula bloco no centro da janela', () => {
    const bloco = calcularBloco(reserva('20:00', '22:00'))
    const janela = JANELA_FIM_MIN - JANELA_INICIO_MIN
    expect(bloco.visivel).toBe(true)
    expect(bloco.leftPct).toBeCloseTo(((2 * 60) / janela) * 100, 1)
    expect(bloco.widthPct).toBeCloseTo(((2 * 60) / janela) * 100, 1)
  })

  it('usa 90min padrão quando end_time é null', () => {
    const bloco = calcularBloco(reserva('20:00', null))
    const janela = JANELA_FIM_MIN - JANELA_INICIO_MIN
    expect(bloco.widthPct).toBeCloseTo((90 / janela) * 100, 1)
  })

  it('retorna visivel=false para reserva fora da janela', () => {
    const bloco = calcularBloco(reserva('10:00', '11:00'))
    expect(bloco.visivel).toBe(false)
  })

  it('recorta bloco que ultrapassa o fim da janela', () => {
    const bloco = calcularBloco(reserva('01:00', '03:00'))
    expect(bloco.visivel).toBe(true)
    expect(bloco.leftPct + bloco.widthPct).toBeLessThanOrEqual(100.01)
  })

  it('trata madrugada corretamente no posicionamento', () => {
    const bloco = calcularBloco(reserva('01:00', '02:00'))
    expect(bloco.visivel).toBe(true)
    expect(bloco.leftPct).toBeGreaterThan(80)
  })
})

describe('marcasHorario', () => {
  it('inclui 18:00 e 02:00', () => {
    const marcas = marcasHorario()
    expect(marcas[0]).toBe('18:00')
    expect(marcas[marcas.length - 1]).toBe('02:00')
  })

  it('intervalo de 1 hora entre marcas', () => {
    const marcas = marcasHorario()
    expect(marcas.length).toBe(9) // 18,19,20,21,22,23,00,01,02
  })
})
