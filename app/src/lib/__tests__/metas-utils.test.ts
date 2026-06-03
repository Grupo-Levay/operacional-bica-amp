import { describe, it, expect } from 'vitest'
import { pctProgresso, bgProgresso } from '../metas-utils'

describe('pctProgresso', () => {
  it('retorna 0 com alvo 0', () => expect(pctProgresso(50, 0)).toBe(0))
  it('retorna 50 com metade do alvo', () => expect(pctProgresso(50, 100)).toBe(50))
  it('limita a 100 quando atual > alvo', () => expect(pctProgresso(150, 100)).toBe(100))
  it('retorna 100 exatamente na meta', () => expect(pctProgresso(100, 100)).toBe(100))
})

describe('bgProgresso', () => {
  it('sucesso em 100%', () => expect(bgProgresso(100)).toBe('bg-success'))
  it('warning em 60%', () => expect(bgProgresso(60)).toBe('bg-warning'))
  it('danger em 59%', () => expect(bgProgresso(59)).toBe('bg-danger'))
})
