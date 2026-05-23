'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function concluirOnboarding(): Promise<{ error: string } | void> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { error: 'Usuário não autenticado.' }
    }

    const { error } = await supabase
      .from('perfis')
      .update({ onboarding_completo: true })
      .eq('id', user.id)

    if (error) {
      return { error: 'Não foi possível concluir o onboarding. Tente novamente.' }
    }

    revalidatePath('/', 'layout')
  } catch {
    return { error: 'Erro interno. Tente novamente.' }
  }
}
