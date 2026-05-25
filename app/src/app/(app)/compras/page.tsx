import { RodadaCard } from "@/components/compras/rodada-card"
import { NovaRodadaButton } from "@/components/compras/nova-rodada-button"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { Tables } from "@/types/database.types"

type ComprasCategoria = Tables<"compras_categorias"> & {
  compras_itens: Tables<"compras_itens">[]
}
type RodadaItem = Tables<"rodada_itens">
type Rodada = Tables<"rodadas"> & { rodada_itens: RodadaItem[] }

async function getComprasData(): Promise<{
  rodadas: Rodada[]
  categorias: ComprasCategoria[]
}> {
  try {
    const { createClient } = await import("@/lib/supabase/server")
    const { getCurrentCasa } = await import("@/lib/tenant")
    const supabase = await createClient()
    const casa = await getCurrentCasa()
    const [{ data: rodadas }, { data: categorias }] = await Promise.all([
      supabase
        .from("rodadas")
        .select("*, rodada_itens(*)")
        .eq("casa", casa)
        .order("created_at", { ascending: false })
        .limit(10),
      supabase
        .from("compras_categorias")
        .select("*, compras_itens(*)")
        .eq("casa", casa)
        .order("ordem"),
    ])
    return {
      rodadas: (rodadas as Rodada[]) ?? [],
      categorias: (categorias as ComprasCategoria[]) ?? [],
    }
  } catch (e) {
    console.error('[compras] getComprasData error:', e)
    return { rodadas: [], categorias: [] }
  }
}

export default async function ComprasPage() {
  const { rodadas, categorias } = await getComprasData()

  const rodadaAberta = rodadas.find((r) => r.status === "aberta")
  const rodadasFechadas = rodadas.filter((r) => r.status !== "aberta")

  return (
    <main className="p-4 space-y-6">
      {/* Header */}
      <PageHeader title="Compras" action={<NovaRodadaButton />} />

      {/* Seção 1 — Rodadas */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold">Rodadas</h2>

        {rodadas.length === 0 ? (
          <EmptyState message="Nenhuma rodada criada" />
        ) : (
          <div className="space-y-4">
            {/* Rodada aberta em destaque */}
            {rodadaAberta && <RodadaCard rodada={rodadaAberta} />}

            {/* Rodadas fechadas */}
            {rodadasFechadas.length > 0 && (
              <div className="space-y-2">
                {rodadasFechadas.map((rodada) => (
                  <RodadaCard key={rodada.id} rodada={rodada} />
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Seção 2 — Catálogo */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold">Catálogo de itens</h2>

        {categorias.length === 0 ? (
          <EmptyState message="Nenhuma categoria cadastrada" />
        ) : (
          <div className="space-y-5">
            {categorias.map((categoria) => (
              <div key={categoria.id} className="space-y-2">
                <h3 className="text-sm font-semibold flex items-center gap-1.5">
                  {categoria.emoji && (
                    <span aria-hidden="true">{categoria.emoji}</span>
                  )}
                  {categoria.nome}
                </h3>

                {categoria.compras_itens.length === 0 ? (
                  <EmptyState message="Nenhum item nesta categoria" />
                ) : (
                  <ul className="divide-y divide-border rounded-lg border shadow-sm overflow-hidden">
                    {categoria.compras_itens.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center justify-between px-4 py-2 text-sm bg-card"
                      >
                        <span>{item.nome}</span>
                        <span className="text-muted-foreground text-xs">
                          {item.unidade ?? "un"}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
