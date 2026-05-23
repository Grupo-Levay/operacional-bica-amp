'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { setCurrentCasa, type Casa } from '@/lib/tenant'

const signInSchema = z.object({
  email: z.string().email('E-mail inválido.'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
})

const resetPasswordSchema = z.object({
  email: z.string().email('E-mail inválido.'),
})

const updatePasswordSchema = z
  .object({
    password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres.'),
    confirm: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres.'),
  })
  .refine((data) => data.password === data.confirm, {
    message: 'As senhas não coincidem.',
    path: ['confirm'],
  })

export async function signIn(
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string }> {
  const parsed = signInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Dados inválidos.' }
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    })

    if (error) {
      return { error: 'E-mail ou senha incorretos.' }
    }
  } catch {
    return { error: 'Erro interno. Tente novamente.' }
  }

  redirect('/dashboard')
}

export async function signOut() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
  } catch {
    // ignore signout errors
  }
  redirect('/login')
}

export async function resetPassword(
  _prevState: { error: string; success: boolean } | null,
  formData: FormData,
): Promise<{ error: string; success: boolean }> {
  const parsed = resetPasswordSchema.safeParse({
    email: formData.get('email'),
  })

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? 'Dados inválidos.',
      success: false,
    }
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bica-bar-system.vercel.app'}/auth/callback?next=/atualizar-senha`,
    })

    if (error) {
      return { error: 'Não foi possível enviar o e-mail. Verifique o endereço.', success: false }
    }

    return { error: '', success: true }
  } catch {
    return { error: 'Erro interno. Tente novamente.', success: false }
  }
}

export async function setCasaAction(casa: Casa) {
  try {
    await setCurrentCasa(casa)
    revalidatePath('/', 'layout')
  } catch {
    // ignore tenant switch errors
  }
}

export async function updatePassword(
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string }> {
  const parsed = updatePasswordSchema.safeParse({
    password: formData.get('password'),
    confirm: formData.get('confirm'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Dados inválidos.' }
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.updateUser({ password: parsed.data.password })

    if (error) {
      return { error: 'Não foi possível atualizar a senha. Tente novamente.' }
    }
  } catch {
    return { error: 'Erro interno. Tente novamente.' }
  }

  redirect('/dashboard')
}
