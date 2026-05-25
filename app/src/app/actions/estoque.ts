'use server'

import { revalidatePath } from 'next/cache'
import { requireUser } from '@/lib/auth-guard'

export async function atualizarQuantidade(itemId: string, novaQuantidade: number) {
  if (!itemId?.trim()) throw new Error('Item inválido')
  if (!Number.isFinite(novaQuantidade) || novaQuantidade < 0) {
    throw new Error('Quantidade inválida')
  }

  const { supabase, casa } = await requireUser()

  await supabase
    .from('estoque_itens')
    .update({ atual: novaQuantidade })
    .eq('id', itemId)
    .eq('casa', casa)

  await supabase.from('estoque_contagens').insert({
    item_id: itemId,
    quantidade: novaQuantidade,
    casa,
  })

  revalidatePath('/estoque')
}
