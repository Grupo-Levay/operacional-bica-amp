'use server'

import { revalidatePath } from 'next/cache'
import { requireUser } from '@/lib/auth-guard'

export async function concluirOnboarding() {
  const { supabase, userId } = await requireUser()

  await supabase
    .from('perfis')
    .update({ onboarding_completo: true })
    .eq('id', userId)

  revalidatePath('/', 'layout')
}
