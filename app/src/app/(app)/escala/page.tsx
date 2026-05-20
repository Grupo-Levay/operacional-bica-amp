import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EscalaGrid } from "@/components/escala/escala-grid"

async function getEscalaData() {
  try {
    const { createClient } = await import("@/lib/supabase/server")
    const supabase = await createClient()

    // Próximos 7 dias
    const hoje = new Date()
    const fim = new Date(hoje)
    fim.setDate(hoje.getDate() + 6)
    const inicioStr = hoje.toISOString().split("T")[0]
    const fimStr = fim.toISOString().split("T")[0]

    const [{ data: membros }, { data: escala }] = await Promise.all([
      supabase.from("equipe").select("*").eq("ativo", true).order("nome"),
      supabase
        .from("escala")
        .select("*, equipe(nome, funcao)")
        .gte("data", inicioStr)
        .lte("data", fimStr),
    ])

    return {
      membros: membros ?? [],
      escala: escala ?? [],
      inicioStr,
      fimStr,
    }
  } catch (e) {
    console.error('[escala] getEscalaData error:', e)
    return { membros: [], escala: [], inicioStr: "", fimStr: "" }
  }
}

function formatRangeLabel(inicioStr: string, fimStr: string): string {
  if (!inicioStr || !fimStr) return ""

  const inicio = new Date(inicioStr + "T12:00:00")
  const fim = new Date(fimStr + "T12:00:00")

  const diaInicio = inicio.getDate()
  const diaFim = fim.getDate()

  const mesInicio = new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(
    inicio
  )
  const mesFim = new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(fim)

  if (mesInicio === mesFim) {
    return `${diaInicio}–${diaFim} ${mesInicio}`
  }
  return `${diaInicio} ${mesInicio} – ${diaFim} ${mesFim}`
}

function buildDias(inicioStr: string): Date[] {
  if (!inicioStr) return []
  const dias: Date[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(inicioStr + "T12:00:00")
    d.setDate(d.getDate() + i)
    dias.push(d)
  }
  return dias
}

export default async function EscalaPage() {
  const { membros, escala, inicioStr, fimStr } = await getEscalaData()
  const rangeLabel = formatRangeLabel(inicioStr, fimStr)
  const dias = buildDias(inicioStr)

  return (
    <main className="p-4 space-y-4">
      {/* Header */}
      <div>
        <h1
          className="text-xl font-bold"
          style={{ color: "var(--color-bica)" }}
        >
          Escala
        </h1>
        {rangeLabel && (
          <p className="text-sm text-muted-foreground capitalize">
            {rangeLabel}
          </p>
        )}
      </div>

      {/* Grade */}
      <Card>
        <CardHeader>
          <CardTitle>Próximos 7 dias</CardTitle>
        </CardHeader>
        <CardContent>
          <EscalaGrid membros={membros} escala={escala} dias={dias} />
        </CardContent>
      </Card>
    </main>
  )
}
