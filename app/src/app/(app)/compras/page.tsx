import { Button } from "@/components/ui/button"
import { RodadaCard } from "@/components/compras/rodada-card"
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
    const supabase = await createClient()
    const [{ data: rodadas }, { data: categorias }] = await Promise.all([
      supabase
        .from("rodadas")
        .select("*, rodada_itens(*)")
        .order("created_at", { ascending: false })
        .limit(10),
      supabase
        .from("compras_categorias")
        .select("*, compras_itens(*)")
        .order("ordem"),
    ])
    return {
      rodadas: (rodadas as Rodada[]) ?? [],
      categorias: (categorias as ComprasCategoria[]) ?? [],
    }
  } catch {
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
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-bold" style={{ color: "var(--color-bica)" }}>
          Compras
        </h1>
        <Button
          disabled
          size="sm"
          style={{
            backgroundColor: "var(--color-bica)",
            color: "#fff",
            opacity: 0.6,
          }}
        >
          Nova Rodada
        </Button>
      </div>

      {/* Seção 1 — Rodadas */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold">Rodadas</h2>

        {rodadas.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            Nenhuma rodada criada
          </p>
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
          <p className="text-sm text-muted-foreground italic">
            Nenhuma categoria cadastrada
          </p>
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
                  <p className="text-xs text-muted-foreground italic pl-1">
                    Nenhum item nesta categoria
                  </p>
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
