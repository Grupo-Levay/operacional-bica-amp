'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function concluirOnboarding() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('perfis')
    .update({ onboarding_completo: true })
    .eq('id', user.id)

  revalidatePath('/', 'layout')
}
