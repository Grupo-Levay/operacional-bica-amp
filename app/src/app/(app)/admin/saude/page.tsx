import { redirect } from "next/navigation"
import { Activity, AlertTriangle, Gauge, Timer } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getCurrentCasa } from "@/lib/tenant"
import { PageHeader } from "@/components/shared/page-header"
import { SectionLabel } from "@/components/shared/section-label"
import { EmptyState } from "@/components/shared/empty-state"
import { Card, CardContent } from "@/components/ui/card"
import {
  getAcoesLentas,
  getErrosRecentes,
  getResumoDiario,
  getWebVitalsP75,
  ratingWebVital,
  type WebVitalRating,
} from "@/lib/analytics-queries"

const RATING_COR: Record<WebVitalRating, string> = {
  good: "text-success",
  "needs-improvement": "text-warning",
  poor: "text-danger",
}

const RATING_LABEL: Record<WebVitalRating, string> = {
  good: "bom",
  "needs-improvement": "atenção",
  poor: "ruim",
}

// CLS é adimensional; os demais Web Vitals são medidos em ms.
function formatarVital(metric: string, valor: number): string {
  if (metric === "CLS") return valor.toFixed(3)
  return `${Math.round(valor)} ms`
}

function formatarQuando(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default async function AdminSaudePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: meu } = await supabase
    .from("perfis")
    .select("role")
    .eq("id", user.id)
    .single()

  if (!meu || !["super_admin", "admin"].includes(meu.role)) redirect("/dashboard")

  const casa = await getCurrentCasa()

  const [resumo, vitals, lentas, erros] = await Promise.all([
    getResumoDiario(supabase, casa, 7),
    getWebVitalsP75(supabase, casa, 7),
    getAcoesLentas(supabase, casa, 1000, 10),
    getErrosRecentes(supabase, casa, 10),
  ])

  const totalEventos = resumo.reduce((s, d) => s + d.total, 0)
  const totalErros = resumo.reduce((s, d) => s + d.erros, 0)
  const taxaErro = totalEventos > 0 ? (totalErros / totalEventos) * 100 : 0
  const maxDia = Math.max(1, ...resumo.map((d) => d.total))

  return (
    <main className="min-h-screen bg-background p-4 md:p-6 space-y-6 pb-24">
      <PageHeader
        title="Saúde da Operação"
        subtitle="Observabilidade self-hosted — eventos, performance e erros (7 dias)"
        badge={`${totalEventos} eventos`}
      />

      {/* KPIs */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card size="sm">
          <CardContent className="flex flex-col gap-1 pt-1">
            <span className="text-label uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
              <Activity size={14} aria-hidden="true" /> Eventos
            </span>
            <span className="text-h3 font-semibold">{totalEventos}</span>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="flex flex-col gap-1 pt-1">
            <span className="text-label uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
              <AlertTriangle size={14} aria-hidden="true" /> Erros
            </span>
            <span className={`text-h3 font-semibold ${totalErros > 0 ? "text-danger" : "text-success"}`}>
              {totalErros}
            </span>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="flex flex-col gap-1 pt-1">
            <span className="text-label uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
              <Gauge size={14} aria-hidden="true" /> Taxa de erro
            </span>
            <span className={`text-h3 font-semibold ${taxaErro >= 5 ? "text-danger" : taxaErro >= 1 ? "text-warning" : "text-success"}`}>
              {taxaErro.toFixed(1)}%
            </span>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="flex flex-col gap-1 pt-1">
            <span className="text-label uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
              <Timer size={14} aria-hidden="true" /> Ações lentas
            </span>
            <span className={`text-h3 font-semibold ${lentas.length > 0 ? "text-warning" : "text-success"}`}>
              {lentas.length}
            </span>
          </CardContent>
        </Card>
      </section>

      {/* Web Vitals P75 */}
      <section className="space-y-3">
        <SectionLabel>Web Vitals · P75</SectionLabel>
        {vitals.length === 0 ? (
          <EmptyState message="Sem amostras de Web Vitals ainda. Navegue pelo app para coletar." />
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
            {vitals.map((v) => {
              const rating = ratingWebVital(v.metric, v.p75)
              return (
                <Card key={v.metric} size="sm">
                  <CardContent className="flex flex-col gap-1 pt-1">
                    <span className="text-label uppercase tracking-wide text-muted-foreground">
                      {v.metric}
                    </span>
                    <span className={`text-h3 font-semibold ${RATING_COR[rating]}`}>
                      {formatarVital(v.metric, v.p75)}
                    </span>
                    <span className={`text-caption ${RATING_COR[rating]}`}>
                      {RATING_LABEL[rating]} · {v.amostras} amostra{v.amostras === 1 ? "" : "s"}
                    </span>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </section>

      {/* Volume diário */}
      <section className="space-y-3">
        <SectionLabel>Volume diário</SectionLabel>
        {resumo.length === 0 ? (
          <EmptyState message="Nenhum evento registrado no período." />
        ) : (
          <Card>
            <CardContent className="space-y-2 pt-1">
              {resumo.map((d) => (
                <div key={d.dia} className="flex items-center gap-3">
                  <span className="w-14 shrink-0 text-body-sm text-muted-foreground tabular-nums">
                    {d.dia.slice(5)}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(d.total / maxDia) * 100}%` }}
                    />
                  </div>
                  <span className="w-10 shrink-0 text-right text-body-sm font-medium tabular-nums">
                    {d.total}
                  </span>
                  <span className={`w-8 shrink-0 text-right text-caption tabular-nums ${d.erros > 0 ? "text-danger" : "text-muted-foreground"}`}>
                    {d.erros > 0 ? `${d.erros}✕` : "—"}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </section>

      {/* Ações lentas */}
      <section className="space-y-3">
        <SectionLabel>Ações lentas (&gt; 1s)</SectionLabel>
        {lentas.length === 0 ? (
          <EmptyState message="Nenhuma ação acima de 1s. 🚀" />
        ) : (
          <Card>
            <CardContent className="divide-y divide-border pt-1">
              {lentas.map((a, i) => (
                <div key={i} className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0">
                  <span className="truncate font-mono text-body-sm">{a.action}</span>
                  <span className="shrink-0 text-body-sm font-medium text-warning tabular-nums">
                    {a.duration_ms} ms
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </section>

      {/* Erros recentes */}
      <section className="space-y-3">
        <SectionLabel>Erros recentes</SectionLabel>
        {erros.length === 0 ? (
          <EmptyState message="Nenhum erro capturado. ✅" />
        ) : (
          <Card>
            <CardContent className="divide-y divide-border pt-1">
              {erros.map((e, i) => (
                <div key={i} className="flex flex-col gap-0.5 py-2 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate font-mono text-body-sm text-danger">{e.action}</span>
                    <span className="shrink-0 text-caption text-muted-foreground tabular-nums">
                      {formatarQuando(e.created_at)}
                    </span>
                  </div>
                  {e.error_message && (
                    <span className="truncate text-caption text-muted-foreground">
                      {e.error_message}
                    </span>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </section>
    </main>
  )
}
