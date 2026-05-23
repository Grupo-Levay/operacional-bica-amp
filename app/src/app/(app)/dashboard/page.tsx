import Link from "next/link"
import {
  AlertTriangle,
  CalendarCheck,
  CheckSquare,
  Package,
  RefreshCw,
  Users,
} from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"
import { getCurrentCasa, CASA_LABELS } from "@/lib/tenant"
import { getTodayISO } from "@/lib/utils"

async function getDashboardData(casa: string) {
  try {
    const { createClient } = await import("@/lib/supabase/server")
    const supabase = await createClient()
    const hoje = getTodayISO()

    const [pendentes, criticos, rodadas, equipe, reservasPendentes] = await Promise.all([
      supabase
        .from("checklist_registros")
        .select("id", { count: "exact", head: true })
        .eq("casa", casa)
        .eq("data", hoje)
        .eq("concluido", false),
      supabase
        .from("estoque_itens")
        .select("id", { count: "exact", head: true })
        .eq("casa", casa)
        .filter("atual", "lt", "minimo")
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
        .select("id", { count: "exact", head: true })
        .eq("casa", casa)
        .eq("reservation_date", hoje)
        .eq("status", "pendente"),
    ])

    return {
      pendentes: pendentes.count ?? 0,
      criticos: criticos.count ?? 0,
      rodadas: rodadas.count ?? 0,
      equipe: equipe.count ?? 0,
      reservasPendentes: reservasPendentes.count ?? 0,
    }
  } catch {
    return { pendentes: 0, criticos: 0, rodadas: 0, equipe: 0, reservasPendentes: 0 }
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
  const casa = await getCurrentCasa()
  const { pendentes, criticos, rodadas, equipe, reservasPendentes } = await getDashboardData(casa)

  const dataHoje = formatarDataHoje()
  const casaColor = casa === "bica" ? "var(--color-bica)" : "var(--color-amp)"
  const casaLabel = CASA_LABELS[casa]

  return (
    <main className="p-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold" style={{ color: casaColor }}>
          {casaLabel}
        </h1>
        <p className="text-sm text-muted-foreground capitalize">{dataHoje}</p>
      </div>

      {/* Stat Cards Grid */}
      <section>
        <h2 className="sr-only">Resumo do dia</h2>
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="Checklists Pendentes"
            value={pendentes}
            sub={pendentes === 0 ? "Tudo em dia" : "itens abertos hoje"}
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
          <Link href="/reservas" className="block">
            <StatCard
              label="Reservas Pendentes"
              value={reservasPendentes}
              sub={reservasPendentes === 0 ? "nenhuma hoje" : "aguardando confirmação"}
              accent={reservasPendentes > 0 ? "danger" : undefined}
              icon={<CalendarCheck />}
            />
          </Link>
        </div>
      </section>

      {/* Ações Rápidas */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Ações Rápidas
        </h2>
        <div className="flex flex-col gap-3">
          <Link
            href="/checklists"
            className="flex items-center justify-center gap-2 rounded-lg px-4 font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80"
            style={{
              height: 56,
              backgroundColor: casaColor,
            }}
          >
            <CheckSquare className="size-5" />
            Ver Checklists
            {pendentes > 0 && (
              <span className="ml-1 rounded-full bg-white/25 px-2 py-0.5 text-xs font-bold">
                {pendentes}
              </span>
            )}
          </Link>
          <Link
            href="/compras"
            className="flex items-center justify-center gap-2 rounded-lg px-4 font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80"
            style={{
              height: 56,
              backgroundColor: casaColor,
            }}
          >
            <AlertTriangle className="size-5" />
            Lista de Compras
            {criticos > 0 && (
              <span className="ml-1 rounded-full bg-white/25 px-2 py-0.5 text-xs font-bold">
                {criticos}
              </span>
            )}
          </Link>
          <Link
            href="/reservas"
            className="flex items-center justify-center gap-2 rounded-lg px-4 font-semibold transition-opacity hover:opacity-90 active:opacity-80 border"
            style={{ height: 56 }}
          >
            <CalendarCheck className="size-5" />
            Reservas de Hoje
            {reservasPendentes > 0 && (
              <span
                className="ml-1 rounded-full px-2 py-0.5 text-xs font-bold text-white"
                style={{ backgroundColor: "var(--color-amp)" }}
              >
                {reservasPendentes}
              </span>
            )}
          </Link>
        </div>
      </section>
    </main>
  )
}
