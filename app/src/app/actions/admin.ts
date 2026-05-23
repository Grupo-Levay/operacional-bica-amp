'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Role } from '@/lib/roles'

export async function atualizarRole(userId: string, novoRole: Role) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const { data: meu } = await supabase
    .from('perfis')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!meu || !['super_admin', 'admin'].includes(meu.role)) {
    throw new Error('Sem permissão')
  }

  await supabase
    .from('perfis')
    .update({ role: novoRole })
    .eq('id', userId)

  revalidatePath('/admin')
}
