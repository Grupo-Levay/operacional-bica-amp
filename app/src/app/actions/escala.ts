'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function salvarEscala(membroId: string, data: string, turno: string) {
  const supabase = await createClient()

  const { data: existing } = await supabase
    .from('escala')
    .select('id')
    .eq('membro_id', membroId)
    .eq('data', data)
    .maybeSingle()

  if (existing) {
    await supabase
      .from('escala')
      .update({ turno, confirmado: false })
      .eq('id', existing.id)
  } else {
    await supabase
      .from('escala')
      .insert({ membro_id: membroId, data, turno, confirmado: false })
  }

  revalidatePath('/escala')
}

export async function removerEscala(id: string) {
  const supabase = await createClient()
  await supabase.from('escala').delete().eq('id', id)
  revalidatePath('/escala')
}
