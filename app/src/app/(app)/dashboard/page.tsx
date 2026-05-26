import { DashboardContent } from "@/components/dashboard/dashboard-content"

interface CriticoItem {
  nome: string
  atual: number
  minimo: number
  unidade: string
}

interface ScaleMember {
  confirmado: boolean
  turno: string
  nome: string
  funcao: string
}

interface DashboardData {
  totalChecklists: number
  concluidosHoje: number
  rodadasCount: number
  equipeCount: number
  criticalList: CriticoItem[]
  scaleList: ScaleMember[]
}

const EMPTY: DashboardData = {
  totalChecklists: 0,
  concluidosHoje: 0,
  rodadasCount: 0,
  equipeCount: 0,
  criticalList: [],
  scaleList: [],
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
      { data: escalaData },
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
      // PostgREST doesn't support col-vs-col comparisons directly, we filter client-side/in-memory
      supabase
        .from("estoque_itens")
        .select("nome, atual, minimo, unidade")
        .eq("casa", casa)
        .eq("ativo", true),
      supabase
        .from("rodadas")
        .select("id", { count: "exact", head: true })
        .eq("casa", casa)
        .eq("status", "aberta"),
      supabase
        .from("escala")
        .select("confirmado, turno, equipe(nome, funcao)")
        .eq("casa", casa)
        .eq("data", hoje),
    ])

    const criticalList = (estoqueItens ?? [])
      .filter((item) => (item.minimo ?? 0) > 0 && (item.atual ?? 0) < (item.minimo ?? 0))
      .map((item) => ({
        nome: item.nome ?? "—",
        atual: item.atual ?? 0,
        minimo: item.minimo ?? 0,
        unidade: item.unidade ?? "un",
      }))

    const scaleList = (escalaData ?? []).map((entry) => {
      const rawEquipe = entry.equipe
      let equipe: { nome: string; funcao: string } | null = null

      if (Array.isArray(rawEquipe)) {
        if (rawEquipe.length > 0) {
          equipe = rawEquipe[0] as unknown as { nome: string; funcao: string }
        }
      } else if (rawEquipe) {
        equipe = rawEquipe as unknown as { nome: string; funcao: string }
      }

      return {
        confirmado: entry.confirmado ?? false,
        turno: entry.turno || "",
        nome: equipe?.nome || "Membro",
        funcao: equipe?.funcao || "Funcionário",
      }
    })

    return {
      totalChecklists: totalChecklists ?? 0,
      concluidosHoje: concluidosHoje ?? 0,
      rodadasCount: rodadasCount ?? 0,
      equipeCount: scaleList.length,
      criticalList,
      scaleList,
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

export default async function DashboardPage() {
  const initialData = await getDashboardData()
  const dataHoje = formatarDataHoje()

  return (
    <main className="min-h-screen bg-background">
      <DashboardContent initialData={initialData} dataHoje={dataHoje} />
    </main>
  )
}
