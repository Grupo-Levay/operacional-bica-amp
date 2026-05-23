import { notFound } from 'next/navigation'
import { ChecklistExecutor } from './checklist-executor'
import { createClient } from '@/lib/supabase/server'
import { getCurrentCasa } from '@/lib/tenant'
import { getTodayISO } from '@/lib/utils'

async function getData(id: string, casa: string) {
  const supabase = await createClient()
  const hoje = getTodayISO()

  const [{ data: checklist }, { data: registro }] = await Promise.all([
    supabase.from('checklists').select('*').eq('id', id).eq('casa', casa).single(),
    supabase
      .from('checklist_registros')
      .select('*')
      .eq('checklist_id', id)
      .eq('casa', casa)
      .eq('data', hoje)
      .maybeSingle(),
  ])

  return { checklist, registro }
}

export default async function ChecklistDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const casa = await getCurrentCasa()
  const { checklist, registro } = await getData(id, casa)

  if (!checklist) notFound()

  const itens = Array.isArray(checklist.itens) ? (checklist.itens as string[]) : []
  const itensConcluidos = Array.isArray(registro?.itens_concluidos)
    ? (registro.itens_concluidos as string[])
    : []

  return (
    <ChecklistExecutor
      checklistId={checklist.id}
      nome={checklist.nome}
      turno={checklist.turno}
      itens={itens}
      itensConcluidos={itensConcluidos}
      concluido={registro?.concluido ?? false}
    />
  )
}
