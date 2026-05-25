'use server'

import { revalidatePath } from 'next/cache'
import { requireUser } from '@/lib/auth-guard'

export async function salvarEscala(membroId: string, data: string, turno: string) {
  if (!membroId?.trim()) throw new Error('Membro inválido')
  if (!data?.trim()) throw new Error('Data inválida')
  if (!turno?.trim()) throw new Error('Turno inválido')

  const { supabase, casa } = await requireUser()

  const { data: existing } = await supabase
    .from('escala')
    .select('id')
    .eq('membro_id', membroId)
    .eq('data', data)
    .eq('casa', casa)
    .maybeSingle()

  if (existing) {
    await supabase
      .from('escala')
      .update({ turno, confirmado: false })
      .eq('id', existing.id)
      .eq('casa', casa)
  } else {
    await supabase
      .from('escala')
      .insert({ membro_id: membroId, data, turno, confirmado: false, casa })
  }

  revalidatePath('/escala')
}

export async function removerEscala(id: string) {
  if (!id?.trim()) throw new Error('Registro inválido')

  const { supabase, casa } = await requireUser()
  await supabase.from('escala').delete().eq('id', id).eq('casa', casa)
  revalidatePath('/escala')
}
