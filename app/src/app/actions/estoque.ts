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

export async function atualizarItemEstoque(
  itemId: string,
  updates: { minimo?: number; unidade?: string | null }
) {
  if (!itemId?.trim()) throw new Error('Item inválido')

  const patch: { minimo?: number; unidade?: string | null } = {}

  if (updates.minimo !== undefined) {
    if (!Number.isFinite(updates.minimo) || updates.minimo < 0) {
      throw new Error('Mínimo inválido')
    }
    patch.minimo = updates.minimo
  }

  if (updates.unidade !== undefined) {
    const u = updates.unidade?.trim()
    patch.unidade = u ? u : null
  }

  if (Object.keys(patch).length === 0) throw new Error('Nada para atualizar')

  const { supabase, casa } = await requireUser()

  await supabase
    .from('estoque_itens')
    .update(patch)
    .eq('id', itemId)
    .eq('casa', casa)

  revalidatePath('/estoque')
}
