import { describe, it, expect, vi } from 'vitest'

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

function makeSupabase(statusAtual: string, updateError: null | { message: string } = null) {
  return {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { status: statusAtual } }),
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: updateError }),
        }),
      }),
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      }),
      insert: vi.fn().mockResolvedValue({ error: null }),
    }),
  }
}

vi.mock('@/lib/auth-guard', () => ({
  requireUser: vi.fn(),
}))

import { moverTarefa, atribuirTarefa, excluirTarefa } from '../tarefas'
import { requireUser } from '@/lib/auth-guard'

const VALID_UUID = 'a6b6520c-caf9-4fb5-8bee-ec314abcd5f6'
const PERFIL_UUID = '08208127-40bd-406e-acaa-935675bbab90'

function mockAuth(statusAtual = 'a_fazer') {
  vi.mocked(requireUser).mockResolvedValue({
    supabase: makeSupabase(statusAtual) as never,
    casa: 'bica',
    userId: 'user-1',
  })
}

describe('moverTarefa — validação de input', () => {
  it('rejeita id não-uuid', async () => {
    mockAuth()
    const res = await moverTarefa('not-a-uuid', 'fazendo')
    expect(res).toEqual({ error: 'Dados inválidos.' })
  })

  it('rejeita status inválido', async () => {
    mockAuth()
    // @ts-expect-error teste proposital
    const res = await moverTarefa(VALID_UUID, 'invalido')
    expect(res).toEqual({ error: 'Dados inválidos.' })
  })
})

describe('moverTarefa — máquina de estados', () => {
  it('rejeita transição proibida a_fazer → concluida', async () => {
    mockAuth('a_fazer')
    const res = await moverTarefa(VALID_UUID, 'concluida')
    expect(res?.error).toMatch(/Transição/)
  })

  it('permite transição a_fazer → fazendo', async () => {
    mockAuth('a_fazer')
    const res = await moverTarefa(VALID_UUID, 'fazendo')
    expect(res).toEqual({ ok: true })
  })

  it('permite transição fazendo → concluida', async () => {
    mockAuth('fazendo')
    const res = await moverTarefa(VALID_UUID, 'concluida')
    expect(res).toEqual({ ok: true })
  })

  it('permite retroceder fazendo → a_fazer', async () => {
    mockAuth('fazendo')
    const res = await moverTarefa(VALID_UUID, 'a_fazer')
    expect(res).toEqual({ ok: true })
  })
})

describe('atribuirTarefa — validações', () => {
  it('rejeita perfil_id inválido (não-uuid)', async () => {
    mockAuth()
    const res = await atribuirTarefa(VALID_UUID, 'nao-uuid')
    expect(res).toEqual({ error: 'perfil_id inválido.' })
  })

  it('aceita null como perfil_id (desatribuir)', async () => {
    vi.mocked(requireUser).mockResolvedValue({
      supabase: makeSupabase('a_fazer') as never,
      casa: 'bica',
      userId: 'user-1',
    })
    const res = await atribuirTarefa(VALID_UUID, null)
    expect(res).toEqual({ ok: true })
  })

  it('aceita uuid válido como perfil_id', async () => {
    vi.mocked(requireUser).mockResolvedValue({
      supabase: makeSupabase('a_fazer') as never,
      casa: 'bica',
      userId: 'user-1',
    })
    const res = await atribuirTarefa(VALID_UUID, PERFIL_UUID)
    expect(res).toEqual({ ok: true })
  })
})

describe('excluirTarefa — validações', () => {
  it('rejeita id não-uuid', async () => {
    mockAuth()
    const res = await excluirTarefa('nao-uuid')
    expect(res).toEqual({ error: 'ID inválido.' })
  })

  it('aceita uuid válido', async () => {
    vi.mocked(requireUser).mockResolvedValue({
      supabase: makeSupabase('a_fazer') as never,
      casa: 'bica',
      userId: 'user-1',
    })
    const res = await excluirTarefa(VALID_UUID)
    expect(res).toEqual({ ok: true })
  })
})
