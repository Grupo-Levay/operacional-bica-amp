'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentCasa } from '@/lib/tenant'
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

  // Isolamento multi-tenant: admin só altera usuários da sua casa.
  // super_admin pode alterar qualquer usuário.
  if (meu.role !== 'super_admin') {
    const casa = await getCurrentCasa()
    const { data: alvo } = await supabase
      .from('perfis')
      .select('casas')
      .eq('id', userId)
      .single()

    if (!alvo || !alvo.casas?.includes(casa)) {
      throw new Error('Sem permissão para alterar este usuário')
    }
  }

  await supabase
    .from('perfis')
    .update({ role: novoRole })
    .eq('id', userId)

  revalidatePath('/admin')
}

/**
 * Vincula (ou desvincula, com equipeId=null) uma conta a um membro da equipe.
 * Mantém 1 conta ↔ 1 membro por casa: limpa o vínculo anterior antes de definir.
 */
export async function vincularPerfilEquipe(perfilId: string, equipeId: string | null) {
  if (!perfilId?.trim()) throw new Error('Usuário inválido')

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const { data: meu } = await supabase
    .from('perfis')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!meu || !['super_admin', 'admin'].includes(meu.role)) {
    throw new Error('Sem permissão')
  }

  const casa = await getCurrentCasa()

  // Limpa qualquer vínculo anterior deste perfil nesta casa.
  await supabase
    .from('equipe')
    .update({ perfil_id: null })
    .eq('perfil_id', perfilId)
    .eq('casa', casa)

  // Define o novo vínculo, se informado.
  if (equipeId) {
    await supabase
      .from('equipe')
      .update({ perfil_id: perfilId })
      .eq('id', equipeId)
      .eq('casa', casa)
  }

  revalidatePath('/admin')
  revalidatePath('/perfil')
}
