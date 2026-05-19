import { Package } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ItemEstoque } from '@/components/estoque/item-estoque'
import type { Database } from '@/types/database.types'

type Categoria = Database['public']['Tables']['estoque_categorias']['Row']
type Item = Database['public']['Tables']['estoque_itens']['Row']

async function getEstoqueData(): Promise<{ categorias: Categoria[]; itens: Item[] }> {
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const [{ data: categorias }, { data: itens }] = await Promise.all([
      supabase.from('estoque_categorias').select('*').order('ordem'),
      supabase.from('estoque_itens').select('*').eq('ativo', true).order('nome'),
    ])
    return { categorias: categorias ?? [], itens: itens ?? [] }
  } catch {
    return { categorias: [], itens: [] }
  }
}

function isCritico(item: Item): boolean {
  const atual = item.atual ?? 0
  const minimo = item.minimo ?? 0
  return minimo > 0 && atual < minimo
}

export default async function EstoquePage() {
  const { categorias, itens } = await getEstoqueData()

  const criticos = itens.filter(isCritico)

  const itensPorCategoria = new Map<string, Item[]>()
  for (const item of itens) {
    const catId = item.categoria_id ?? '__sem_categoria__'
    if (!itensPorCategoria.has(catId)) itensPorCategoria.set(catId, [])
    itensPorCategoria.get(catId)!.push(item)
  }

  // Categorias que têm itens
  const categoriasComItens = categorias.filter(
    (c) => (itensPorCategoria.get(c.id)?.length ?? 0) > 0
  )

  // Itens sem categoria
  const semCategoria = itensPorCategoria.get('__sem_categoria__') ?? []

  return (
    <main className="p-4 space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Estoque</h1>
          <p className="text-xs text-muted-foreground">
            {itens.length} {itens.length === 1 ? 'item cadastrado' : 'itens cadastrados'}
          </p>
        </div>
        {criticos.length > 0 && (
          <Badge variant="destructive" className="shrink-0 mt-1">
            {criticos.length} crítico{criticos.length !== 1 ? 's' : ''}
          </Badge>
        )}
      </div>

      {/* Filtro visual por categoria */}
      {categorias.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
          <button
            type="button"
            className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border border-transparent"
            style={{ backgroundColor: 'var(--color-bica)', color: '#fff' }}
          >
            Todos
          </button>
          {categorias.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border bg-muted text-muted-foreground"
            >
              {cat.emoji ? `${cat.emoji} ` : ''}{cat.nome}
            </button>
          ))}
        </div>
      )}

      {/* Empty state global */}
      {itens.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <Package className="size-12 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">Nenhum item de estoque cadastrado</p>
        </div>
      )}

      {/* Categorias com itens */}
      {categoriasComItens.map((categoria) => {
        const itensCategoria = itensPorCategoria.get(categoria.id) ?? []
        return (
          <section key={categoria.id}>
            {/* Header da categoria — sticky */}
            <div className="sticky top-0 bg-background z-10 pb-1 mb-1">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                {categoria.emoji && <span>{categoria.emoji}</span>}
                {categoria.nome}
                <span className="text-xs font-normal text-muted-foreground ml-1">
                  ({itensCategoria.length})
                </span>
              </h2>
              <div className="h-px bg-border mt-1" />
            </div>

            {/* Lista de itens */}
            <div className="divide-y divide-border">
              {itensCategoria.map((item) => (
                <ItemEstoque
                  key={item.id}
                  nome={item.nome}
                  unidade={item.unidade}
                  atual={item.atual ?? 0}
                  minimo={item.minimo ?? 0}
                />
              ))}
            </div>
          </section>
        )
      })}

      {/* Itens sem categoria */}
      {semCategoria.length > 0 && (
        <section>
          <div className="sticky top-0 bg-background z-10 pb-1 mb-1">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              Outros
              <span className="text-xs font-normal text-muted-foreground ml-1">
                ({semCategoria.length})
              </span>
            </h2>
            <div className="h-px bg-border mt-1" />
          </div>
          <div className="divide-y divide-border">
            {semCategoria.map((item) => (
              <ItemEstoque
                key={item.id}
                nome={item.nome}
                unidade={item.unidade}
                atual={item.atual ?? 0}
                minimo={item.minimo ?? 0}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
