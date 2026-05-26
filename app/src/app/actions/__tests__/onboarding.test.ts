import { describe, it, expect, vi } from 'vitest'

const { updateMock, eqMock } = vi.hoisted(() => ({
  updateMock: vi.fn().mockReturnThis(),
  eqMock: vi.fn().mockResolvedValue({ error: null }),
}))

vi.mock('@/lib/auth-guard', () => ({
  requireUser: vi.fn().mockResolvedValue({
    supabase: {
      from: vi.fn().mockReturnValue({ update: updateMock, eq: eqMock }),
    },
    casa: 'bica',
    userId: 'user-1',
  }),
}))

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

import { concluirOnboarding } from '../onboarding'

describe('concluirOnboarding', () => {
  it('marca onboarding como concluído para o usuário autenticado', async () => {
    await expect(concluirOnboarding()).resolves.toBeUndefined()
    expect(updateMock).toHaveBeenCalledWith({ onboarding_completo: true })
    expect(eqMock).toHaveBeenCalledWith('id', 'user-1')
  })
})
