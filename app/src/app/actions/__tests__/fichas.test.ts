import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/auth-guard', () => ({
  requireUser: vi.fn().mockResolvedValue({
    supabase: {
      from: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        insert: vi.fn().mockResolvedValue({ error: null }),
      }),
    },
    casa: 'bica',
    userId: 'user-1',
  }),
}))

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

import { salvarFicha, arquivarFicha } from '../fichas'
import { calcularCmv } from '@/lib/fichas'

describe('salvarFicha — validações', () => {
  it('lança erro com nome vazio', async () => {
    await expect(salvarFicha({ nome: '' })).rejects.toThrow('Nome é obrigatório')
  })

  it('lança erro com custo negativo', async () => {
    await expect(salvarFicha({ nome: 'Drink', custoTotal: -1 })).rejects.toThrow('Custo inválido')
  })

  it('lança erro com preço de venda negativo', async () => {
    await expect(salvarFicha({ nome: 'Drink', precoVenda: -5 })).rejects.toThrow(
      'Preço de venda inválido'
    )
  })

  it('aceita ficha válida (cria nova)', async () => {
    await expect(
      salvarFicha({ nome: 'Drink autoral', custoTotal: 8, precoVenda: 32 })
    ).resolves.toBeUndefined()
  })
})

describe('arquivarFicha — validações', () => {
  it('lança erro com id vazio', async () => {
    await expect(arquivarFicha('')).rejects.toThrow('Ficha inválida')
  })
})

describe('calcularCmv', () => {
  it('calcula percentual de custo sobre venda', () => {
    expect(calcularCmv(25, 100)).toBe(25)
  })

  it('arredonda para uma casa decimal', () => {
    expect(calcularCmv(10, 30)).toBe(33.3)
  })

  it('retorna null sem venda válida', () => {
    expect(calcularCmv(10, 0)).toBeNull()
    expect(calcularCmv(10, null)).toBeNull()
    expect(calcularCmv(null, 100)).toBeNull()
  })
})
