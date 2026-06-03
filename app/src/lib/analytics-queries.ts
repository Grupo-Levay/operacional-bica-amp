import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database.types"
import type { Casa } from "@/lib/tenant-types"

type AppClient = SupabaseClient<Database>

export interface ErroRecente {
  action: string
  error_message: string | null
  created_at: string
}

export interface AcaoLenta {
  action: string
  duration_ms: number
  created_at: string
}

export interface WebVitalP75 {
  metric: string // 'LCP' | 'CLS' | 'INP' | 'FCP' | 'TTFB'
  p75: number
  amostras: number
}

export interface ResumoDia {
  dia: string // 'YYYY-MM-DD'
  total: number
  erros: number
}

/** Janela ISO de N dias atrás até agora. */
function desde(dias: number): string {
  return new Date(Date.now() - dias * 24 * 60 * 60 * 1000).toISOString()
}

/** Últimos erros capturados (status='error') na casa. */
export async function getErrosRecentes(
  supabase: AppClient,
  casa: Casa,
  limit = 20,
): Promise<ErroRecente[]> {
  const { data } = await supabase
    .from("analytics_events")
    .select("action, error_message, created_at")
    .eq("casa", casa)
    .eq("status", "error")
    .order("created_at", { ascending: false })
    .limit(limit)
  return data ?? []
}

/** Ações cuja duração ultrapassou o limite (apaga ruído de telemetria leve). */
export async function getAcoesLentas(
  supabase: AppClient,
  casa: Casa,
  thresholdMs = 1000,
  limit = 20,
): Promise<AcaoLenta[]> {
  const { data } = await supabase
    .from("analytics_events")
    .select("action, duration_ms, created_at")
    .eq("casa", casa)
    .gte("duration_ms", thresholdMs)
    .order("duration_ms", { ascending: false })
    .limit(limit)
  return (data ?? [])
    .filter((r): r is AcaoLenta => typeof r.duration_ms === "number")
}

/** Percentil 75 por métrica de Web Vital, calculado sobre a janela de dias. */
export async function getWebVitalsP75(
  supabase: AppClient,
  casa: Casa,
  dias = 7,
): Promise<WebVitalP75[]> {
  const { data } = await supabase
    .from("analytics_events")
    .select("action, value")
    .eq("casa", casa)
    .like("action", "web_vital.%")
    .gte("created_at", desde(dias))

  const porMetrica = new Map<string, number[]>()
  for (const row of data ?? []) {
    if (typeof row.value !== "number") continue
    const metric = row.action.replace("web_vital.", "")
    const arr = porMetrica.get(metric) ?? []
    arr.push(row.value)
    porMetrica.set(metric, arr)
  }

  return Array.from(porMetrica.entries())
    .map(([metric, valores]) => ({ metric, p75: percentil(valores, 75), amostras: valores.length }))
    .sort((a, b) => a.metric.localeCompare(b.metric))
}

/** Resumo diário (total de eventos + erros) dos últimos N dias. */
export async function getResumoDiario(
  supabase: AppClient,
  casa: Casa,
  dias = 7,
): Promise<ResumoDia[]> {
  const { data } = await supabase
    .from("analytics_events")
    .select("status, created_at")
    .eq("casa", casa)
    .gte("created_at", desde(dias))

  const porDia = new Map<string, { total: number; erros: number }>()
  for (const row of data ?? []) {
    const dia = row.created_at.slice(0, 10)
    const acc = porDia.get(dia) ?? { total: 0, erros: 0 }
    acc.total += 1
    if (row.status === "error") acc.erros += 1
    porDia.set(dia, acc)
  }

  return Array.from(porDia.entries())
    .map(([dia, v]) => ({ dia, ...v }))
    .sort((a, b) => a.dia.localeCompare(b.dia))
}

/** Percentil linear (método nearest-rank simples) sobre uma lista numérica. */
export function percentil(valores: number[], p: number): number {
  if (valores.length === 0) return 0
  const ordenado = [...valores].sort((a, b) => a - b)
  const idx = Math.ceil((p / 100) * ordenado.length) - 1
  return ordenado[Math.min(Math.max(idx, 0), ordenado.length - 1)]
}

export type WebVitalRating = "good" | "needs-improvement" | "poor"

/** Limites oficiais (web.dev) — `bom` = até bom, acima de `ruim` = ruim. CLS é adimensional; os demais em ms. */
const WEB_VITAL_LIMITES: Record<string, { bom: number; ruim: number }> = {
  LCP: { bom: 2500, ruim: 4000 },
  INP: { bom: 200, ruim: 500 },
  FCP: { bom: 1800, ruim: 3000 },
  TTFB: { bom: 800, ruim: 1800 },
  CLS: { bom: 0.1, ruim: 0.25 },
}

/** Classifica o valor de um Web Vital conforme os thresholds oficiais. */
export function ratingWebVital(metric: string, value: number): WebVitalRating {
  const lim = WEB_VITAL_LIMITES[metric]
  if (!lim) return "needs-improvement"
  if (value <= lim.bom) return "good"
  if (value > lim.ruim) return "poor"
  return "needs-improvement"
}
