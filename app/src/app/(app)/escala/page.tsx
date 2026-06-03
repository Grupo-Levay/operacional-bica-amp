import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EscalaGrid } from "@/components/escala/escala-grid"
import { PageHeader } from "@/components/shared/page-header"
import { logger } from "@/lib/logger"

async function getEscalaData() {
  try {
    const { createClient } = await import("@/lib/supabase/server")
    const { getCurrentCasa } = await import("@/lib/tenant")
    const supabase = await createClient()
    const casa = await getCurrentCasa()

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
      supabase.from("equipe").select("*").eq("casa", casa).eq("ativo", true).order("nome"),
      supabase
        .from("escala")
        .select("*, equipe(nome, funcao)")
        .eq("casa", casa)
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
    logger.error('[escala] getEscalaData error', e)
    return { membros: [], escala: [], inicioStr: "", fimStr: "", canEdit: false }
  }
}

function formatRangeLabel(inicioStr: string, fimStr: string): string {
  if (!inicioStr || !fimStr) return ""
  const inicio = new Date(inicioStr + "T12:00:00")
  const fim = new Date(fimStr + "T12:00:00")
  const formatter = new Intl.DateTimeFormat("pt-BR", { month: "short", day: "numeric" })
  return `${formatter.format(inicio)} – ${formatter.format(fim)}`
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
    <main className="min-h-screen bg-background p-4 md:p-6 space-y-6 pb-24">
      <PageHeader
        title="Escala"
        subtitle={`${rangeLabel}${canEdit ? ' · Modo Edição' : ''}`}
      />

      <section className="space-y-2">
        <h2 className="text-label font-semibold text-muted-foreground uppercase tracking-wide">
          Próximos 7 Dias
        </h2>
        <Card className="border-primary/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-h3 flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block h-3 w-1 rounded-full bg-gradient-brand shadow-glow-brand-sm"
              />
              {membros.length} Membros · {dias.length} Dias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EscalaGrid membros={membros} escala={escala} dias={dias} canEdit={canEdit} />
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
