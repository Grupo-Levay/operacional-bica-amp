import Link from "next/link"
import {
  AlertTriangle,
  CalendarCheck,
  CheckSquare,
  ChefHat,
  Package,
  RefreshCw,
  Users,
} from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"
import { PageHeader } from "@/components/shared/page-header"
import { BrandLink } from "@/components/ui/brand-link"
import { Card } from "@/components/ui/card"

interface CriticoItem {
  nome: string
  atual: number
  minimo: number
}

interface DashboardData {
  pendentes: number
  totalChecklists: number
  criticos: number
  criticosTop: CriticoItem[]
  rodadas: number
  equipe: number
  reservasHoje: number
  reservasPendentes: number
  cmvMedio: number | null
  fichasCount: number
}

const EMPTY: DashboardData = {
  pendentes: 0,
  totalChecklists: 0,
  criticos: 0,
  criticosTop: [],
  rodadas: 0,
  equipe: 0,
  reservasHoje: 0,
  reservasPendentes: 0,
  cmvMedio: null,
  fichasCount: 0,
}

async function getDashboardData(): Promise<DashboardData> {
  try {
    const { createClient } = await import("@/lib/supabase/server")
    const { getCurrentCasa } = await import("@/lib/tenant")
    const supabase = await createClient()
    const casa = await getCurrentCasa()
    const hoje = new Date().toISOString().split("T")[0]

    const [
      { count: totalChecklists },
      { count: concluidosHoje },
      { data: estoqueItens },
      { count: rodadasCount },
      { count: equipeCount },
      { data: reservas },
      { data: fichas },
    ] = await Promise.all([
      supabase
        .from("checklists")
        .select("id", { count: "exact", head: true })
        .eq("casa", casa),
      supabase
        .from("checklist_registros")
        .select("id", { count: "exact", head: true })
        .eq("casa", casa)
        .eq("data", hoje)
        .eq("concluido", true),
      // PostgREST não suporta comparação coluna-vs-coluna — filtra client-side
      supabase
        .from("estoque_itens")
        .select("nome, atual, minimo")
        .eq("casa", casa)
        .eq("ativo", true),
      supabase
        .from("rodadas")
        .select("id", { count: "exact", head: true })
        .eq("casa", casa)
        .eq("status", "aberta"),
      supabase
        .from("equipe")
        .select("id", { count: "exact", head: true })
        .eq("casa", casa)
        .eq("ativo", true),
      supabase
        .from("reservations")
        .select("status")
        .eq("casa", casa)
        .eq("reservation_date", hoje),
      supabase
        .from("fichas_tecnicas")
        .select("cmv_pct")
        .eq("casa", casa),
    ])

    const total = totalChecklists ?? 0
    const pendentes = Math.max(0, total - (concluidosHoje ?? 0))

    const criticosAll = (estoqueItens ?? [])
      .filter((i) => (i.minimo ?? 0) > 0 && (i.atual ?? 0) < (i.minimo ?? 0))
      .map((i) => ({
        nome: i.nome ?? "—",
        atual: i.atual ?? 0,
        minimo: i.minimo ?? 0,
      }))
      .sort((a, b) => a.atual / a.minimo - b.atual / b.minimo)

    const reservasList = reservas ?? []
    const reservasPendentes = reservasList.filter(
      (r) => r.status === "pendente"
    ).length

    const cmvValores = (fichas ?? [])
      .map((f) => f.cmv_pct)
      .filter((v): v is number => typeof v === "number")
    const cmvMedio =
      cmvValores.length > 0
        ? cmvValores.reduce((a, b) => a + b, 0) / cmvValores.length
        : null

    return {
      pendentes,
      totalChecklists: total,
      criticos: criticosAll.length,
      criticosTop: criticosAll.slice(0, 5),
      rodadas: rodadasCount ?? 0,
      equipe: equipeCount ?? 0,
      reservasHoje: reservasList.length,
      reservasPendentes,
      cmvMedio,
      fichasCount: cmvValores.length,
    }
  } catch (e) {
    console.error("[dashboard] getDashboardData error:", e)
    return EMPTY
  }
}

function formatarDataHoje(): string {
  return new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function cmvAccent(cmv: number): "success" | "warning" | "danger" {
  if (cmv <= 25) return "success"
  if (cmv <= 35) return "warning"
  return "danger"
}

export default async function DashboardPage() {
  const d = await getDashboardData()
  const dataHoje = formatarDataHoje()

  const checklistProgress =
    d.totalChecklists > 0
      ? ((d.totalChecklists - d.pendentes) / d.totalChecklists) * 100
      : 0

  return (
    <main className="space-y-6 p-4">
      <PageHeader title="Bica &amp; AMP 213" subtitle={dataHoje} />

      {/* Bento grid */}
      <section>
        <h2 className="sr-only">Resumo do dia</h2>
        <div className="grid auto-rows-[minmax(108px,auto)] grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard
            className="col-span-2"
            label="Checklists"
            value={
              d.totalChecklists > 0
                ? `${d.totalChecklists - d.pendentes}/${d.totalChecklists}`
                : "—"
            }
            sub={
              d.pendentes === 0 && d.totalChecklists > 0
                ? "Tudo concluído hoje"
                : `${d.pendentes} pendente${d.pendentes !== 1 ? "s" : ""} hoje`
            }
            accent={d.pendentes > 0 ? "danger" : "success"}
            icon={<CheckSquare />}
            href="/checklists"
            progress={checklistProgress}
          />
          <StatCard
            label="Estoque Crítico"
            value={d.criticos}
            sub={d.criticos === 0 ? "Estoque OK" : "abaixo do mínimo"}
            accent={d.criticos > 0 ? "danger" : "success"}
            icon={<Package />}
            href="/estoque"
          />
          <StatCard
            label="Reservas Hoje"
            value={d.reservasHoje > 0 ? d.reservasHoje : "—"}
            sub={
              d.reservasHoje === 0
                ? "nenhuma para hoje"
                : `${d.reservasPendentes} pendente${d.reservasPendentes !== 1 ? "s" : ""}`
            }
            accent={d.reservasPendentes > 0 ? "warning" : "primary"}
            icon={<CalendarCheck />}
            href="/reservas"
          />
          <StatCard
            label="Rodada Aberta"
            value={d.rodadas > 0 ? d.rodadas : "—"}
            sub={d.rodadas > 0 ? "compra em andamento" : "nenhuma aberta"}
            accent={d.rodadas > 0 ? "primary" : undefined}
            icon={<RefreshCw />}
            href="/compras"
          />
          <StatCard
            label="Equipe Hoje"
            value={d.equipe}
            sub="membros ativos"
            icon={<Users />}
            href="/escala"
          />
          <StatCard
            className="col-span-2"
            label="CMV Médio"
            value={d.cmvMedio !== null ? `${d.cmvMedio.toFixed(1)}%` : "—"}
            sub={
              d.cmvMedio !== null
                ? `${d.fichasCount} ficha${d.fichasCount !== 1 ? "s" : ""} · meta ≤ 30%`
                : "sem fichas cadastradas"
            }
            accent={d.cmvMedio !== null ? cmvAccent(d.cmvMedio) : undefined}
            icon={<ChefHat />}
            href="/fichas"
          />
        </div>
      </section>

      {/* Painel de críticos + ações rápidas */}
      <section className="grid gap-3 md:grid-cols-2">
        <Card size="sm" className="gap-3 px-4 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Atenção no estoque
            </h2>
            {d.criticos > 0 && (
              <span className="font-mono text-xs text-danger">{d.criticos}</span>
            )}
          </div>
          {d.criticosTop.length === 0 ? (
            <p className="py-4 text-center text-sm text-success">
              Nenhum item abaixo do mínimo
            </p>
          ) : (
            <ul className="space-y-1.5">
              {d.criticosTop.map((item) => (
                <li
                  key={item.nome}
                  className="flex items-center justify-between gap-3 rounded-md bg-ink2 px-3 py-2"
                >
                  <span className="min-w-0 truncate text-sm text-b1">
                    {item.nome}
                  </span>
                  <span className="shrink-0 font-mono text-xs text-danger tabular-nums">
                    {item.atual}/{item.minimo}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/estoque"
            className="mt-auto text-sm font-medium text-primary hover:underline"
          >
            Ver estoque completo →
          </Link>
        </Card>

        <Card size="sm" className="gap-3 px-4 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Ações rápidas
          </h2>
          <div className="flex flex-col gap-3">
            <BrandLink
              href="/checklists"
              badge={d.pendentes > 0 ? d.pendentes : undefined}
            >
              <CheckSquare className="size-5" />
              Ver Checklists
            </BrandLink>
            <BrandLink
              href="/compras"
              badge={d.criticos > 0 ? d.criticos : undefined}
            >
              <AlertTriangle className="size-5" />
              Lista de Compras
            </BrandLink>
          </div>
        </Card>
      </section>
    </main>
  )
}
