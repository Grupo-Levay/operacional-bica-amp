import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/auth-guard', () => ({
  requireUser: vi.fn().mockResolvedValue({
    supabase: {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { nome: 'Equipe' } }),
        insert: vi.fn().mockResolvedValue({ error: null }),
        update: vi.fn().mockReturnThis(),
      }),
    },
    casa: 'bica',
    userId: 'user-1',
  }),
}))

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

import { criarReserva } from '../reservas'

const base = {
  customerName: 'João',
  reservationDate: '2026-06-01',
  startTime: '19:00',
  endTime: '21:00',
  guestCount: 2,
}

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
