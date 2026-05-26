import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

import { atualizarRole } from '../admin'

describe('atualizarRole — validações', () => {
  it('lança erro com userId vazio', async () => {
    await expect(atualizarRole('', 'admin')).rejects.toThrow('Usuário inválido')
  })

  it('lança erro com role inválido', async () => {
    // @ts-expect-error — validando rejeição de role não permitido em runtime
    await expect(atualizarRole('u-1', 'hacker')).rejects.toThrow('Role inválido')
  })
})
