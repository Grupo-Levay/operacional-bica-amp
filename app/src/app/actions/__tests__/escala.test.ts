import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/auth-guard', () => ({
  requireUser: vi.fn().mockResolvedValue({
    supabase: {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null }),
        update: vi.fn().mockReturnThis(),
        insert: vi.fn().mockResolvedValue({ error: null }),
        delete: vi.fn().mockReturnThis(),
      }),
    },
    casa: 'bica',
    userId: 'user-1',
  }),
}))

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

import { salvarEscala, removerEscala } from '../escala'

describe('salvarEscala — validações', () => {
  it('lança erro com membroId vazio', async () => {
    await expect(salvarEscala('', '2026-06-01', 'AB')).rejects.toThrow('Membro inválido')
  })

  it('lança erro com data vazia', async () => {
    await expect(salvarEscala('m-1', '', 'AB')).rejects.toThrow('Data inválida')
  })

  it('lança erro com turno vazio', async () => {
    await expect(salvarEscala('m-1', '2026-06-01', '   ')).rejects.toThrow('Turno inválido')
  })

  it('aceita dados válidos (insere quando não existe)', async () => {
    await expect(salvarEscala('m-1', '2026-06-01', 'AB')).resolves.toBeUndefined()
  })
})

describe('removerEscala — validações', () => {
  it('lança erro com id vazio', async () => {
    await expect(removerEscala('')).rejects.toThrow('Registro inválido')
  })

  it('aceita id válido', async () => {
    await expect(removerEscala('esc-1')).resolves.toBeUndefined()
  })
})
