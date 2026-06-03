/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockFromReturn } = vi.hoisted(() => {
  const chainMethods = {
    select: vi.fn(),
    eq: vi.fn(),
    update: vi.fn(),
    insert: vi.fn(),
    delete: vi.fn(),
    maybeSingle: vi.fn(),
  }

  Object.values(chainMethods).forEach((fn) => {
    fn.mockReturnValue(chainMethods)
  })

  chainMethods.insert.mockResolvedValue({ error: null })
  chainMethods.delete.mockResolvedValue({ error: null })
  chainMethods.maybeSingle.mockResolvedValue({ data: null })

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

import { salvarFicha, arquivarFicha } from '../fichas'
import { calcularCmv } from '@/lib/fichas'

describe('salvarFicha — validações e inserção', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lança erro com nome vazio', async () => {
    await expect(salvarFicha({ nome: '' })).rejects.toThrow('Nome é obrigatório')
  })

  it('lança erro com nome só espaços', async () => {
    await expect(salvarFicha({ nome: '   ' })).rejects.toThrow('Nome é obrigatório')
  })

  it('lança erro com custo negativo', async () => {
    await expect(salvarFicha({ nome: 'Drink', custoTotal: -1 })).rejects.toThrow('Custo inválido')
  })

  it('lança erro com custo infinito', async () => {
    await expect(salvarFicha({ nome: 'Drink', custoTotal: Infinity })).rejects.toThrow('Custo inválido')
  })

  it('lança erro com preço negativo', async () => {
    await expect(salvarFicha({ nome: 'Drink', precoVenda: -5 })).rejects.toThrow('Preço de venda inválido')
  })

  it('lança erro com preço infinito', async () => {
    await expect(salvarFicha({ nome: 'Drink', precoVenda: Infinity })).rejects.toThrow('Preço de venda inválido')
  })

  it('lança erro com rendimento negativo', async () => {
    await expect(salvarFicha({ nome: 'Drink', rendimento: -1 })).rejects.toThrow('Rendimento inválido')
  })

  it('aceita nome válido apenas', async () => {
    await expect(salvarFicha({ nome: 'Drink autoral' })).resolves.toBeUndefined()
    expect(mockFromReturn.insert).toHaveBeenCalled()
  })

  it('aceita nome com custo e preço', async () => {
    await salvarFicha({ nome: 'Premium', custoTotal: 8, precoVenda: 32 })
    const call = (mockFromReturn.insert as any).mock.calls[0][0]
    expect(call).toMatchObject({
      nome: 'Premium',
      custo_total: 8,
      preco_venda: 32,
      casa: 'bica',
      ativo: true,
    })
  })

  it('calcula CMV ao inserir com ambos informados', async () => {
    await salvarFicha({ nome: 'CMV Test', custoTotal: 10, precoVenda: 50 })
    const call = (mockFromReturn.insert as any).mock.calls[0][0]
    expect(call.cmv_pct).toBe(20)
  })

  it('inclui casa automaticamente', async () => {
    await salvarFicha({ nome: 'Test', custoTotal: 5, precoVenda: 20 })
    const call = (mockFromReturn.insert as any).mock.calls[0][0]
    expect(call.casa).toBe('bica')
  })

  it('inicia com ativo=true', async () => {
    await salvarFicha({ nome: 'New drink' })
    const call = (mockFromReturn.insert as any).mock.calls[0][0]
    expect(call.ativo).toBe(true)
  })

  it('aceita custo zero', async () => {
    await salvarFicha({ nome: 'Free', custoTotal: 0, precoVenda: 10 })
    const call = (mockFromReturn.insert as any).mock.calls[0][0]
    expect(call.custo_total).toBe(0)
  })
})

describe('salvarFicha com id — atualização', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('atualiza quando id fornecido', async () => {
    await salvarFicha({ id: 'f-1', nome: 'Updated', custoTotal: 10, precoVenda: 40 })
    expect(mockFromReturn.update).toHaveBeenCalled()
  })

  it('filtra por id e casa ao atualizar', async () => {
    await salvarFicha({ id: 'f-456', nome: 'Up', custoTotal: 5, precoVenda: 20 })
    const calls = (mockFromReturn.eq as any).mock.calls
    expect(calls).toContainEqual(['id', 'f-456'])
    expect(calls).toContainEqual(['casa', 'bica'])
  })

  it('recalcula CMV em atualização', async () => {
    await salvarFicha({ id: 'f-1', nome: 'F', custoTotal: 10, precoVenda: 50 })
    const call = (mockFromReturn.update as any).mock.calls[0][0]
    expect(call.cmv_pct).toBe(20)
  })

  it('trata categoria em atualização', async () => {
    await salvarFicha({ id: 'f-c', nome: 'D', categoria: 'Gim', custoTotal: 8, precoVenda: 32 })
    const call = (mockFromReturn.update as any).mock.calls[0][0]
    expect(call.categoria).toBe('Gim')
  })
})

describe('arquivarFicha — soft-delete', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rejeita id vazio', async () => {
    await expect(arquivarFicha('')).rejects.toThrow('Ficha inválida')
  })

  it('rejeita id só espaços', async () => {
    await expect(arquivarFicha('   ')).rejects.toThrow('Ficha inválida')
  })

  it('marca como inativa', async () => {
    await arquivarFicha('f-123')
    expect(mockFromReturn.update).toHaveBeenCalledWith(expect.objectContaining({ ativo: false }))
  })

  it('filtra por id e casa', async () => {
    await arquivarFicha('f-456')
    const calls = (mockFromReturn.eq as any).mock.calls
    expect(calls).toContainEqual(['id', 'f-456'])
    expect(calls).toContainEqual(['casa', 'bica'])
  })

  it('idempotente', async () => {
    await arquivarFicha('f-arch')
    expect(mockFromReturn.update).toHaveBeenCalled()
  })
})

describe('calcularCmv', () => {
  it('calcula percentual correto', () => {
    expect(calcularCmv(25, 100)).toBe(25)
  })

  it('arredonda para 1 casa decimal', () => {
    expect(calcularCmv(10, 30)).toBe(33.3)
  })

  it('retorna null com preço zero', () => {
    expect(calcularCmv(10, 0)).toBeNull()
  })

  it('retorna null com preço null', () => {
    expect(calcularCmv(10, null)).toBeNull()
  })

  it('retorna null com custo null', () => {
    expect(calcularCmv(null, 100)).toBeNull()
  })

  it('calcula com mínimos', () => {
    expect(calcularCmv(0.01, 1)).toBe(1)
  })

  it('calcula CMV alto', () => {
    expect(calcularCmv(70, 100)).toBe(70)
  })

  it('retorna null se ambos null', () => {
    expect(calcularCmv(null, null)).toBeNull()
  })

  it('trata infinito custo', () => {
    expect(calcularCmv(Infinity, 100)).toBeNull()
  })

  it('trata infinito venda', () => {
    expect(calcularCmv(50, Infinity)).toBeNull()
  })

  it('trata NaN custo', () => {
    expect(calcularCmv(NaN, 100)).toBeNull()
  })

  it('trata NaN venda', () => {
    expect(calcularCmv(50, NaN)).toBeNull()
  })

  it('CMV máximo 100', () => {
    const cmv = calcularCmv(100, 100)
    expect(cmv).toBe(100)
    expect(cmv).toBeLessThanOrEqual(100)
  })
})

describe('fluxo completo: criar → atualizar → arquivar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('cria, atualiza, arquiva (happy path)', async () => {
    await salvarFicha({ nome: 'Final', custoTotal: 8, precoVenda: 32 })
    expect(mockFromReturn.insert).toHaveBeenCalled()

    vi.clearAllMocks()
    await salvarFicha({ id: 'f-new', nome: 'Final', custoTotal: 10, precoVenda: 40 })
    expect(mockFromReturn.update).toHaveBeenCalled()

    vi.clearAllMocks()
    await arquivarFicha('f-new')
    expect(mockFromReturn.update).toHaveBeenCalledWith(expect.objectContaining({ ativo: false }))
  })

  it('casa mismatch atualizar', async () => {
    await salvarFicha({ id: 'f-other', nome: 'D', custoTotal: 5, precoVenda: 20 })
    expect(mockFromReturn.eq).toHaveBeenCalledWith('casa', 'bica')
  })

  it('casa mismatch arquivar', async () => {
    await arquivarFicha('f-other')
    expect(mockFromReturn.eq).toHaveBeenCalledWith('casa', 'bica')
  })
})
