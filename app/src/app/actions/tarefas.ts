'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireUser } from '@/lib/auth-guard'

// Status válidos e transições permitidas (máquina de estados)
export type TarefaStatus = 'a_fazer' | 'fazendo' | 'concluida'
export type TarefaPrioridade = 'baixa' | 'media' | 'alta'

const TRANSICOES: Record<TarefaStatus, TarefaStatus[]> = {
  a_fazer: ['fazendo'],
  fazendo: ['a_fazer', 'concluida'],
  concluida: ['fazendo'],
}

const criarSchema = z.object({
  titulo: z.string().min(1).max(200),
  descricao: z.string().max(1000).optional(),
  perfil_id: z.string().uuid().optional(),
  prioridade: z.enum(['baixa', 'media', 'alta']).default('media'),
  prazo: z.string().optional(),
})

const moverSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['a_fazer', 'fazendo', 'concluida']),
})

export async function criarTarefa(formData: FormData) {
  const { supabase, casa, userId } = await requireUser()

  const parsed = criarSchema.safeParse({
    titulo: formData.get('titulo'),
    descricao: formData.get('descricao') || undefined,
    perfil_id: formData.get('perfil_id') || undefined,
    prioridade: formData.get('prioridade') || 'media',
    prazo: formData.get('prazo') || undefined,
  })
  if (!parsed.success) return { error: 'Dados inválidos.' }

  const { error } = await supabase.from('tarefas').insert({
    casa,
    titulo: parsed.data.titulo,
    descricao: parsed.data.descricao ?? null,
    perfil_id: parsed.data.perfil_id ?? null,
    prioridade: parsed.data.prioridade,
    prazo: parsed.data.prazo ?? null,
    created_by: userId,
  })

  if (error) return { error: 'Erro ao criar tarefa.' }
  revalidatePath('/admin/tarefas')
  revalidatePath('/perfil')
  return { ok: true }
}

export async function moverTarefa(id: string, novoStatus: TarefaStatus) {
  const { supabase, casa } = await requireUser()

  const parsed = moverSchema.safeParse({ id, status: novoStatus })
  if (!parsed.success) return { error: 'Dados inválidos.' }

  // Busca status atual
  const { data: tarefa } = await supabase
    .from('tarefas')
    .select('status')
    .eq('id', id)
    .eq('casa', casa)
    .single()

  if (!tarefa) return { error: 'Tarefa não encontrada.' }

  const statusAtual = tarefa.status as TarefaStatus
  if (!TRANSICOES[statusAtual].includes(novoStatus)) {
    return { error: `Transição ${statusAtual} → ${novoStatus} não permitida.` }
  }

  const { error } = await supabase
    .from('tarefas')
    .update({ status: novoStatus })
    .eq('id', id)
    .eq('casa', casa)

  if (error) return { error: 'Erro ao mover tarefa.' }
  revalidatePath('/admin/tarefas')
  revalidatePath('/perfil')
  return { ok: true }
}

export async function atribuirTarefa(id: string, perfil_id: string | null) {
  const { supabase, casa } = await requireUser()

  if (perfil_id !== null) {
    const uuidSchema = z.string().uuid()
    if (!uuidSchema.safeParse(perfil_id).success) return { error: 'perfil_id inválido.' }
  }

  const { error } = await supabase
    .from('tarefas')
    .update({ perfil_id })
    .eq('id', id)
    .eq('casa', casa)

  if (error) return { error: 'Erro ao atribuir tarefa.' }
  revalidatePath('/admin/tarefas')
  revalidatePath('/perfil')
  return { ok: true }
}

export async function excluirTarefa(id: string) {
  const { supabase, casa } = await requireUser()

  if (!z.string().uuid().safeParse(id).success) return { error: 'ID inválido.' }

  const { error } = await supabase
    .from('tarefas')
    .delete()
    .eq('id', id)
    .eq('casa', casa)

  if (error) return { error: 'Erro ao excluir tarefa.' }
  revalidatePath('/admin/tarefas')
  revalidatePath('/perfil')
  return { ok: true }
}
