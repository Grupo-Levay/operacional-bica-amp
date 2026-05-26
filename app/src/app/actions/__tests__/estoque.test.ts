import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/auth-guard', () => ({
  requireUser: vi.fn().mockResolvedValue({
    supabase: {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
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

import { atualizarQuantidade, atualizarItemEstoque } from '../estoque'

describe('atualizarQuantidade — validações', () => {
  it('lança erro com itemId vazio', async () => {
    await expect(atualizarQuantidade('', 5)).rejects.toThrow('Item inválido')
  })

  it('lança erro com quantidade negativa', async () => {
    await expect(atualizarQuantidade('item-1', -1)).rejects.toThrow('Quantidade inválida')
  })

  it('lança erro com quantidade não-finita', async () => {
    await expect(atualizarQuantidade('item-1', NaN)).rejects.toThrow('Quantidade inválida')
  })

  it('aceita quantidade válida', async () => {
    await expect(atualizarQuantidade('item-1', 12)).resolves.toBeUndefined()
  })
})

describe('atualizarItemEstoque — validações', () => {
  it('lança erro com itemId vazio', async () => {
    await expect(atualizarItemEstoque('', { minimo: 5 })).rejects.toThrow('Item inválido')
  })

  it('lança erro com mínimo negativo', async () => {
    await expect(atualizarItemEstoque('item-1', { minimo: -2 })).rejects.toThrow('Mínimo inválido')
  })

  it('lança erro quando nada é informado', async () => {
    await expect(atualizarItemEstoque('item-1', {})).rejects.toThrow('Nada para atualizar')
  })

  it('aceita mínimo e unidade válidos', async () => {
    await expect(
      atualizarItemEstoque('item-1', { minimo: 5, unidade: 'kg' })
    ).resolves.toBeUndefined()
  })
})
