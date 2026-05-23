import type { Tables } from "@/types/database.types"
import { FichasList } from "@/components/fichas/fichas-list"
import { getCurrentCasa } from "@/lib/tenant"

type FichaTecnica = Tables<"fichas_tecnicas">

async function getFichasData(casa: string) {
  try {
    const { createClient } = await import("@/lib/supabase/server")
    const supabase = await createClient()
    const { data: fichas } = await supabase
      .from("fichas_tecnicas")
      .select("*")
      .eq("casa", casa)
      .eq("ativo", true)
      .order("nome")
    return { fichas: fichas ?? [] }
  } catch (e) {
    console.error('[fichas] getFichasData error:', e)
    return { fichas: [] }
  }
}

function calcularStats(fichas: FichaTecnica[]) {
  if (fichas.length === 0) return { cmvMedio: null, custoMedio: null, total: 0 }
  const comCmv = fichas.filter(f => f.cmv_pct != null)
  const comCusto = fichas.filter(f => f.custo_total != null)
  const cmvMedio = comCmv.length > 0
    ? comCmv.reduce((s, f) => s + (f.cmv_pct ?? 0), 0) / comCmv.length
    : null
  const custoMedio = comCusto.length > 0
    ? comCusto.reduce((s, f) => s + (f.custo_total ?? 0), 0) / comCusto.length
    : null
  return { cmvMedio, custoMedio, total: fichas.length }
}

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })

export default async function FichasPage() {
  const casa = await getCurrentCasa()
  const { fichas } = await getFichasData(casa)
  const casaColor = casa === 'bica' ? 'var(--color-bica)' : 'var(--color-amp)'
  const { cmvMedio, custoMedio, total } = calcularStats(fichas)
  const categorias = [...new Set(fichas.map(f => f.categoria ?? "Sem categoria"))].sort()

  const cmvDanger = cmvMedio != null && cmvMedio > 30
  const cmvColor = cmvDanger ? "var(--color-amp)" : cmvMedio != null ? "#16a34a" : undefined

  return (
    <main className="p-4 space-y-6">
      <h1 className="font-display text-2xl" style={{ color: casaColor }}>
        Ficha Técnica / CMV
      </h1>

      {fichas.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg border shadow-sm bg-card p-3 flex flex-col gap-1">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide leading-none">CMV Médio</span>
            <span className="text-2xl font-bold tabular-nums leading-none" style={{ color: cmvColor }}>
              {cmvMedio != null ? `${cmvMedio.toFixed(1)}%` : "—"}
            </span>
            <span className="text-[10px] text-muted-foreground">{cmvDanger ? "acima da meta" : "dentro da meta"}</span>
          </div>
          <div className="rounded-lg border shadow-sm bg-card p-3 flex flex-col gap-1">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide leading-none">Custo Médio</span>
            <span className="text-base font-bold tabular-nums leading-snug">
              {custoMedio != null ? brl.format(custoMedio) : "—"}
            </span>
            <span className="text-[10px] text-muted-foreground">por ficha</span>
          </div>
          <div className="rounded-lg border shadow-sm bg-card p-3 flex flex-col gap-1">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide leading-none">Total</span>
            <span className="text-2xl font-bold tabular-nums leading-none">{total}</span>
            <span className="text-[10px] text-muted-foreground">fichas ativas</span>
          </div>
        </div>
      )}

      <FichasList fichas={fichas} categorias={categorias} />
    </main>
  )
}
