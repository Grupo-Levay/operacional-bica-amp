import { describe, it, expect, vi, beforeEach } from 'vitest'

// Query builder encadeável: select().eq().single() e update().eq()
const single = vi.fn()
const eqUpdate = vi.fn().mockResolvedValue({ error: null })
const update = vi.fn(() => ({ eq: eqUpdate }))
const eqSelect = vi.fn(() => ({ single }))
const select = vi.fn(() => ({ eq: eqSelect }))
const from = vi.fn(() => ({ select, update }))
const getUser = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({ auth: { getUser }, from })),
}))
vi.mock('@/lib/tenant', () => ({ getCurrentCasa: vi.fn() }))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

import { atualizarRole, vincularPerfilEquipe } from '../admin'
import { getCurrentCasa } from '@/lib/tenant'

describe('atualizarRole — validações', () => {
  it('lança erro com userId vazio', async () => {
    await expect(atualizarRole('', 'admin')).rejects.toThrow('Usuário inválido')
  })

  it('lança erro com role inválido', async () => {
    // @ts-expect-error — validando rejeição de role não permitido em runtime
    await expect(atualizarRole('u-1', 'hacker')).rejects.toThrow('Role inválido')
  })
})

describe('atualizarRole — isolamento multi-tenant', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    eqUpdate.mockResolvedValue({ error: null })
  })

  it('bloqueia admin alterando usuário de outra casa', async () => {
    getUser.mockResolvedValue({ data: { user: { id: 'admin-1' } } })
    single
      .mockResolvedValueOnce({ data: { role: 'admin' } }) // meu perfil
      .mockResolvedValueOnce({ data: { casas: ['amp'] } }) // alvo: só AMP
    vi.mocked(getCurrentCasa).mockResolvedValue('bica')

    await expect(atualizarRole('alvo-1', 'estoque')).rejects.toThrow(
      'Sem permissão para alterar este usuário'
    )
    expect(update).not.toHaveBeenCalled()
  })

  it('permite admin alterar usuário da própria casa', async () => {
    getUser.mockResolvedValue({ data: { user: { id: 'admin-1' } } })
    single
      .mockResolvedValueOnce({ data: { role: 'admin' } })
      .mockResolvedValueOnce({ data: { casas: ['bica', 'amp'] } })
    vi.mocked(getCurrentCasa).mockResolvedValue('bica')

    await atualizarRole('alvo-1', 'estoque')
    expect(update).toHaveBeenCalledWith({ role: 'estoque' })
  })

  it('super_admin altera qualquer usuário sem checar casa', async () => {
    getUser.mockResolvedValue({ data: { user: { id: 'super-1' } } })
    single.mockResolvedValueOnce({ data: { role: 'super_admin' } })

    await atualizarRole('alvo-1', 'admin')
    expect(getCurrentCasa).not.toHaveBeenCalled()
    expect(update).toHaveBeenCalledWith({ role: 'admin' })
  })
})

describe('vincularPerfilEquipe — validações e permissão', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lança erro com perfilId vazio', async () => {
    await expect(vincularPerfilEquipe('', 'eq-1')).rejects.toThrow('Usuário inválido')
  })

  it('lança erro quando não autenticado', async () => {
    getUser.mockResolvedValue({ data: { user: null } })
    await expect(vincularPerfilEquipe('p-1', 'eq-1')).rejects.toThrow('Não autenticado')
  })

  it('bloqueia usuário sem permissão de admin', async () => {
    getUser.mockResolvedValue({ data: { user: { id: 'u-1' } } })
    single.mockResolvedValueOnce({ data: { role: 'bar' } })
    await expect(vincularPerfilEquipe('p-1', 'eq-1')).rejects.toThrow('Sem permissão')
    expect(update).not.toHaveBeenCalled()
  })
})
