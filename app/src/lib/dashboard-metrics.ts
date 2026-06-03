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

/** Meta de CMV (%) — abaixo disso é saudável. */
export const META_CMV = 30

export type CmvSeveridade = 'ok' | 'warning' | 'danger' | 'muted'

/** Severidade do CMV frente à meta: ≤30% ok, ≤40% atenção, acima disso alto.
 *  `null` (sem fichas calculáveis) → 'muted'. */
export function cmvSeveridade(cmv: number | null): CmvSeveridade {
  if (cmv === null) return 'muted'
  if (cmv <= META_CMV) return 'ok'
  if (cmv <= 40) return 'warning'
  return 'danger'
}
