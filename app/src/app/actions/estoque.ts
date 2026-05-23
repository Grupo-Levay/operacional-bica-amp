'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const atualizarQuantidadeSchema = z.object({
  itemId: z.string().uuid('itemId inválido.'),
  quantidade: z
    .number()
    .int('Quantidade deve ser um número inteiro.')
    .min(0, 'Quantidade não pode ser negativa.')
    .max(99999, 'Quantidade muito alta.'),
})

export async function atualizarQuantidade(
  itemId: string,
  novaQuantidade: number,
): Promise<{ error: string } | void> {
  const parsed = atualizarQuantidadeSchema.safeParse({ itemId, quantidade: novaQuantidade })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Dados inválidos.' }
  }

  try {
    const supabase = await createClient()

    const { error: updateError } = await supabase
      .from('estoque_itens')
      .update({ atual: parsed.data.quantidade })
      .eq('id', parsed.data.itemId)

    if (updateError) {
      return { error: 'Não foi possível atualizar a quantidade. Tente novamente.' }
    }

    const { error: insertError } = await supabase.from('estoque_contagens').insert({
      item_id: parsed.data.itemId,
      quantidade: parsed.data.quantidade,
    })

    if (insertError) {
      return { error: 'Não foi possível registrar a contagem. Tente novamente.' }
    }

    revalidatePath('/estoque')
  } catch {
    return { error: 'Erro interno. Tente novamente.' }
  }
}
