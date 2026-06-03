'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { setCurrentCasa, type Casa } from '@/lib/tenant'
import { getSiteUrl } from '@/lib/site-url'
import { credentialsSchema, emailSchema, passwordUpdateSchema } from '@/lib/schemas/auth'
import { logger } from '@/lib/logger'

export async function signIn(
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string }> {
  const parsed = credentialsSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })
  if (!parsed.success) {
    return { error: 'E-mail ou senha incorretos.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) {
    return { error: 'E-mail ou senha incorretos.' }
  }

  redirect('/dashboard')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function setCasaAction(casa: Casa) {
  try {
    await setCurrentCasa(casa)
    revalidatePath('/', 'layout')
  } catch (e) {
    logger.error('[auth] setCasaAction error', e)
    throw new Error('Não foi possível trocar de casa.')
  }
}

export async function resetPassword(
  _prevState: { error: string; success: boolean } | null,
  formData: FormData,
): Promise<{ error: string; success: boolean }> {
  const parsed = emailSchema.safeParse(formData.get('email'))
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, success: false }
  }

  const supabase = await createClient()
  const siteUrl = await getSiteUrl()
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: `${siteUrl}/auth/callback?next=/atualizar-senha`,
  })

  if (error) {
    return { error: 'Não foi possível enviar o e-mail. Verifique o endereço.', success: false }
  }

  return { error: '', success: true }
}

export async function updatePassword(
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string }> {
  const parsed = passwordUpdateSchema.safeParse({
    password: formData.get('password'),
    confirm: formData.get('confirm'),
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password })

  if (error) {
    return { error: 'Não foi possível atualizar a senha. Tente novamente.' }
  }

  redirect('/dashboard')
}
