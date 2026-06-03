'use server'

import { revalidatePath } from 'next/cache'
import { requireUser } from '@/lib/auth-guard'
import { withAnalytics } from './instrumented'

export async function criarItemEstoque(input: {
  nome: string
  categoriaId?: string | null
  minimo?: number | null
  unidade?: string | null
  atual?: number | null
}) {
  return withAnalytics('estoque.criar_item', async () => {
    const nome = input.nome?.trim()
    if (!nome) throw new Error('Nome do item é obrigatório')

    const minimo = input.minimo ?? 0
    if (!Number.isFinite(minimo) || minimo < 0) throw new Error('Mínimo inválido')

    const atual = input.atual ?? 0
    if (!Number.isFinite(atual) || atual < 0) throw new Error('Quantidade inicial inválida')

    const unidade = input.unidade?.trim() || null
    const categoriaId = input.categoriaId?.trim() || null

    const { supabase, casa } = await requireUser()

    const { error } = await supabase.from('estoque_itens').insert({
      nome,
      categoria_id: categoriaId,
      minimo,
      atual,
      unidade,
      casa,
      ativo: true,
    })
    if (error) throw new Error('Não foi possível criar o item')

    revalidatePath('/estoque')
  })
}

export async function arquivarItemEstoque(itemId: string) {
  if (!itemId?.trim()) throw new Error('Item inválido')

  const { supabase, casa } = await requireUser()

  await supabase
    .from('estoque_itens')
    .update({ ativo: false })
    .eq('id', itemId)
    .eq('casa', casa)

  revalidatePath('/estoque')
}

export async function atualizarQuantidade(itemId: string, novaQuantidade: number) {
  return withAnalytics('estoque.atualizar_quantidade', async () => {
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
  })
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
