import { describe, it, expect } from 'vitest'
import { mediaCmv, cmvSeveridade } from '../dashboard-metrics'

describe('mediaCmv', () => {
  it('calcula a média do CMV de fichas válidas', () => {
    // CMV: 5/10=50%, 3/10=30% → média 40%
    expect(
      mediaCmv([
        { custo_total: 5, preco_venda: 10 },
        { custo_total: 3, preco_venda: 10 },
      ]),
    ).toBe(40)
  })

  it('ignora fichas sem custo/venda válidos', () => {
    // só a primeira conta (40/100 = 40%)
    expect(
      mediaCmv([
        { custo_total: 40, preco_venda: 100 },
        { custo_total: null, preco_venda: 100 },
        { custo_total: 10, preco_venda: 0 },
      ]),
    ).toBe(40)
  })

  it('retorna null quando nenhuma ficha tem CMV calculável', () => {
    expect(
      mediaCmv([
        { custo_total: null, preco_venda: null },
        { custo_total: 10, preco_venda: 0 },
      ]),
    ).toBeNull()
  })

  it('retorna null para lista vazia', () => {
    expect(mediaCmv([])).toBeNull()
  })

  it('arredonda para uma casa decimal', () => {
    // 1/3=33.3%, 2/3=66.7% → média 50.0%
    expect(
      mediaCmv([
        { custo_total: 1, preco_venda: 3 },
        { custo_total: 2, preco_venda: 3 },
      ]),
    ).toBe(50)
  })
})

describe('cmvSeveridade', () => {
  it('classifica null como muted', () => {
    expect(cmvSeveridade(null)).toBe('muted')
  })

  it('classifica ≤30% como ok', () => {
    expect(cmvSeveridade(30)).toBe('ok')
    expect(cmvSeveridade(12.5)).toBe('ok')
  })

  it('classifica entre 30% e 40% como warning', () => {
    expect(cmvSeveridade(30.1)).toBe('warning')
    expect(cmvSeveridade(40)).toBe('warning')
  })

  it('classifica acima de 40% como danger', () => {
    expect(cmvSeveridade(40.1)).toBe('danger')
    expect(cmvSeveridade(75)).toBe('danger')
  })
})
