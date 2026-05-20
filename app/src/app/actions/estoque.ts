'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function atualizarQuantidade(itemId: string, novaQuantidade: number) {
  const supabase = await createClient()

  await supabase
    .from('estoque_itens')
    .update({ atual: novaQuantidade })
    .eq('id', itemId)

  await supabase.from('estoque_contagens').insert({
    item_id: itemId,
    quantidade: novaQuantidade,
  })

  revalidatePath('/estoque')
}
