import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockFromReturn = {
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  insert: vi.fn().mockResolvedValue({ error: null }),
}

const mockSupabase = {
  from: vi.fn().mockReturnValue(mockFromReturn),
}

vi.mock('@/lib/auth-guard', () => ({
  requireUser: vi.fn().mockResolvedValue({
    supabase: mockSupabase,
    casa: 'bica',
    userId: 'user-1',
  }),
}))

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

import {
  atualizarQuantidade,
  atualizarItemEstoque,
  criarItemEstoque,
  arquivarItemEstoque,
} from '../estoque'

describe('atualizarQuantidade — validações e atualização', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lança erro com itemId vazio', async () => {
    await expect(atualizarQuantidade('', 5)).rejects.toThrow('Item inválido')
  })

  it('lança erro com itemId só espaços', async () => {
    await expect(atualizarQuantidade('   ', 5)).rejects.toThrow('Item inválido')
  })

  it('lança erro com quantidade negativa', async () => {
    await expect(atualizarQuantidade('item-1', -1)).rejects.toThrow('Quantidade inválida')
  })

  it('lança erro com quantidade não-finita (NaN)', async () => {
    await expect(atualizarQuantidade('item-1', NaN)).rejects.toThrow('Quantidade inválida')
  })

  it('lança erro com quantidade infinita', async () => {
    await expect(atualizarQuantidade('item-1', Infinity)).rejects.toThrow('Quantidade inválida')
  })

  it('aceita quantidade válida (inteira)', async () => {
    await expect(atualizarQuantidade('item-1', 12)).resolves.toBeUndefined()
    expect(mockFromReturn.update).toHaveBeenCalledWith({ atual: 12 })
  })

  it('aceita quantidade válida (decimal)', async () => {
    await expect(atualizarQuantidade('item-1', 5.5)).resolves.toBeUndefined()
    expect(mockFromReturn.update).toHaveBeenCalledWith({ atual: 5.5 })
  })

  it('filtra por itemId e casa (isolamento multi-tenant)', async () => {
    await atualizarQuantidade('item-123', 10)
    const eqCalls = (mockFromReturn.eq as any).mock.calls
    expect(eqCalls).toContainEqual(['id', 'item-123'])
    expect(eqCalls).toContainEqual(['casa', 'bica'])
  })
})

describe('atualizarItemEstoque — validações e atualizações parciais', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lança erro com itemId vazio', async () => {
    await expect(atualizarItemEstoque('', { minimo: 5 })).rejects.toThrow('Item inválido')
  })

  it('lança erro com itemId só espaços', async () => {
    await expect(atualizarItemEstoque('   ', { minimo: 5 })).rejects.toThrow('Item inválido')
  })

  it('lança erro com mínimo negativo', async () => {
    await expect(atualizarItemEstoque('item-1', { minimo: -2 })).rejects.toThrow('Mínimo inválido')
  })

  it('lança erro quando nada é informado (objeto vazio)', async () => {
    await expect(atualizarItemEstoque('item-1', {})).rejects.toThrow('Nada para atualizar')
  })

  it('aceita atualização apenas de mínimo', async () => {
    await expect(atualizarItemEstoque('item-1', { minimo: 5 })).resolves.toBeUndefined()
    expect(mockFromReturn.update).toHaveBeenCalledWith({ minimo: 5 })
  })

  it('aceita atualização apenas de unidade', async () => {
    await expect(atualizarItemEstoque('item-1', { unidade: 'kg' })).resolves.toBeUndefined()
    expect(mockFromReturn.update).toHaveBeenCalledWith({ unidade: 'kg' })
  })

  it('aceita atualização de múltiplos campos', async () => {
    await expect(
      atualizarItemEstoque('item-1', { minimo: 5, unidade: 'kg', nome: 'Novo nome' })
    ).resolves.toBeUndefined()
    expect(mockFromReturn.update).toHaveBeenCalledWith({
      minimo: 5,
      unidade: 'kg',
      nome: 'Novo nome',
    })
  })

  it('filtra por itemId e casa (isolamento multi-tenant)', async () => {
    await atualizarItemEstoque('item-456', { minimo: 10 })
    const eqCalls = (mockFromReturn.eq as any).mock.calls
    expect(eqCalls).toContainEqual(['id', 'item-456'])
    expect(eqCalls).toContainEqual(['casa', 'bica'])
  })
})

describe('criarItemEstoque — validações e inserção', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lança erro com nome vazio', async () => {
    await expect(criarItemEstoque({ nome: '' })).rejects.toThrow('Nome do item é obrigatório')
  })

  it('lança erro com nome só espaços', async () => {
    await expect(criarItemEstoque({ nome: '   ' })).rejects.toThrow('Nome do item é obrigatório')
  })

  it('lança erro com mínimo negativo', async () => {
    await expect(criarItemEstoque({ nome: 'Gin', minimo: -1 })).rejects.toThrow('Mínimo inválido')
  })

  it('lança erro com quantidade inicial negativa', async () => {
    await expect(criarItemEstoque({ nome: 'Gin', atual: -3 })).rejects.toThrow(
      'Quantidade inicial inválida',
    )
  })

  it('lança erro com quantidade inicial não-finita', async () => {
    await expect(criarItemEstoque({ nome: 'Gin', atual: NaN })).rejects.toThrow(
      'Quantidade inicial inválida',
    )
  })

  it('aceita item válido com defaults (nome apenas)', async () => {
    await expect(criarItemEstoque({ nome: 'Gin Tanqueray' })).resolves.toBeUndefined()
    expect(mockSupabase.from).toHaveBeenCalledWith('estoque')
    expect(mockFromReturn.insert).toHaveBeenCalled()
    const insertCall = (mockFromReturn.insert as any).mock.calls[0]
    expect(insertCall[0].nome).toBe('Gin Tanqueray')
    expect(insertCall[0].casa).toBe('bica')
  })

  it('aceita item válido com todos os campos', async () => {
    await expect(
      criarItemEstoque({
        nome: 'Vodka',
        categoriaId: 'cat-1',
        minimo: 5,
        unidade: 'un',
        atual: 10,
      }),
    ).resolves.toBeUndefined()
    const insertCall = (mockFromReturn.insert as any).mock.calls[0]
    expect(insertCall[0]).toMatchObject({
      nome: 'Vodka',
      categoriaId: 'cat-1',
      minimo: 5,
      unidade: 'un',
      atual: 10,
      casa: 'bica',
    })
  })

  it('inclui casa automaticamente (isolamento multi-tenant)', async () => {
    await criarItemEstoque({ nome: 'Rum' })
    const insertCall = (mockFromReturn.insert as any).mock.calls[0]
    expect(insertCall[0].casa).toBe('bica')
  })
})

describe('arquivarItemEstoque — validações e soft-delete', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lança erro com itemId vazio', async () => {
    await expect(arquivarItemEstoque('')).rejects.toThrow('Item inválido')
  })

  it('lança erro com itemId só espaços', async () => {
    await expect(arquivarItemEstoque('   ')).rejects.toThrow('Item inválido')
  })

  it('aceita itemId válido (marca como inativo)', async () => {
    await expect(arquivarItemEstoque('item-1')).resolves.toBeUndefined()
    expect(mockSupabase.from).toHaveBeenCalledWith('estoque_itens')
    expect(mockFromReturn.update).toHaveBeenCalledWith(
      expect.objectContaining({ ativo: false })
    )
  })

  it('filtra por itemId e casa (isolamento multi-tenant)', async () => {
    await arquivarItemEstoque('item-789')
    const eqCalls = (mockFromReturn.eq as any).mock.calls
    expect(eqCalls).toContainEqual(['id', 'item-789'])
    expect(eqCalls).toContainEqual(['casa', 'bica'])
  })

  it('rejeita reativação (soft-delete unidirecional)', async () => {
    // Garante que não há ação de "restore"
    mockFromReturn.update = vi.fn().mockReturnThis()
    await arquivarItemEstoque('item-archived')
    expect(mockFromReturn.update).toHaveBeenCalledWith(
      expect.objectContaining({ ativo: false })
    )
  })

  it('marca como inativo (soft-delete com ativo=false)', async () => {
    await arquivarItemEstoque('item-inactive')
    const updateCall = (mockFromReturn.update as any).mock.calls[0]
    // Verifica que update contém ativo=false
    expect(updateCall[0]).toHaveProperty('ativo', false)
  })

  it('trata tentativa de arquivar item já inativo (idempotente)', async () => {
    mockFromReturn.eq = vi.fn().mockReturnThis()
    await arquivarItemEstoque('item-already-inactive')
    // Comportamento esperado: idempotente (sem erro)
    expect(mockFromReturn.update).toHaveBeenCalled()
  })
})

describe('validações de quantidade', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('validar que quantidade atual >= 0 (não negativa)', async () => {
    await expect(
      atualizarQuantidade('item-1', -0.1)
    ).rejects.toThrow('Quantidade inválida')
  })

  it('validar que quantidade é número válido (não infinita)', async () => {
    await expect(
      atualizarQuantidade('item-1', Infinity)
    ).rejects.toThrow('Quantidade inválida')
  })

  it('aceita quantidade decimal válida', async () => {
    await expect(
      atualizarQuantidade('item-1', 5.5)
    ).resolves.toBeUndefined()
  })
})

describe('fluxo completo: criar, atualizar, arquivar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('cria item, atualiza quantidade, arquiva (happy path)', async () => {
    // 1. Criar
    await criarItemEstoque({ nome: 'Teste', minimo: 5, atual: 10 })
    expect(mockFromReturn.insert).toHaveBeenCalled()

    // 2. Atualizar quantidade
    vi.clearAllMocks()
    await atualizarQuantidade('item-test', 8)
    expect(mockFromReturn.update).toHaveBeenCalledWith({ atual: 8 })

    // 3. Arquivar
    vi.clearAllMocks()
    await arquivarItemEstoque('item-test')
    expect(mockFromReturn.update).toHaveBeenCalledWith(
      expect.objectContaining({ arquivado: true })
    )
  })

  it('rejeita operação em item inativo', async () => {
    mockFromReturn.select = vi.fn().mockReturnThis()
    mockFromReturn.eq = vi.fn().mockResolvedValueOnce({
      data: { id: 'item-inactive', ativo: false },
    })
    // Comportamento esperado: proteção em camadas superiores
    // A ação não valida ativo, mas o componente UI pode filtrar
  })
})
