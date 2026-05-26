import { BookOpen, TrendingUp, Banknote, Plus } from 'lucide-react'
import type { Tables } from "@/types/database.types"
import { FichasList } from "@/components/fichas/fichas-list"
import { FichaFormDialog } from "@/components/fichas/ficha-form-dialog"
import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/dashboard/stat-card"
import { Button } from "@/components/ui/button"

type FichaTecnica = Tables<"fichas_tecnicas">

async function getFichasData() {
  try {
    const { createClient } = await import("@/lib/supabase/server")
    const { getCurrentCasa } = await import("@/lib/tenant")
    const supabase = await createClient()
    const casa = await getCurrentCasa()
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
  const { fichas } = await getFichasData()
  const { cmvMedio, custoMedio, total } = calcularStats(fichas)
  const categorias = [...new Set(fichas.map(f => f.categoria ?? "Sem categoria"))].sort()

  const cmvDanger = cmvMedio != null && cmvMedio > 30

  return (
    <main className="p-4 space-y-6">
      <PageHeader
        title="Ficha Técnica / CMV"
        action={
          <FichaFormDialog
            trigger={
              <Button variant="brand" size="sm">
                <Plus className="size-4" />
                Nova
              </Button>
            }
          />
        }
      />

      {fichas.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          <StatCard
            label="CMV Médio"
            value={cmvMedio != null ? `${cmvMedio.toFixed(1)}%` : '—'}
            sub={cmvDanger ? 'acima da meta' : 'dentro da meta'}
            accent={cmvMedio == null ? undefined : cmvDanger ? 'danger' : 'success'}
            icon={<TrendingUp size={14} />}
          />
          <StatCard
            label="Custo Médio"
            value={custoMedio != null ? brl.format(custoMedio) : '—'}
            sub="por ficha"
            accent="primary"
            icon={<Banknote size={14} />}
          />
          <StatCard
            label="Total"
            value={total}
            sub="fichas ativas"
            accent="primary"
            icon={<BookOpen size={14} />}
          />
        </div>
      )}

      <FichasList fichas={fichas} categorias={categorias} />
    </main>
  )
}
