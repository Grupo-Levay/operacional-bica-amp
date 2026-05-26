'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Role } from '@/lib/roles'

const ROLES_VALIDOS: Role[] = [
  'super_admin',
  'admin',
  'operacional',
  'estoque',
  'cmv',
  'bar',
]

export async function atualizarRole(userId: string, novoRole: Role) {
  if (!userId?.trim()) throw new Error('Usuário inválido')
  if (!ROLES_VALIDOS.includes(novoRole)) throw new Error('Role inválido')

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
