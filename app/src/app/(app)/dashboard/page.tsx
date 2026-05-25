import {
  AlertTriangle,
  CheckSquare,
  Package,
  RefreshCw,
  Users,
} from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"
import { PageHeader } from "@/components/shared/page-header"
import { BrandLink } from "@/components/ui/brand-link"

async function getDashboardData() {
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
        .select("atual, minimo")
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
    ])

    const pendentes = Math.max(0, (totalChecklists ?? 0) - (concluidosHoje ?? 0))

    const criticos = (estoqueItens ?? []).filter(
      (item) => (item.minimo ?? 0) > 0 && (item.atual ?? 0) < (item.minimo ?? 0)
    ).length

    return {
      pendentes,
      criticos,
      rodadas: rodadasCount ?? 0,
      equipe: equipeCount ?? 0,
    }
  } catch (e) {
    console.error('[dashboard] getDashboardData error:', e)
    return { pendentes: 0, criticos: 0, rodadas: 0, equipe: 0 }
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

export default async function DashboardPage() {
  const { pendentes, criticos, rodadas, equipe } = await getDashboardData()

  const dataHoje = formatarDataHoje()

  return (
    <main className="p-4 space-y-6">
      {/* Header */}
      <PageHeader title="Bica &amp; AMP 213" subtitle={dataHoje} />

      {/* Stat Cards Grid */}
      <section>
        <h2 className="sr-only">Resumo do dia</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            label="Checklists Pendentes"
            value={pendentes}
            sub={pendentes === 0 ? "Todos concluídos" : `não concluído${pendentes !== 1 ? 's' : ''} hoje`}
            accent={pendentes > 0 ? "danger" : "success"}
            icon={<CheckSquare />}
          />
          <StatCard
            label="Estoque Crítico"
            value={criticos}
            sub={criticos === 0 ? "Estoque OK" : "abaixo do mínimo"}
            accent={criticos > 0 ? "danger" : "success"}
            icon={<Package />}
          />
          <StatCard
            label="Rodada Aberta"
            value={rodadas > 0 ? rodadas : "—"}
            sub={rodadas > 0 ? "compra em andamento" : "nenhuma aberta"}
            accent={rodadas > 0 ? "primary" : undefined}
            icon={<RefreshCw />}
          />
          <StatCard
            label="Equipe Hoje"
            value={equipe}
            sub="membros ativos"
            icon={<Users />}
          />
        </div>
      </section>

      {/* Ações Rápidas */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Ações Rápidas
        </h2>
        <div className="flex flex-col gap-3">
          <BrandLink href="/checklists" badge={pendentes > 0 ? pendentes : undefined}>
            <CheckSquare className="size-5" />
            Ver Checklists
          </BrandLink>
          <BrandLink href="/compras" badge={criticos > 0 ? criticos : undefined}>
            <AlertTriangle className="size-5" />
            Lista de Compras
          </BrandLink>
        </div>
      </section>
    </main>
  )
}
