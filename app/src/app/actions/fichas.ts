'use server'

import { revalidatePath } from 'next/cache'
import { requireUser } from '@/lib/auth-guard'
import { calcularCmv } from '@/lib/fichas'

export interface SalvarFichaInput {
  id?: string
  nome: string
  categoria?: string | null
  custoTotal?: number | null
  precoVenda?: number | null
  rendimento?: number | null
  unidadeRendimento?: string | null
}

export async function salvarFicha(input: SalvarFichaInput) {
  const nome = input.nome?.trim()
  if (!nome) throw new Error('Nome é obrigatório')

  const custo = input.custoTotal ?? null
  const venda = input.precoVenda ?? null
  if (custo !== null && (!Number.isFinite(custo) || custo < 0)) {
    throw new Error('Custo inválido')
  }
  if (venda !== null && (!Number.isFinite(venda) || venda < 0)) {
    throw new Error('Preço de venda inválido')
  }
  if (input.rendimento != null && (!Number.isFinite(input.rendimento) || input.rendimento < 0)) {
    throw new Error('Rendimento inválido')
  }

  const cmv = calcularCmv(custo, venda)

  const { supabase, casa } = await requireUser()

  const payload = {
    nome,
    categoria: input.categoria?.trim() || null,
    custo_total: custo,
    preco_venda: venda,
    cmv_pct: cmv,
    rendimento: input.rendimento ?? null,
    unidade_rendimento: input.unidadeRendimento?.trim() || null,
  }

  if (input.id?.trim()) {
    await supabase
      .from('fichas_tecnicas')
      .update(payload)
      .eq('id', input.id)
      .eq('casa', casa)
  } else {
    await supabase.from('fichas_tecnicas').insert({ ...payload, casa, ativo: true })
  }

  revalidatePath('/fichas')
}

export async function arquivarFicha(id: string) {
  if (!id?.trim()) throw new Error('Ficha inválida')

  const { supabase, casa } = await requireUser()

  await supabase
    .from('fichas_tecnicas')
    .update({ ativo: false })
    .eq('id', id)
    .eq('casa', casa)

  revalidatePath('/fichas')
}
