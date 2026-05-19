import { Package } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ItemEstoque } from '@/components/estoque/item-estoque'
import { getCurrentCasa } from '@/lib/tenant'
import type { Database } from '@/types/database.types'

type Categoria = Database['public']['Tables']['estoque_categorias']['Row']
type Item = Database['public']['Tables']['estoque_itens']['Row']

async function getEstoqueData(casa: string): Promise<{ categorias: Categoria[]; itens: Item[] }> {
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const [{ data: categorias }, { data: itens }] = await Promise.all([
      supabase.from('estoque_categorias').select('*').eq('casa', casa).order('ordem'),
      supabase.from('estoque_itens').select('*').eq('casa', casa).eq('ativo', true).order('nome'),
    ])
    return { categorias: categorias ?? [], itens: itens ?? [] }
  } catch {
    return { categorias: [], itens: [] }
  }
}

function isCritico(item: Item): boolean {
  return (item.minimo ?? 0) > 0 && (item.atual ?? 0) < (item.minimo ?? 0)
}

type Props = { searchParams: Promise<{ cat?: string }> }

export default async function EstoquePage({ searchParams }: Props) {
  const [casa, { cat: catFiltro }] = await Promise.all([
    getCurrentCasa(),
    searchParams,
  ])

  const { categorias, itens } = await getEstoqueData(casa)
  const casaColor = casa === 'bica' ? 'var(--color-bica)' : 'var(--color-amp)'
  const criticos = itens.filter(isCritico)

  const itensPorCategoria = new Map<string, Item[]>()
  for (const item of itens) {
    const catId = item.categoria_id ?? '__sem__'
    if (!itensPorCategoria.has(catId)) itensPorCategoria.set(catId, [])
    itensPorCategoria.get(catId)!.push(item)
  }

  const categoriasComItens = categorias.filter(
    (c) => (itensPorCategoria.get(c.id)?.length ?? 0) > 0
  )
  const semCategoria = itensPorCategoria.get('__sem__') ?? []

  // aplica filtro de categoria via URL
  const categoriasVisiveis = catFiltro
    ? categoriasComItens.filter((c) => c.id === catFiltro)
    : categoriasComItens

  const semCategoriaVisivel = catFiltro ? [] : semCategoria

  return (
    <main className="p-4 space-y-5 pb-24">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: casaColor }}>Estoque</h1>
          <p className="text-xs text-muted-foreground">
            {itens.length} {itens.length === 1 ? 'item' : 'itens'} cadastrados
          </p>
        </div>
        {criticos.length > 0 && (
          <Badge variant="destructive" className="shrink-0 mt-1">
            {criticos.length} crítico{criticos.length !== 1 ? 's' : ''}
          </Badge>
        )}
      </div>

      {/* Filtro por categoria — links de URL para manter server-side */}
      {categorias.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
          <a
            href="/estoque"
            className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
            style={
              !catFiltro
                ? { backgroundColor: casaColor, color: '#fff', borderColor: casaColor }
                : undefined
            }
          >
            Todos
          </a>
          {categorias.map((cat) => (
            <a
              key={cat.id}
              href={`/estoque?cat=${cat.id}`}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
              style={
                catFiltro === cat.id
                  ? { backgroundColor: casaColor, color: '#fff', borderColor: casaColor }
                  : undefined
              }
            >
              {cat.emoji ? `${cat.emoji} ` : ''}{cat.nome}
            </a>
          ))}
        </div>
      )}

      {/* Empty state */}
      {itens.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <Package className="size-12 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">Nenhum item de estoque cadastrado</p>
        </div>
      )}

      {/* Categorias */}
      {categoriasVisiveis.map((categoria) => {
        const itensCategoria = itensPorCategoria.get(categoria.id) ?? []
        return (
          <section key={categoria.id}>
            <div className="sticky top-0 bg-background z-10 pb-1 mb-1">
              <h2 className="text-sm font-semibold flex items-center gap-1.5">
                {categoria.emoji && <span>{categoria.emoji}</span>}
                {categoria.nome}
                <span className="text-xs font-normal text-muted-foreground ml-1">
                  ({itensCategoria.length})
                </span>
              </h2>
              <div className="h-px bg-border mt-1" />
            </div>
            <div className="divide-y divide-border">
              {itensCategoria.map((item) => (
                <ItemEstoque
                  key={item.id}
                  id={item.id}
                  nome={item.nome}
                  unidade={item.unidade}
                  atual={item.atual ?? 0}
                  minimo={item.minimo ?? 0}
                  updatedAt={item.updated_at}
                />
              ))}
            </div>
          </section>
        )
      })}

      {/* Sem categoria */}
      {semCategoriaVisivel.length > 0 && (
        <section>
          <div className="sticky top-0 bg-background z-10 pb-1 mb-1">
            <h2 className="text-sm font-semibold flex items-center gap-1.5">
              Outros
              <span className="text-xs font-normal text-muted-foreground ml-1">
                ({semCategoriaVisivel.length})
              </span>
            </h2>
            <div className="h-px bg-border mt-1" />
          </div>
          <div className="divide-y divide-border">
            {semCategoriaVisivel.map((item) => (
              <ItemEstoque
                key={item.id}
                id={item.id}
                nome={item.nome}
                unidade={item.unidade}
                atual={item.atual ?? 0}
                minimo={item.minimo ?? 0}
                updatedAt={item.updated_at}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
