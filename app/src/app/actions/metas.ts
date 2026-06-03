'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireUser } from '@/lib/auth-guard'

const criarSchema = z.object({
  titulo: z.string().min(1).max(200),
  descricao: z.string().max(500).optional(),
  escopo: z.enum(['individual', 'equipe']).default('individual'),
  perfil_id: z.string().uuid().optional(),
  alvo: z.coerce.number().positive(),
  unidade: z.string().min(1).max(10).default('un'),
  periodo: z.enum(['semanal', 'mensal', 'trimestral']).default('mensal'),
  periodo_ref: z.string().min(1).max(20),
})

const progressoSchema = z.object({
  id: z.string().uuid(),
  atual: z.coerce.number().min(0),
})

export async function criarMeta(formData: FormData) {
  const { supabase, casa, userId } = await requireUser()

  const raw = {
    titulo: formData.get('titulo'),
    descricao: formData.get('descricao') || undefined,
    escopo: formData.get('escopo') || 'individual',
    perfil_id: formData.get('perfil_id') || undefined,
    alvo: formData.get('alvo'),
    unidade: formData.get('unidade') || 'un',
    periodo: formData.get('periodo') || 'mensal',
    periodo_ref: formData.get('periodo_ref'),
  }

  const parsed = criarSchema.safeParse(raw)
  if (!parsed.success) return { error: 'Dados inválidos.' }

  // escopo individual sem perfil_id → error
  if (parsed.data.escopo === 'individual' && !parsed.data.perfil_id) {
    return { error: 'Selecione um membro para meta individual.' }
  }

  const { error } = await supabase.from('metas').insert({
    casa,
    titulo: parsed.data.titulo,
    descricao: parsed.data.descricao ?? null,
    escopo: parsed.data.escopo,
    perfil_id: parsed.data.escopo === 'equipe' ? null : (parsed.data.perfil_id ?? null),
    alvo: parsed.data.alvo,
    unidade: parsed.data.unidade,
    periodo: parsed.data.periodo,
    periodo_ref: parsed.data.periodo_ref,
    created_by: userId,
  })

  if (error) return { error: 'Erro ao criar meta.' }
  revalidatePath('/admin/metas')
  revalidatePath('/perfil')
  return { ok: true }
}

export async function atualizarProgresso(id: string, atual: number) {
  const { supabase, casa } = await requireUser()

  const parsed = progressoSchema.safeParse({ id, atual })
  if (!parsed.success) return { error: 'Dados inválidos.' }

  const { error } = await supabase
    .from('metas')
    .update({ atual: parsed.data.atual })
    .eq('id', id)
    .eq('casa', casa)

  if (error) return { error: 'Erro ao atualizar progresso.' }
  revalidatePath('/admin/metas')
  revalidatePath('/perfil')
  return { ok: true }
}

export async function arquivarMeta(id: string) {
  const { supabase, casa } = await requireUser()

  if (!z.string().uuid().safeParse(id).success) return { error: 'ID inválido.' }

  const { error } = await supabase
    .from('metas')
    .update({ ativa: false })
    .eq('id', id)
    .eq('casa', casa)

  if (error) return { error: 'Erro ao arquivar meta.' }
  revalidatePath('/admin/metas')
  revalidatePath('/perfil')
  return { ok: true }
}
