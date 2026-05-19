'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentCasa } from '@/lib/tenant'
import { getTodayISO } from '@/lib/utils'

type ToggleParams = {
  checklistId: string
  currentConcluidos: string[]
  allDone: boolean
}

export async function toggleChecklistItem(params: ToggleParams) {
  const { checklistId, currentConcluidos, allDone } = params

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // casa sempre derivada do servidor — nunca do cliente
  const casa = await getCurrentCasa()
  const hoje = getTodayISO()

  // busca o turno do checklist no DB (não aceita do cliente)
  const { data: checklist } = await supabase
    .from('checklists')
    .select('turno')
    .eq('id', checklistId)
    .eq('casa', casa)
    .maybeSingle()

  // se checklist não existe nesta casa, aborta silenciosamente
  if (!checklist) return

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
      turno: checklist.turno,
      data: hoje,
      itens_concluidos: currentConcluidos,
      concluido: allDone,
    })
  }

  revalidatePath(`/checklists/${checklistId}`)
  revalidatePath('/checklists')
  revalidatePath('/dashboard')
}
