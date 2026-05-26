import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/auth-guard', () => ({
  requireUser: vi.fn().mockResolvedValue({
    supabase: {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: [] }),
        update: vi.fn().mockReturnThis(),
        insert: vi.fn().mockResolvedValue({ error: null }),
      }),
    },
    casa: 'bica',
    userId: 'user-1',
  }),
}))

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

import { abrirRodada, marcarItemComprado, fecharRodada } from '../compras'

describe('abrirRodada — validações', () => {
  it('lança erro com nome vazio', async () => {
    await expect(abrirRodada('')).rejects.toThrow('Nome inválido')
  })

  it('lança erro com nome só espaços', async () => {
    await expect(abrirRodada('   ')).rejects.toThrow('Nome inválido')
  })

  it('aceita nome válido', async () => {
    await expect(abrirRodada('Rodada hortifruti')).resolves.toBeUndefined()
  })
})

describe('marcarItemComprado — validações', () => {
  it('lança erro com itemId vazio', async () => {
    await expect(marcarItemComprado('', true)).rejects.toThrow('Item inválido')
  })
})

describe('fecharRodada — validações', () => {
  it('lança erro com rodadaId vazio', async () => {
    await expect(fecharRodada('')).rejects.toThrow('Rodada inválida')
  })
})
