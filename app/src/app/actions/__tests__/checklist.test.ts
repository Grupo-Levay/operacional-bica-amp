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
      }),
    },
    casa: 'bica',
    userId: 'user-1',
  }),
}))

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

import { marcarItemChecklist, reabrirChecklist } from '../checklist'

describe('marcarItemChecklist — validações', () => {
  it('lança erro com checklistId vazio', async () => {
    await expect(marcarItemChecklist('', 'Limpeza', true)).rejects.toThrow('Checklist inválido')
  })

  it('lança erro com itemNome vazio', async () => {
    await expect(marcarItemChecklist('cl-1', '', true)).rejects.toThrow('Item inválido')
  })

  it('lança erro com checklistId só espaços', async () => {
    await expect(marcarItemChecklist('   ', 'Limpeza', true)).rejects.toThrow('Checklist inválido')
  })
})

describe('reabrirChecklist — validações', () => {
  it('lança erro com checklistId vazio', async () => {
    await expect(reabrirChecklist('')).rejects.toThrow('Checklist inválido')
  })
})
