'use server'

import { revalidatePath } from 'next/cache'
import { requireUser } from '@/lib/auth-guard'

export async function abrirRodada(nome: string) {
  if (!nome?.trim()) throw new Error('Nome inválido')

  const { supabase, casa } = await requireUser()
  const hoje = new Date().toISOString().split('T')[0]

  await supabase.from('rodadas').insert({
    nome,
    data: hoje,
    status: 'aberta',
    total: 0,
    casa,
  })

  revalidatePath('/compras')
}

export async function marcarItemComprado(itemId: string, comprado: boolean) {
  if (!itemId?.trim()) throw new Error('Item inválido')

  const { supabase, casa } = await requireUser()

  await supabase
    .from('rodada_itens')
    .update({ comprado })
    .eq('id', itemId)
    .eq('casa', casa)

  revalidatePath('/compras')
}

export async function fecharRodada(rodadaId: string) {
  if (!rodadaId?.trim()) throw new Error('Rodada inválida')

  const { supabase, casa } = await requireUser()

  const { data: itens } = await supabase
    .from('rodada_itens')
    .select('total')
    .eq('rodada_id', rodadaId)
    .eq('casa', casa)

  const total = (itens ?? []).reduce((acc, i) => acc + (i.total ?? 0), 0)

  await supabase
    .from('rodadas')
    .update({ status: 'fechada', total })
    .eq('id', rodadaId)
    .eq('casa', casa)

  revalidatePath('/compras')
}
