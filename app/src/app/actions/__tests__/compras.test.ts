/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockFromReturn } = vi.hoisted(() => {
  const chainMethods = {
    select: vi.fn(),
    eq: vi.fn(),
    update: vi.fn(),
    insert: vi.fn(),
  }

  Object.values(chainMethods).forEach((fn) => {
    fn.mockReturnValue(chainMethods)
  })

  chainMethods.insert.mockResolvedValue({ error: null })

  return { mockFromReturn: chainMethods }
})

vi.mock('@/lib/auth-guard', () => ({
  requireUser: vi.fn().mockResolvedValue({
    supabase: {
      from: vi.fn().mockReturnValue(mockFromReturn),
    },
    casa: 'bica',
    userId: 'user-1',
  }),
}))

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

import { abrirRodada, marcarItemComprado, fecharRodada } from '../compras'

describe('abrirRodada — validações e inserção', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lança erro com nome vazio', async () => {
    await expect(abrirRodada('')).rejects.toThrow('Nome inválido')
  })

  it('lança erro com nome só espaços', async () => {
    await expect(abrirRodada('   ')).rejects.toThrow('Nome inválido')
  })

  it('aceita nome válido (cria rodada com status aberta)', async () => {
    await expect(abrirRodada('Rodada hortifruti')).resolves.toBeUndefined()
    expect(mockFromReturn.insert).toHaveBeenCalled()
  })

  it('inclui data e casa ao inserir', async () => {
    await abrirRodada('Rodada novo fornecedor')
    const insertCall = (mockFromReturn.insert as any).mock.calls[0]
    expect(insertCall[0]).toMatchObject({
      nome: 'Rodada novo fornecedor',
      status: 'aberta',
      casa: 'bica',
    })
    expect(insertCall[0].data).toBeDefined()
  })
})

describe('marcarItemComprado — validações e atualização', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lança erro com itemId vazio', async () => {
    await expect(marcarItemComprado('', true)).rejects.toThrow('Item inválido')
  })

  it('lança erro com itemId só espaços', async () => {
    await expect(marcarItemComprado('   ', true)).rejects.toThrow('Item inválido')
  })

  it('marca item como comprado (update)', async () => {
    await marcarItemComprado('item-123', true)
    expect(mockFromReturn.update).toHaveBeenCalledWith({ comprado: true })
  })

  it('marca item como não-comprado', async () => {
    await marcarItemComprado('item-456', false)
    expect(mockFromReturn.update).toHaveBeenCalledWith({ comprado: false })
  })

  it('filtra por itemId e casa (isolamento multi-tenant)', async () => {
    await marcarItemComprado('item-789', true)
    const eqCalls = (mockFromReturn.eq as any).mock.calls
    expect(eqCalls).toContainEqual(['id', 'item-789'])
    expect(eqCalls).toContainEqual(['casa', 'bica'])
  })
})

describe('fecharRodada — validações, cálculo total e atualização', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lança erro com rodadaId vazio', async () => {
    await expect(fecharRodada('')).rejects.toThrow('Rodada inválida')
  })

  it('lança erro com rodadaId só espaços', async () => {
    await expect(fecharRodada('   ')).rejects.toThrow('Rodada inválida')
  })

  it('calcula total de itens da rodada', async () => {
    // Setup mock para retornar dados quando a chain é completada
    mockFromReturn.eq.mockReturnValueOnce(mockFromReturn)
      .mockResolvedValueOnce({
        data: [
          { total: 100 },
          { total: 50 },
          { total: 75 },
        ],
      })

    await fecharRodada('rodada-111')
    expect(mockFromReturn.update).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'fechada',
        total: 225,
      })
    )
  })

  it('trata lista vazia de itens (total = 0)', async () => {
    mockFromReturn.eq.mockReturnValueOnce(mockFromReturn)
      .mockResolvedValueOnce({ data: [] })
    await fecharRodada('rodada-222')
    expect(mockFromReturn.update).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'fechada',
        total: 0,
      })
    )
  })

  it('filtra por rodada_id e casa (isolamento multi-tenant)', async () => {
    mockFromReturn.eq.mockReturnValueOnce(mockFromReturn)
      .mockResolvedValueOnce({ data: [] })
    await fecharRodada('rodada-333')
    const eqCalls = (mockFromReturn.eq as any).mock.calls
    expect(eqCalls).toContainEqual(['rodada_id', 'rodada-333'])
    expect(eqCalls).toContainEqual(['casa', 'bica'])
  })

  it('atualiza status para fechada na tabela rodadas', async () => {
    mockFromReturn.eq.mockReturnValueOnce(mockFromReturn)
      .mockResolvedValueOnce({ data: [] })
    await fecharRodada('rodada-444')
    expect(mockFromReturn.update).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'fechada',
      })
    )
  })
})
