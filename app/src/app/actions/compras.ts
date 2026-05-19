'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentCasa } from '@/lib/tenant'
import { getTodayISO } from '@/lib/utils'

async function getAuthedContext() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const casa = await getCurrentCasa()
  return { supabase, casa }
}

export async function toggleItemComprado(itemId: string, comprado: boolean) {
  const { supabase, casa } = await getAuthedContext()

  // valida que o item pertence a esta casa antes de escrever
  const { data: item } = await supabase
    .from('rodada_itens')
    .select('id')
    .eq('id', itemId)
    .eq('casa', casa)
    .maybeSingle()

  if (!item) return

  await supabase
    .from('rodada_itens')
    .update({ comprado })
    .eq('id', itemId)

  revalidatePath('/compras')
  revalidatePath('/dashboard')
}

export async function fecharRodada(rodadaId: string) {
  const { supabase, casa } = await getAuthedContext()

  const { data: rodada } = await supabase
    .from('rodadas')
    .select('id')
    .eq('id', rodadaId)
    .eq('casa', casa)
    .maybeSingle()

  if (!rodada) return

  const { data: itens } = await supabase
    .from('rodada_itens')
    .select('total, preco_unit, quantidade')
    .eq('rodada_id', rodadaId)
    .eq('casa', casa)

  const total = (itens ?? []).reduce((sum, item) => {
    return sum + (item.total ?? (item.preco_unit ?? 0) * (item.quantidade ?? 1))
  }, 0)

  await supabase
    .from('rodadas')
    .update({ status: 'fechada', total })
    .eq('id', rodadaId)

  revalidatePath('/compras')
  revalidatePath('/dashboard')
}

export async function criarRodada(): Promise<{ error: string } | void> {
  const { supabase, casa } = await getAuthedContext()

  const { data: existente } = await supabase
    .from('rodadas')
    .select('id')
    .eq('casa', casa)
    .eq('status', 'aberta')
    .maybeSingle()

  if (existente) {
    return { error: 'Já existe uma rodada aberta. Feche-a antes de criar outra.' }
  }

  const hoje = getTodayISO()

  const { data: rodada, error } = await supabase
    .from('rodadas')
    .insert({ casa, nome: `Rodada ${hoje}`, data: hoje, status: 'aberta' })
    .select('id')
    .single()

  if (error || !rodada) return { error: 'Erro ao criar rodada. Tente novamente.' }

  // pré-popula com itens de estoque crítico (atual < minimo)
  const { data: criticos } = await supabase
    .from('estoque_itens')
    .select('id, nome, unidade, minimo, atual')
    .eq('casa', casa)
    .eq('ativo', true)
    .filter('atual', 'lt', 'minimo')

  if (criticos && criticos.length > 0) {
    await supabase.from('rodada_itens').insert(
      criticos.map((item) => ({
        rodada_id: rodada.id,
        item_id: item.id,
        nome: item.nome,
        unidade: item.unidade,
        quantidade: Math.max(1, (item.minimo ?? 0) - (item.atual ?? 0)),
        casa,
        comprado: false,
      }))
    )
  }

  revalidatePath('/compras')
  revalidatePath('/dashboard')
}
