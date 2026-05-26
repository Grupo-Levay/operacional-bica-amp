/** Calcula o CMV (%) a partir do custo e do preço de venda. */
export function calcularCmv(custo: number | null, venda: number | null): number | null {
  if (custo === null || venda === null || venda <= 0) return null
  if (!Number.isFinite(custo) || !Number.isFinite(venda)) return null
  return Math.round((custo / venda) * 1000) / 10
}
