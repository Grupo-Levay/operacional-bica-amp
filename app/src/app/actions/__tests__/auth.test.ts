import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockSignInWithPassword, mockResetPasswordForEmail, mockUpdateUser } = vi.hoisted(() => ({
  mockSignInWithPassword: vi.fn(),
  mockResetPasswordForEmail: vi.fn(),
  mockUpdateUser: vi.fn(),
}))

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: {
      signInWithPassword: mockSignInWithPassword,
      resetPasswordForEmail: mockResetPasswordForEmail,
      updateUser: mockUpdateUser,
      signOut: vi.fn().mockResolvedValue({}),
    },
  }),
}))

vi.mock('next/navigation', () => ({ redirect: vi.fn() }))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))
vi.mock('@/lib/tenant', () => ({ setCurrentCasa: vi.fn() }))

import { signIn, updatePassword, resetPassword } from '../auth'

describe('signIn', () => {
  beforeEach(() => vi.clearAllMocks())

  it('retorna erro quando Supabase falha', async () => {
    mockSignInWithPassword.mockResolvedValue({ error: { message: 'Invalid credentials' } })
    const fd = new FormData()
    fd.append('email', 'x@x.com')
    fd.append('password', 'wrong')
    const result = await signIn(null, fd)
    expect(result).toEqual({ error: 'E-mail ou senha incorretos.' })
  })
})

describe('updatePassword', () => {
  beforeEach(() => vi.clearAllMocks())

  it('retorna erro quando senhas não coincidem', async () => {
    const fd = new FormData()
    fd.append('password', 'senha123')
    fd.append('confirm', 'senha456')
    const result = await updatePassword(null, fd)
    expect(result).toEqual({ error: 'As senhas não coincidem.' })
  })

  it('retorna erro quando senha tem menos de 8 caracteres', async () => {
    const fd = new FormData()
    fd.append('password', 'abc')
    fd.append('confirm', 'abc')
    const result = await updatePassword(null, fd)
    expect(result).toEqual({ error: 'A senha deve ter pelo menos 8 caracteres.' })
  })
})

describe('resetPassword', () => {
  beforeEach(() => vi.clearAllMocks())

  it('retorna sucesso quando Supabase não retorna erro', async () => {
    mockResetPasswordForEmail.mockResolvedValue({ error: null })
    const fd = new FormData()
    fd.append('email', 'user@bica.com')
    const result = await resetPassword(null, fd)
    expect(result).toEqual({ error: '', success: true })
  })

  it('retorna erro quando Supabase falha', async () => {
    mockResetPasswordForEmail.mockResolvedValue({ error: { message: 'fail' } })
    const fd = new FormData()
    fd.append('email', 'user@bica.com')
    const result = await resetPassword(null, fd)
    expect(result.success).toBe(false)
    expect(result.error).toBeTruthy()
  })
})
