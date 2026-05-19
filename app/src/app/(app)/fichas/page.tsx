import { ChefHat } from 'lucide-react'
import type { Tables } from '@/types/database.types'
import { FichaCard } from '@/components/fichas/ficha-card'
import { getCurrentCasa } from '@/lib/tenant'

type FichaTecnica = Tables<'fichas_tecnicas'>

async function getFichasData(casa: string, q?: string, categoria?: string) {
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    let query = supabase
      .from('fichas_tecnicas')
      .select('*')
      .eq('casa', casa)
      .eq('ativo', true)
      .order('nome')

    if (q) query = query.ilike('nome', `%${q}%`)
    if (categoria) query = query.eq('categoria', categoria)

    const { data: fichas } = await query
    return { fichas: fichas ?? [] }
  } catch {
    return { fichas: [] }
  }
}

function calcularStats(fichas: FichaTecnica[]) {
  if (fichas.length === 0) return { cmvMedio: null, custoMedio: null, total: 0 }
  const comCmv = fichas.filter((f) => f.cmv_pct != null)
  const comCusto = fichas.filter((f) => f.custo_total != null)
  const cmvMedio = comCmv.length > 0
    ? comCmv.reduce((s, f) => s + (f.cmv_pct ?? 0), 0) / comCmv.length
    : null
  const custoMedio = comCusto.length > 0
    ? comCusto.reduce((s, f) => s + (f.custo_total ?? 0), 0) / comCusto.length
    : null
  return { cmvMedio, custoMedio, total: fichas.length }
}

function agruparPorCategoria(fichas: FichaTecnica[]): Record<string, FichaTecnica[]> {
  return fichas.reduce<Record<string, FichaTecnica[]>>((acc, f) => {
    const cat = f.categoria ?? 'Sem categoria'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(f)
    return acc
  }, {})
}

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

type Props = { searchParams: Promise<{ q?: string; cat?: string }> }

export default async function FichasPage({ searchParams }: Props) {
  const [casa, { q, cat }] = await Promise.all([getCurrentCasa(), searchParams])

  const casaColor = casa === 'bica' ? 'var(--color-bica)' : 'var(--color-amp)'
  const { fichas } = await getFichasData(casa, q, cat)

  // categorias disponíveis para o filtro (sem filtro ativo)
  const { fichas: todasFichas } = await getFichasData(casa)
  const categoriasDisponiveis = Array.from(
    new Set(todasFichas.map((f) => f.categoria).filter(Boolean) as string[])
  ).sort()

  const { cmvMedio, custoMedio, total } = calcularStats(fichas)
  const grupos = agruparPorCategoria(fichas)
  const categorias = Object.keys(grupos).sort()

  const cmvDanger = cmvMedio != null && cmvMedio > 30
  const cmvColorStyle = cmvDanger
    ? { color: 'var(--color-amp)' }
    : cmvMedio != null
    ? { color: '#16a34a' }
    : undefined

  const temFiltro = !!q || !!cat

  return (
    <main className="p-4 space-y-5 pb-24">
      <div>
        <h1 className="text-xl font-bold" style={{ color: casaColor }}>
          Ficha Técnica / CMV
        </h1>
      </div>

      {/* Stats CMV */}
      {todasFichas.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg border shadow-sm bg-card p-3 flex flex-col gap-1">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              CMV Médio
            </span>
            <span className="text-2xl font-bold tabular-nums leading-none" style={cmvColorStyle}>
              {cmvMedio != null ? `${cmvMedio.toFixed(1)}%` : '—'}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {cmvDanger ? 'acima da meta' : 'dentro da meta'}
            </span>
          </div>
          <div className="rounded-lg border shadow-sm bg-card p-3 flex flex-col gap-1">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              Custo Médio
            </span>
            <span className="text-base font-bold tabular-nums leading-snug">
              {custoMedio != null ? brl.format(custoMedio) : '—'}
            </span>
            <span className="text-[10px] text-muted-foreground">por ficha</span>
          </div>
          <div className="rounded-lg border shadow-sm bg-card p-3 flex flex-col gap-1">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              Total
            </span>
            <span className="text-2xl font-bold tabular-nums leading-none">{total}</span>
            <span className="text-[10px] text-muted-foreground">fichas</span>
          </div>
        </div>
      )}

      {/* Busca por nome */}
      <form method="GET" action="/fichas" className="flex gap-2">
        {cat && <input type="hidden" name="cat" value={cat} />}
        <input
          name="q"
          defaultValue={q ?? ''}
          placeholder="Buscar ficha…"
          className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {temFiltro && (
          <a
            href="/fichas"
            className="px-3 py-2 rounded-lg border text-xs hover:bg-muted flex items-center"
          >
            Limpar
          </a>
        )}
      </form>

      {/* Filtro por categoria */}
      {categoriasDisponiveis.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
          <a
            href={q ? `/fichas?q=${q}` : '/fichas'}
            className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
            style={!cat ? { backgroundColor: casaColor, color: '#fff', borderColor: casaColor } : undefined}
          >
            Todas
          </a>
          {categoriasDisponiveis.map((c) => (
            <a
              key={c}
              href={q ? `/fichas?q=${q}&cat=${encodeURIComponent(c)}` : `/fichas?cat=${encodeURIComponent(c)}`}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
              style={cat === c ? { backgroundColor: casaColor, color: '#fff', borderColor: casaColor } : undefined}
            >
              {c}
            </a>
          ))}
        </div>
      )}

      {/* Lista */}
      <section className="space-y-6">
        {fichas.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
            <ChefHat className="size-12 opacity-40" />
            <p className="text-sm">
              {temFiltro ? 'Nenhuma ficha encontrada com esses filtros.' : 'Nenhuma ficha cadastrada'}
            </p>
          </div>
        ) : (
          categorias.map((categoria) => (
            <div key={categoria}>
              <h2 className="mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {categoria}
              </h2>
              <div className="space-y-3">
                {grupos[categoria].map((ficha) => (
                  <FichaCard key={ficha.id} ficha={ficha} />
                ))}
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  )
}
