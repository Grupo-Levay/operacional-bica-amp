import { calcularCmv } from '@/lib/fichas'

export interface FichaCusto {
  custo_total: number | null
  preco_venda: number | null
}

/**
 * Média simples do CMV (%) sobre as fichas com venda válida.
 * Ignora fichas sem custo/venda definidos (CMV indefinido).
 * Retorna null quando nenhuma ficha tem CMV calculável.
 */
export function mediaCmv(fichas: FichaCusto[]): number | null {
  const valores: number[] = []
  for (const f of fichas) {
    const cmv = calcularCmv(f.custo_total, f.preco_venda)
    if (cmv !== null) valores.push(cmv)
  }
  if (valores.length === 0) return null
  const soma = valores.reduce((acc, v) => acc + v, 0)
  return Math.round((soma / valores.length) * 10) / 10
}
