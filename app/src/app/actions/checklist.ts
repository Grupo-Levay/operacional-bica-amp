'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const marcarItemChecklistSchema = z.object({
  checklistId: z.string().uuid('checklistId inválido.'),
  itemNome: z.string().min(1, 'itemNome não pode ser vazio.'),
  marcar: z.boolean(),
})

const reabrirChecklistSchema = z.object({
  checklistId: z.string().uuid('checklistId inválido.'),
})

export async function marcarItemChecklist(
  checklistId: string,
  itemNome: string,
  marcar: boolean,
): Promise<{ error: string } | void> {
  const parsed = marcarItemChecklistSchema.safeParse({ checklistId, itemNome, marcar })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Dados inválidos.' }
  }

  try {
    const supabase = await createClient()
    const hoje = new Date().toISOString().split('T')[0]

    const { data: checklist } = await supabase
      .from('checklists')
      .select('itens, turno')
      .eq('id', parsed.data.checklistId)
      .single()

    const totalItens = Array.isArray(checklist?.itens) ? checklist.itens.length : 0

    const { data: existente } = await supabase
      .from('checklist_registros')
      .select('*')
      .eq('checklist_id', parsed.data.checklistId)
      .eq('data', hoje)
      .maybeSingle()

    if (existente) {
      const itensConcluidos = Array.isArray(existente.itens_concluidos)
        ? (existente.itens_concluidos as string[])
        : []

      const novosItens = parsed.data.marcar
        ? [...new Set([...itensConcluidos, parsed.data.itemNome])]
        : itensConcluidos.filter((i) => i !== parsed.data.itemNome)

      const concluido = totalItens > 0 && novosItens.length >= totalItens

      await supabase
        .from('checklist_registros')
        .update({ itens_concluidos: novosItens, concluido })
        .eq('id', existente.id)
    } else {
      const novosItens = parsed.data.marcar ? [parsed.data.itemNome] : []
      const concluido = totalItens > 0 && novosItens.length >= totalItens

      await supabase.from('checklist_registros').insert({
        checklist_id: parsed.data.checklistId,
        data: hoje,
        turno: checklist?.turno ?? 'abertura',
        itens_concluidos: novosItens,
        concluido,
      })
    }

    revalidatePath('/checklists')
    revalidatePath(`/checklists/${parsed.data.checklistId}`)
  } catch {
    return { error: 'Erro interno. Tente novamente.' }
  }
}

export async function reabrirChecklist(
  checklistId: string,
): Promise<{ error: string } | void> {
  const parsed = reabrirChecklistSchema.safeParse({ checklistId })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Dados inválidos.' }
  }

  try {
    const supabase = await createClient()
    const hoje = new Date().toISOString().split('T')[0]

    await supabase
      .from('checklist_registros')
      .update({ itens_concluidos: [], concluido: false })
      .eq('checklist_id', parsed.data.checklistId)
      .eq('data', hoje)

    revalidatePath('/checklists')
    revalidatePath(`/checklists/${parsed.data.checklistId}`)
  } catch {
    return { error: 'Erro interno. Tente novamente.' }
  }
}
