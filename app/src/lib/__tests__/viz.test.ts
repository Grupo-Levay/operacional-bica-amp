import { describe, it, expect } from 'vitest'
import {
  clampPct,
  ringGeometry,
  nivelEstoquePct,
  severidadeEstoque,
} from '../viz'

describe('clampPct', () => {
  it('mantém valores dentro do intervalo', () => {
    expect(clampPct(42)).toBe(42)
  })

  it('limita acima de 100', () => {
    expect(clampPct(150)).toBe(100)
  })

  it('limita abaixo de 0', () => {
    expect(clampPct(-20)).toBe(0)
  })

  it('trata NaN/Infinity como 0 (valor não-finito é inseguro)', () => {
    expect(clampPct(NaN)).toBe(0)
    expect(clampPct(Infinity)).toBe(0)
    expect(clampPct(-Infinity)).toBe(0)
  })
})

describe('ringGeometry', () => {
  it('calcula raio e circunferência', () => {
    const { radius, circumference } = ringGeometry(0, 52, 5)
    expect(radius).toBeCloseTo(23.5, 5)
    expect(circumference).toBeCloseTo(23.5 * 2 * Math.PI, 5)
  })

  it('dashoffset = circunferência quando 0%', () => {
    const { circumference, dashoffset } = ringGeometry(0, 52, 5)
    expect(dashoffset).toBeCloseTo(circumference, 5)
  })

  it('dashoffset = 0 quando 100%', () => {
    const { dashoffset } = ringGeometry(100, 52, 5)
    expect(dashoffset).toBeCloseTo(0, 5)
  })

  it('dashoffset = metade quando 50%', () => {
    const { circumference, dashoffset } = ringGeometry(50, 52, 5)
    expect(dashoffset).toBeCloseTo(circumference / 2, 5)
  })
})

describe('nivelEstoquePct', () => {
  it('retorna proporção atual/mínimo em %', () => {
    expect(nivelEstoquePct(3, 10)).toBe(30)
  })

  it('limita a 100 quando atual ≥ mínimo', () => {
    expect(nivelEstoquePct(15, 10)).toBe(100)
  })

  it('retorna 0 sem mínimo definido', () => {
    expect(nivelEstoquePct(5, 0)).toBe(0)
  })
})

describe('severidadeEstoque', () => {
  it('crítico quando abaixo de 50% do mínimo', () => {
    expect(severidadeEstoque(2, 10)).toBe('critico')
  })

  it('baixo entre 50% e 100% do mínimo', () => {
    expect(severidadeEstoque(7, 10)).toBe('baixo')
  })

  it('ok quando atinge ou supera o mínimo', () => {
    expect(severidadeEstoque(10, 10)).toBe('ok')
    expect(severidadeEstoque(12, 10)).toBe('ok')
  })

  it('ok quando não há mínimo definido', () => {
    expect(severidadeEstoque(0, 0)).toBe('ok')
  })
})
