'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const abrirRodadaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório.').max(100, 'Nome muito longo.').trim(),
})

const marcarItemCompradoSchema = z.object({
  itemId: z.string().uuid('itemId inválido.'),
  comprado: z.boolean(),
})

const fecharRodadaSchema = z.object({
  rodadaId: z.string().uuid('rodadaId inválido.'),
})

export async function abrirRodada(nome: string): Promise<{ error: string } | void> {
  const parsed = abrirRodadaSchema.safeParse({ nome })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Dados inválidos.' }
  }

  try {
    const supabase = await createClient()
    const hoje = new Date().toISOString().split('T')[0]

    const { error } = await supabase.from('rodadas').insert({
      nome: parsed.data.nome,
      data: hoje,
      status: 'aberta',
      total: 0,
    })

    if (error) {
      return { error: 'Não foi possível abrir a rodada. Tente novamente.' }
    }

    revalidatePath('/compras')
  } catch {
    return { error: 'Erro interno. Tente novamente.' }
  }
}

export async function marcarItemComprado(
  itemId: string,
  comprado: boolean,
): Promise<{ error: string } | void> {
  const parsed = marcarItemCompradoSchema.safeParse({ itemId, comprado })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Dados inválidos.' }
  }

  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('rodada_itens')
      .update({ comprado: parsed.data.comprado })
      .eq('id', parsed.data.itemId)

    if (error) {
      return { error: 'Não foi possível atualizar o item. Tente novamente.' }
    }

    revalidatePath('/compras')
  } catch {
    return { error: 'Erro interno. Tente novamente.' }
  }
}

export async function fecharRodada(rodadaId: string): Promise<{ error: string } | void> {
  const parsed = fecharRodadaSchema.safeParse({ rodadaId })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Dados inválidos.' }
  }

  try {
    const supabase = await createClient()

    const { data: itens, error: itensError } = await supabase
      .from('rodada_itens')
      .select('total')
      .eq('rodada_id', parsed.data.rodadaId)

    if (itensError) {
      return { error: 'Não foi possível recuperar os itens da rodada.' }
    }

    const total = (itens ?? []).reduce((acc, i) => acc + (i.total ?? 0), 0)

    const { error } = await supabase
      .from('rodadas')
      .update({ status: 'fechada', total })
      .eq('id', parsed.data.rodadaId)

    if (error) {
      return { error: 'Não foi possível fechar a rodada. Tente novamente.' }
    }

    revalidatePath('/compras')
  } catch {
    return { error: 'Erro interno. Tente novamente.' }
  }
}
