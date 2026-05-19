'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentCasa } from '@/lib/tenant'

export async function registrarContagem(
  itemId: string,
  quantidade: number
): Promise<{ error: string } | void> {
  if (!Number.isFinite(quantidade) || quantidade < 0) {
    return { error: 'Quantidade inválida.' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const casa = await getCurrentCasa()

  // valida que o item pertence à esta casa
  const { data: item } = await supabase
    .from('estoque_itens')
    .select('id')
    .eq('id', itemId)
    .eq('casa', casa)
    .maybeSingle()

  if (!item) return { error: 'Item não encontrado.' }

  // registra contagem histórica
  await supabase.from('estoque_contagens').insert({
    item_id: itemId,
    casa,
    quantidade,
    responsavel: user.id,
  })

  // atualiza quantidade atual + timestamp
  await supabase
    .from('estoque_itens')
    .update({ atual: quantidade, updated_at: new Date().toISOString() })
    .eq('id', itemId)

  revalidatePath('/estoque')
  revalidatePath('/dashboard')
}
