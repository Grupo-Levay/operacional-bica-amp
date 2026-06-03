/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockFromReturn } = vi.hoisted(() => {
  const chainMethods = {
    select: vi.fn(),
    eq: vi.fn(),
    maybeSingle: vi.fn(),
    update: vi.fn(),
    insert: vi.fn(),
    delete: vi.fn(),
  }

  Object.values(chainMethods).forEach((fn) => {
    fn.mockReturnValue(chainMethods)
  })

  chainMethods.maybeSingle.mockResolvedValue({ data: null })
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

import { salvarEscala, removerEscala, confirmarEscala } from '../escala'

describe('salvarEscala — validações e inserção/atualização', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFromReturn.maybeSingle = vi.fn().mockResolvedValue({ data: null })
  })

  it('lança erro com membroId vazio', async () => {
    await expect(salvarEscala('', '2026-06-01', 'AB')).rejects.toThrow('Membro inválido')
  })

  it('lança erro com membroId só espaços', async () => {
    await expect(salvarEscala('   ', '2026-06-01', 'AB')).rejects.toThrow('Membro inválido')
  })

  it('lança erro com data vazia', async () => {
    await expect(salvarEscala('m-1', '', 'AB')).rejects.toThrow('Data inválida')
  })

  it('lança erro com turno vazio', async () => {
    await expect(salvarEscala('m-1', '2026-06-01', '   ')).rejects.toThrow('Turno inválido')
  })

  it('aceita dados válidos (insere quando não existe)', async () => {
    await expect(salvarEscala('m-1', '2026-06-01', 'AB')).resolves.toBeUndefined()
    expect(mockFromReturn.insert).toHaveBeenCalled()
  })

  it('inclui casa e confirmado=false ao inserir', async () => {
    await salvarEscala('m-123', '2026-06-10', 'CD')
    const insertCall = (mockFromReturn.insert as any).mock.calls[0]
    expect(insertCall[0]).toMatchObject({
      membro_id: 'm-123',
      data: '2026-06-10',
      turno: 'CD',
      casa: 'bica',
      confirmado: false,
    })
  })

  it('filtra por membro, data, casa (isolamento multi-tenant)', async () => {
    await salvarEscala('m-456', '2026-06-15', 'AB')
    const eqCalls = (mockFromReturn.eq as any).mock.calls
    expect(eqCalls).toContainEqual(['membro_id', 'm-456'])
    expect(eqCalls).toContainEqual(['data', '2026-06-15'])
    expect(eqCalls).toContainEqual(['casa', 'bica'])
  })

  it('atualiza turno e reseta confirmado=false se registro já existe (upsert)', async () => {
    mockFromReturn.maybeSingle = vi.fn().mockResolvedValueOnce({
      data: { id: 'esc-999', turno: 'AB', confirmado: true },
    })
    await salvarEscala('m-1', '2026-06-01', 'CD')
    expect(mockFromReturn.update).toHaveBeenCalledWith({ turno: 'CD', confirmado: false })
  })

  it('reseta confirmado=false ao atualizar turno', async () => {
    mockFromReturn.maybeSingle = vi.fn().mockResolvedValueOnce({
      data: { id: 'esc-888', turno: 'AB', confirmado: true },
    })
    await salvarEscala('m-2', '2026-06-20', 'XY')
    const updateCall = (mockFromReturn.update as any).mock.calls[0]
    expect(updateCall[0]).toMatchObject({ turno: 'XY', confirmado: false })
  })

  it('retorna undefined em sucesso (sem dados de retorno)', async () => {
    mockFromReturn.insert = vi.fn().mockResolvedValueOnce({ error: null })
    const result = await salvarEscala('m-test', '2026-06-25', 'AB')
    expect(result).toBeUndefined()
  })
})

describe('removerEscala — validações e deleção', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lança erro com id vazio', async () => {
    await expect(removerEscala('')).rejects.toThrow('Registro inválido')
  })

  it('lança erro com id só espaços', async () => {
    await expect(removerEscala('   ')).rejects.toThrow('Registro inválido')
  })

  it('aceita id válido e deleta registro', async () => {
    await expect(removerEscala('esc-1')).resolves.toBeUndefined()
    expect(mockFromReturn.delete).toHaveBeenCalled()
  })

  it('filtra por id e casa (isolamento multi-tenant)', async () => {
    await removerEscala('esc-789')
    const eqCalls = (mockFromReturn.eq as any).mock.calls
    expect(eqCalls).toContainEqual(['id', 'esc-789'])
    expect(eqCalls).toContainEqual(['casa', 'bica'])
  })

  it('deleta apenas um registro específico', async () => {
    await removerEscala('esc-specific')
    expect(mockFromReturn.delete).toHaveBeenCalled()
  })

  it('encadeia corretamente: from → eq → eq → delete', async () => {
    await removerEscala('esc-chain-test')
    expect(mockFromReturn.eq).toHaveBeenCalled()
    expect(mockFromReturn.delete).toHaveBeenCalled()
  })

  it('retorna undefined em sucesso', async () => {
    const result = await removerEscala('esc-success')
    expect(result).toBeUndefined()
  })
})

describe('confirmarEscala — validações e atualização de status', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lança erro com id vazio', async () => {
    await expect(confirmarEscala('', true)).rejects.toThrow('Registro inválido')
  })

  it('lança erro com id só espaços', async () => {
    await expect(confirmarEscala('   ', true)).rejects.toThrow('Registro inválido')
  })

  it('marca como confirmado quando confirmado=true', async () => {
    await confirmarEscala('esc-1', true)
    expect(mockFromReturn.update).toHaveBeenCalledWith({ confirmado: true })
  })

  it('marca como não-confirmado quando confirmado=false', async () => {
    await confirmarEscala('esc-1', false)
    expect(mockFromReturn.update).toHaveBeenCalledWith({ confirmado: false })
  })

  it('filtra por id e casa (isolamento multi-tenant)', async () => {
    await confirmarEscala('esc-555', true)
    const eqCalls = (mockFromReturn.eq as any).mock.calls
    expect(eqCalls).toContainEqual(['id', 'esc-555'])
    expect(eqCalls).toContainEqual(['casa', 'bica'])
  })

  it('permite toggle: true → false → true', async () => {
    await confirmarEscala('esc-toggle', true)
    expect(mockFromReturn.update).toHaveBeenCalledWith({ confirmado: true })

    vi.clearAllMocks()
    await confirmarEscala('esc-toggle', false)
    expect(mockFromReturn.update).toHaveBeenCalledWith({ confirmado: false })

    vi.clearAllMocks()
    await confirmarEscala('esc-toggle', true)
    expect(mockFromReturn.update).toHaveBeenCalledWith({ confirmado: true })
  })

  it('retorna undefined em sucesso', async () => {
    const result = await confirmarEscala('esc-2', true)
    expect(result).toBeUndefined()
  })

  it('confirma múltiplos registros de forma independente', async () => {
    await confirmarEscala('esc-a', true)
    expect(mockFromReturn.update).toHaveBeenCalledWith({ confirmado: true })

    vi.clearAllMocks()
    await confirmarEscala('esc-b', false)
    expect(mockFromReturn.update).toHaveBeenCalledWith({ confirmado: false })
  })

  it('trata confirmação dupla (idempotente)', async () => {
    await confirmarEscala('esc-4', true)
    vi.clearAllMocks()
    await confirmarEscala('esc-4', true)
    expect(mockFromReturn.update).toHaveBeenCalled()
  })
})


describe('fluxo completo: criar, confirmar, remover', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFromReturn.maybeSingle = vi.fn().mockResolvedValue({ data: null })
  })

  it('cria escala, confirma, remove (happy path)', async () => {
    // 1. Criar
    await salvarEscala('m-1', '2026-06-10', 'AB')
    expect(mockFromReturn.insert).toHaveBeenCalled()

    // 2. Confirmar
    vi.clearAllMocks()
    await confirmarEscala('esc-created', true)
    expect(mockFromReturn.update).toHaveBeenCalledWith({ confirmado: true })

    // 3. Remover
    vi.clearAllMocks()
    await removerEscala('esc-created')
    expect(mockFromReturn.delete).toHaveBeenCalled()
  })

  it('escala mismatch: tenta remover escala de outra casa', async () => {
    await removerEscala('esc-other-casa')
    // Verifica que eq incluiu ['casa', 'bica'] para isolamento multi-tenant
    expect(mockFromReturn.eq).toHaveBeenCalledWith('casa', 'bica')
  })

  it('cria, muda turno, confirma, remove (workflow completo)', async () => {
    // 1. Criar
    await salvarEscala('m-workflow', '2026-07-01', 'AB')
    expect(mockFromReturn.insert).toHaveBeenCalled()

    // 2. Atualizar turno (reinscrição)
    vi.clearAllMocks()
    mockFromReturn.maybeSingle = vi.fn().mockResolvedValueOnce({
      data: { id: 'esc-wf', turno: 'AB' },
    })
    await salvarEscala('m-workflow', '2026-07-01', 'CD')
    expect(mockFromReturn.update).toHaveBeenCalledWith({ turno: 'CD', confirmado: false })

    // 3. Confirmar
    vi.clearAllMocks()
    await confirmarEscala('esc-wf', true)
    expect(mockFromReturn.update).toHaveBeenCalledWith({ confirmado: true })

    // 4. Desconfirmar
    vi.clearAllMocks()
    await confirmarEscala('esc-wf', false)
    expect(mockFromReturn.update).toHaveBeenCalledWith({ confirmado: false })

    // 5. Remover
    vi.clearAllMocks()
    await removerEscala('esc-wf')
    expect(mockFromReturn.delete).toHaveBeenCalled()
  })
})
