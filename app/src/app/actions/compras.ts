'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function abrirRodada(nome: string) {
  const supabase = await createClient()
  const hoje = new Date().toISOString().split('T')[0]

  await supabase.from('rodadas').insert({
    nome,
    data: hoje,
    status: 'aberta',
    total: 0,
  })

  revalidatePath('/compras')
}

export async function marcarItemComprado(itemId: string, comprado: boolean) {
  const supabase = await createClient()

  await supabase
    .from('rodada_itens')
    .update({ comprado })
    .eq('id', itemId)

  revalidatePath('/compras')
}

export async function adicionarItemRodada(
  rodadaId: string,
  itemId: string,
  nome: string,
  unidade: string | null,
  quantidade: number,
) {
  const supabase = await createClient()
  await supabase.from('rodada_itens').insert({
    rodada_id: rodadaId,
    item_id: itemId,
    nome,
    unidade,
    quantidade,
    comprado: false,
  })
  revalidatePath('/compras')
}

export async function removerItemRodada(rodadaItemId: string) {
  const supabase = await createClient()
  await supabase.from('rodada_itens').delete().eq('id', rodadaItemId)
  revalidatePath('/compras')
}

export async function fecharRodada(rodadaId: string) {
  const supabase = await createClient()

  const { data: itens } = await supabase
    .from('rodada_itens')
    .select('total')
    .eq('rodada_id', rodadaId)

  const total = (itens ?? []).reduce((acc, i) => acc + (i.total ?? 0), 0)

  await supabase
    .from('rodadas')
    .update({ status: 'fechada', total })
    .eq('id', rodadaId)

  revalidatePath('/compras')
}
