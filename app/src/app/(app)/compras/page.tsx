import { RodadaCard } from '@/components/compras/rodada-card'
import { NovaRodadaBtn } from '@/components/compras/nova-rodada-btn'
import { getCurrentCasa } from '@/lib/tenant'
import type { Tables } from '@/types/database.types'

type ComprasCategoria = Tables<'compras_categorias'> & {
  compras_itens: Tables<'compras_itens'>[]
}
type RodadaItem = Tables<'rodada_itens'>
type Rodada = Tables<'rodadas'> & { rodada_itens: RodadaItem[] }

async function getComprasData(casa: string): Promise<{
  rodadas: Rodada[]
  categorias: ComprasCategoria[]
}> {
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const [{ data: rodadas }, { data: categorias }] = await Promise.all([
      supabase
        .from('rodadas')
        .select('*, rodada_itens(*)')
        .eq('casa', casa)
        .order('created_at', { ascending: false })
        .limit(10),
      supabase
        .from('compras_categorias')
        .select('*, compras_itens(*)')
        .eq('casa', casa)
        .order('ordem'),
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
  const casa = await getCurrentCasa()
  const { rodadas, categorias } = await getComprasData(casa)

  const casaColor = casa === 'bica' ? 'var(--color-bica)' : 'var(--color-amp)'
  const rodadaAberta = rodadas.find((r) => r.status === 'aberta')
  const rodadasFechadas = rodadas.filter((r) => r.status !== 'aberta')

  return (
    <main className="p-4 space-y-6 pb-24">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-bold" style={{ color: casaColor }}>
          Compras
        </h1>
        <NovaRodadaBtn />
      </div>

      <section className="space-y-3">
        <h2 className="text-base font-semibold">Rodadas</h2>

        {rodadas.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            Nenhuma rodada criada. Crie uma nova rodada para iniciar as compras.
          </p>
        ) : (
          <div className="space-y-3">
            {rodadaAberta && <RodadaCard rodada={rodadaAberta} />}
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

      {categorias.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-base font-semibold">Catálogo de itens</h2>
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
                        className="flex items-center justify-between px-4 py-2.5 text-sm bg-card"
                      >
                        <span>{item.nome}</span>
                        <span className="text-muted-foreground text-xs">
                          {item.unidade ?? 'un'}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
