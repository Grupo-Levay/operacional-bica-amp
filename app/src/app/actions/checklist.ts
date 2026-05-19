'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

type ToggleParams = {
  checklistId: string
  turno: string
  casa: string
  item: string
  completed: boolean
  currentConcluidos: string[]
  allDone: boolean
}

export async function toggleChecklistItem(params: ToggleParams) {
  const { checklistId, turno, casa, currentConcluidos, allDone } = params
  const supabase = await createClient()
  const hoje = new Date().toISOString().split('T')[0]

  const { data: existing } = await supabase
    .from('checklist_registros')
    .select('id')
    .eq('checklist_id', checklistId)
    .eq('casa', casa)
    .eq('data', hoje)
    .maybeSingle()

  if (existing) {
    await supabase
      .from('checklist_registros')
      .update({ itens_concluidos: currentConcluidos, concluido: allDone })
      .eq('id', existing.id)
  } else {
    await supabase.from('checklist_registros').insert({
      checklist_id: checklistId,
      casa,
      turno,
      data: hoje,
      itens_concluidos: currentConcluidos,
      concluido: allDone,
    })
  }

  revalidatePath(`/checklists/${checklistId}`)
  revalidatePath('/checklists')
  revalidatePath('/dashboard')
}
