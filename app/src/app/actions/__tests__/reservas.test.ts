import { describe, it, expect, vi, beforeEach } from 'vitest'

const { requireUserMock } = vi.hoisted(() => ({ requireUserMock: vi.fn() }))
vi.mock('@/lib/auth-guard', () => ({ requireUser: requireUserMock }))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

import { criarReserva } from '../reservas'

// Builder Supabase encadeável; thenable para queries de lista (sem .single()).
function makeBuilder({ single, list, insert }: {
  single?: unknown
  list?: unknown
  insert?: unknown
} = {}) {
  const b: Record<string, unknown> = {}
  for (const m of ['select', 'eq', 'neq', 'lt', 'gt', 'update', 'order']) {
    b[m] = vi.fn(() => b)
  }
  b.single = vi.fn().mockResolvedValue(single ?? { data: null })
  b.insert = vi.fn().mockResolvedValue(insert ?? { error: null })
  b.then = (resolve: (v: unknown) => unknown) => resolve(list ?? { data: [] })
  return b
}

function mockSupabase({ mesa, conflitos, perfil }: {
  mesa?: unknown
  conflitos?: unknown[]
  perfil?: unknown
} = {}) {
  const builders: Record<string, ReturnType<typeof makeBuilder>> = {
    bar_tables: makeBuilder({ single: { data: mesa ?? null } }),
    reservations: makeBuilder({ list: { data: conflitos ?? [] }, insert: { error: null } }),
    perfis: makeBuilder({ single: { data: perfil ?? { nome: 'Equipe' } } }),
  }
  return { from: vi.fn((t: string) => builders[t] ?? makeBuilder()) }
}

function setSupabase(opts?: Parameters<typeof mockSupabase>[0]) {
  requireUserMock.mockResolvedValue({
    supabase: mockSupabase(opts),
    casa: 'bica',
    userId: 'user-1',
  })
}

const base = {
  customerName: 'João',
  reservationDate: '2026-06-01',
  startTime: '19:00',
  endTime: '21:00',
  guestCount: 2,
}

beforeEach(() => {
  vi.clearAllMocks()
  setSupabase()
})

describe('criarReserva — validações', () => {
  it('lança erro com customerName vazio', async () => {
    await expect(criarReserva({ ...base, customerName: '' })).rejects.toThrow(
      'Nome do cliente é obrigatório',
    )
  })

  it('lança erro com customerName só espaços', async () => {
    await expect(criarReserva({ ...base, customerName: '   ' })).rejects.toThrow(
      'Nome do cliente é obrigatório',
    )
  })

  it('lança erro sem data', async () => {
    await expect(criarReserva({ ...base, reservationDate: '' })).rejects.toThrow(
      'Data e horários são obrigatórios',
    )
  })

  it('lança erro sem startTime', async () => {
    await expect(criarReserva({ ...base, startTime: '' })).rejects.toThrow(
      'Data e horários são obrigatórios',
    )
  })

  it('lança erro com guestCount menor que 1', async () => {
    await expect(criarReserva({ ...base, guestCount: 0 })).rejects.toThrow(
      'Número de pessoas deve ser ao menos 1',
    )
  })

  it('lança erro quando endTime <= startTime', async () => {
    await expect(criarReserva({ ...base, startTime: '21:00', endTime: '19:00' })).rejects.toThrow(
      'Horário de fim deve ser maior que o de início',
    )
  })

  it('lança erro quando endTime igual a startTime', async () => {
    await expect(criarReserva({ ...base, startTime: '20:00', endTime: '20:00' })).rejects.toThrow(
      'Horário de fim deve ser maior que o de início',
    )
  })
})

describe('criarReserva — mesa: capacidade e colisão', () => {
  it('lança erro quando a mesa não existe ou está inativa', async () => {
    setSupabase({ mesa: null })
    await expect(criarReserva({ ...base, tableId: 't1' })).rejects.toThrow('Mesa indisponível')
  })

  it('lança erro quando guestCount excede a capacidade da mesa', async () => {
    setSupabase({ mesa: { capacity: 4, is_active: true } })
    await expect(
      criarReserva({ ...base, tableId: 't1', guestCount: 6 }),
    ).rejects.toThrow('Mesa comporta no máximo 4 pessoas')
  })

  it('lança erro quando há colisão de horário na mesma mesa', async () => {
    setSupabase({ mesa: { capacity: 4, is_active: true }, conflitos: [{ id: 'r-existente' }] })
    await expect(
      criarReserva({ ...base, tableId: 't1' }),
    ).rejects.toThrow('Já existe uma reserva para esta mesa no horário selecionado')
  })

  it('cria reserva quando a mesa comporta e não há colisão', async () => {
    setSupabase({ mesa: { capacity: 4, is_active: true }, conflitos: [] })
    await expect(criarReserva({ ...base, tableId: 't1' })).resolves.toBeUndefined()
  })
})
