'use server'

import { revalidatePath } from 'next/cache'
import { requireUser } from '@/lib/auth-guard'

export async function marcarItemChecklist(
  checklistId: string,
  itemNome: string,
  marcar: boolean,
) {
  if (!checklistId?.trim()) throw new Error('Checklist inválido')
  if (!itemNome?.trim()) throw new Error('Item inválido')

  const { supabase, casa } = await requireUser()
  const hoje = new Date().toISOString().split('T')[0]

  const { data: checklist } = await supabase
    .from('checklists')
    .select('itens, turno')
    .eq('id', checklistId)
    .eq('casa', casa)
    .maybeSingle()

  const totalItens = Array.isArray(checklist?.itens) ? checklist.itens.length : 0

  const { data: existente } = await supabase
    .from('checklist_registros')
    .select('*')
    .eq('checklist_id', checklistId)
    .eq('casa', casa)
    .eq('data', hoje)
    .maybeSingle()

  if (existente) {
    const itensConcluidos = Array.isArray(existente.itens_concluidos)
      ? (existente.itens_concluidos as string[])
      : []

    const novosItens = marcar
      ? [...new Set([...itensConcluidos, itemNome])]
      : itensConcluidos.filter((i) => i !== itemNome)

    const concluido = totalItens > 0 && novosItens.length >= totalItens

    await supabase
      .from('checklist_registros')
      .update({ itens_concluidos: novosItens, concluido })
      .eq('id', existente.id)
      .eq('casa', casa)
  } else {
    const novosItens = marcar ? [itemNome] : []
    const concluido = totalItens > 0 && novosItens.length >= totalItens

    await supabase.from('checklist_registros').insert({
      checklist_id: checklistId,
      data: hoje,
      turno: checklist?.turno ?? 'abertura',
      itens_concluidos: novosItens,
      concluido,
      casa,
    })
  }

  revalidatePath('/checklists')
  revalidatePath(`/checklists/${checklistId}`)
}

export async function reabrirChecklist(checklistId: string) {
  if (!checklistId?.trim()) throw new Error('Checklist inválido')

  const { supabase, casa } = await requireUser()
  const hoje = new Date().toISOString().split('T')[0]

  await supabase
    .from('checklist_registros')
    .update({ itens_concluidos: [], concluido: false })
    .eq('checklist_id', checklistId)
    .eq('casa', casa)
    .eq('data', hoje)

  revalidatePath('/checklists')
  revalidatePath(`/checklists/${checklistId}`)
}
