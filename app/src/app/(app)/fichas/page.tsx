import { ChefHat } from "lucide-react"
import type { Tables } from "@/types/database.types"
import { FichaCard } from "@/components/fichas/ficha-card"

type FichaTecnica = Tables<"fichas_tecnicas">

async function getFichasData() {
  try {
    const { createClient } = await import("@/lib/supabase/server")
    const supabase = await createClient()
    const { data: fichas } = await supabase
      .from("fichas_tecnicas")
      .select("*")
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

  const comCmv = fichas.filter((f) => f.cmv_pct != null)
  const comCusto = fichas.filter((f) => f.custo_total != null)

  const cmvMedio =
    comCmv.length > 0
      ? comCmv.reduce((sum, f) => sum + (f.cmv_pct ?? 0), 0) / comCmv.length
      : null

  const custoMedio =
    comCusto.length > 0
      ? comCusto.reduce((sum, f) => sum + (f.custo_total ?? 0), 0) / comCusto.length
      : null

  return { cmvMedio, custoMedio, total: fichas.length }
}

function agruparPorCategoria(fichas: FichaTecnica[]): Record<string, FichaTecnica[]> {
  return fichas.reduce<Record<string, FichaTecnica[]>>((acc, ficha) => {
    const cat = ficha.categoria ?? "Sem categoria"
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(ficha)
    return acc
  }, {})
}

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })

export default async function FichasPage() {
  const { fichas } = await getFichasData()
  const { cmvMedio, custoMedio, total } = calcularStats(fichas)
  const grupos = agruparPorCategoria(fichas)
  const categorias = Object.keys(grupos).sort()

  const cmvDanger = cmvMedio != null && cmvMedio > 30
  const cmvColorStyle = cmvDanger
    ? { color: "var(--color-amp)" }
    : cmvMedio != null
    ? { color: "#16a34a" }
    : undefined

  return (
    <main className="p-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold" style={{ color: "var(--color-bica)" }}>
          Ficha Técnica / CMV
        </h1>
      </div>

      {/* Dashboard CMV */}
      {fichas.length > 0 && (
        <section>
          <div className="grid grid-cols-3 gap-2 mb-6">
            {/* CMV médio */}
            <div className="rounded-lg border shadow-sm bg-card p-3 flex flex-col gap-1">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide leading-none">
                CMV Médio
              </span>
              <span className="text-2xl font-bold tabular-nums leading-none" style={cmvColorStyle}>
                {cmvMedio != null ? `${cmvMedio.toFixed(1)}%` : "—"}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {cmvDanger ? "acima da meta" : "dentro da meta"}
              </span>
            </div>

            {/* Custo médio */}
            <div className="rounded-lg border shadow-sm bg-card p-3 flex flex-col gap-1">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide leading-none">
                Custo Médio
              </span>
              <span className="text-base font-bold tabular-nums leading-snug">
                {custoMedio != null ? brl.format(custoMedio) : "—"}
              </span>
              <span className="text-[10px] text-muted-foreground">por ficha</span>
            </div>

            {/* Total de fichas */}
            <div className="rounded-lg border shadow-sm bg-card p-3 flex flex-col gap-1">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide leading-none">
                Total
              </span>
              <span className="text-2xl font-bold tabular-nums leading-none">{total}</span>
              <span className="text-[10px] text-muted-foreground">fichas ativas</span>
            </div>
          </div>
        </section>
      )}

      {/* Search bar (visual only) */}
      <div>
        <input
          disabled
          placeholder="Buscar ficha..."
          className="w-full rounded-lg border bg-muted/50 px-3 py-2 text-sm text-muted-foreground placeholder:text-muted-foreground cursor-not-allowed"
        />
      </div>

      {/* Lista de fichas */}
      <section className="space-y-6">
        {fichas.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
            <ChefHat className="size-12 opacity-40" />
            <p className="text-sm">Nenhuma ficha cadastrada</p>
          </div>
        ) : (
          categorias.map((categoria) => (
            <div key={categoria}>
              <h2 className="mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {categoria}
              </h2>
              <div className="space-y-3">
                {grupos[categoria].map((ficha) => (
                  <FichaCard key={ficha.id} ficha={ficha} />
                ))}
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  )
}
