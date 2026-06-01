/**
 * Helpers puros de visualização de dados — sem dependência externa.
 * Toda a matemática de gráficos vive aqui (testável); os componentes só consomem.
 */

export type Severidade = 'critico' | 'baixo' | 'ok'

/** Limita um número ao intervalo 0–100. NaN/inválido → 0. */
export function clampPct(n: number): number {
  if (!Number.isFinite(n)) return 0
  return Math.min(100, Math.max(0, n))
}

export interface RingGeometry {
  radius: number
  circumference: number
  dashoffset: number
}

/** Geometria de um anel de progresso SVG para um dado percentual. */
export function ringGeometry(pct: number, size: number, strokeWidth: number): RingGeometry {
  const p = clampPct(pct)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const dashoffset = circumference - (p / 100) * circumference
  return { radius, circumference, dashoffset }
}

/**
 * Nível de estoque como % do mínimo (atual ÷ mínimo), limitado a 100.
 * Sem mínimo definido (≤ 0) → 0 (não há referência de ruptura).
 */
export function nivelEstoquePct(atual: number, minimo: number): number {
  if (minimo <= 0) return 0
  return clampPct((atual / minimo) * 100)
}

/**
 * Severidade de um item de estoque frente ao seu mínimo.
 * ≥ 100% do mínimo → ok | ≥ 50% → baixo | < 50% → crítico.
 */
export function severidadeEstoque(atual: number, minimo: number): Severidade {
  if (minimo <= 0) return 'ok'
  const ratio = atual / minimo
  if (ratio >= 1) return 'ok'
  if (ratio >= 0.5) return 'baixo'
  return 'critico'
}
