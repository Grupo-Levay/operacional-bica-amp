import { describe, it, expect, vi } from 'vitest'

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

function makeSupabase(insertError: null | { message: string } = null) {
  return {
    from: vi.fn().mockReturnValue({
      insert: vi.fn().mockResolvedValue({ error: insertError }),
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      }),
    }),
  }
}

vi.mock('@/lib/auth-guard', () => ({
  requireUser: vi.fn(),
}))

import { criarMeta, atualizarProgresso, arquivarMeta } from '../metas'
import { requireUser } from '@/lib/auth-guard'

const VALID_UUID = 'a6b6520c-caf9-4fb5-8bee-ec314abcd5f6'

function mockAuth() {
  vi.mocked(requireUser).mockResolvedValue({
    supabase: makeSupabase() as never,
    casa: 'bica',
    userId: 'user-1',
  })
}

describe('criarMeta — validações', () => {
  it('rejeita sem titulo', async () => {
    mockAuth()
    const fd = new FormData()
    fd.set('alvo', '100')
    fd.set('periodo_ref', '2026-06')
    fd.set('perfil_id', VALID_UUID)
    const res = await criarMeta(fd)
    expect(res).toEqual({ error: 'Dados inválidos.' })
  })

  it('rejeita individual sem perfil_id', async () => {
    mockAuth()
    const fd = new FormData()
    fd.set('titulo', 'Meta teste')
    fd.set('escopo', 'individual')
    fd.set('alvo', '100')
    fd.set('periodo_ref', '2026-06')
    const res = await criarMeta(fd)
    expect(res).toEqual({ error: 'Selecione um membro para meta individual.' })
  })

  it('aceita escopo equipe sem perfil_id', async () => {
    mockAuth()
    const fd = new FormData()
    fd.set('titulo', 'Meta equipe')
    fd.set('escopo', 'equipe')
    fd.set('alvo', '500')
    fd.set('periodo_ref', '2026-06')
    const res = await criarMeta(fd)
    expect(res).toEqual({ ok: true })
  })

  it('aceita individual com perfil_id válido', async () => {
    mockAuth()
    const fd = new FormData()
    fd.set('titulo', 'Meta individual')
    fd.set('escopo', 'individual')
    fd.set('perfil_id', VALID_UUID)
    fd.set('alvo', '50')
    fd.set('periodo_ref', '2026-06')
    const res = await criarMeta(fd)
    expect(res).toEqual({ ok: true })
  })
})

describe('atualizarProgresso — validações', () => {
  it('rejeita id inválido', async () => {
    mockAuth()
    const res = await atualizarProgresso('nao-uuid', 50)
    expect(res).toEqual({ error: 'Dados inválidos.' })
  })

  it('rejeita atual negativo', async () => {
    mockAuth()
    const res = await atualizarProgresso(VALID_UUID, -1)
    expect(res).toEqual({ error: 'Dados inválidos.' })
  })

  it('aceita progresso válido', async () => {
    mockAuth()
    const res = await atualizarProgresso(VALID_UUID, 75)
    expect(res).toEqual({ ok: true })
  })
})

describe('arquivarMeta — validações', () => {
  it('rejeita id não-uuid', async () => {
    mockAuth()
    const res = await arquivarMeta('nao-uuid')
    expect(res).toEqual({ error: 'ID inválido.' })
  })

  it('aceita uuid válido', async () => {
    mockAuth()
    const res = await arquivarMeta(VALID_UUID)
    expect(res).toEqual({ ok: true })
  })
})
