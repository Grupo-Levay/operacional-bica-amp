import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EscalaGrid } from "@/components/escala/escala-grid"

async function getEscalaData() {
  try {
    const { createClient } = await import("@/lib/supabase/server")
    const supabase = await createClient()

    const hoje = new Date()
    const fim = new Date(hoje)
    fim.setDate(hoje.getDate() + 6)
    const inicioStr = hoje.toISOString().split("T")[0]
    const fimStr = fim.toISOString().split("T")[0]

    const [
      { data: { user } },
      { data: membros },
      { data: escala },
    ] = await Promise.all([
      supabase.auth.getUser(),
      supabase.from("equipe").select("*").eq("ativo", true).order("nome"),
      supabase
        .from("escala")
        .select("*, equipe(nome, funcao)")
        .gte("data", inicioStr)
        .lte("data", fimStr),
    ])

    let canEdit = false
    if (user) {
      const { data: perfil } = await supabase
        .from("perfis")
        .select("role")
        .eq("id", user.id)
        .single()
      canEdit = ["super_admin", "admin"].includes(perfil?.role ?? "")
    }

    return {
      membros: membros ?? [],
      escala: escala ?? [],
      inicioStr,
      fimStr,
      canEdit,
    }
  } catch (e) {
    console.error('[escala] getEscalaData error:', e)
    return { membros: [], escala: [], inicioStr: "", fimStr: "", canEdit: false }
  }
}

function formatRangeLabel(inicioStr: string, fimStr: string): string {
  if (!inicioStr || !fimStr) return ""
  const inicio = new Date(inicioStr + "T12:00:00")
  const fim = new Date(fimStr + "T12:00:00")
  const diaInicio = inicio.getDate()
  const diaFim = fim.getDate()
  const mesInicio = new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(inicio)
  const mesFim = new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(fim)
  if (mesInicio === mesFim) return `${diaInicio}–${diaFim} ${mesInicio}`
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
  const { membros, escala, inicioStr, fimStr, canEdit } = await getEscalaData()
  const rangeLabel = formatRangeLabel(inicioStr, fimStr)
  const dias = buildDias(inicioStr)

  return (
    <main className="p-4 space-y-4">
      <div>
        <h1
          className="font-display text-2xl"
          style={{ color: "var(--color-bica)" }}
        >
          Escala
        </h1>
        {rangeLabel && (
          <p className="text-sm text-muted-foreground capitalize">
            {rangeLabel}
            {canEdit && (
              <span className="ml-2 text-xs" style={{ color: "var(--color-bica)" }}>
                · modo edição
              </span>
            )}
          </p>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Próximos 7 dias</CardTitle>
        </CardHeader>
        <CardContent>
          <EscalaGrid membros={membros} escala={escala} dias={dias} canEdit={canEdit} />
        </CardContent>
      </Card>
    </main>
  )
}
