import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ChefHat } from 'lucide-react'
import { getCurrentCasa } from '@/lib/tenant'

type Ingrediente = {
  nome: string
  quantidade?: number
  unidade?: string
  custo?: number
}

async function getFicha(id: string, casa: string) {
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data } = await supabase
      .from('fichas_tecnicas')
      .select('*')
      .eq('id', id)
      .eq('casa', casa)
      .eq('ativo', true)
      .single()
    return data
  } catch {
    return null
  }
}

function parseIngredientes(raw: unknown): Ingrediente[] {
  if (!Array.isArray(raw)) return []
  return raw.map((item) => {
    if (typeof item === 'string') return { nome: item }
    if (typeof item === 'object' && item !== null) {
      const obj = item as Record<string, unknown>
      return {
        nome: String(obj.nome ?? obj.name ?? obj.ingrediente ?? ''),
        quantidade: typeof obj.quantidade === 'number' ? obj.quantidade : undefined,
        unidade: typeof obj.unidade === 'string' ? obj.unidade : undefined,
        custo: typeof obj.custo === 'number' ? obj.custo : undefined,
      }
    }
    return { nome: String(item) }
  }).filter((i) => i.nome)
}

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

function cmvColor(pct: number | null): string {
  if (pct == null) return 'text-muted-foreground'
  if (pct <= 25) return 'text-green-600'
  if (pct <= 35) return 'text-yellow-600'
  return 'text-red-600'
}

type Props = { params: Promise<{ id: string }> }

export default async function FichaDetailPage({ params }: Props) {
  const { id } = await params
  const casa = await getCurrentCasa()
  const ficha = await getFicha(id, casa)

  if (!ficha) notFound()

  const casaColor = casa === 'bica' ? 'var(--color-bica)' : 'var(--color-amp)'
  const ingredientes = parseIngredientes(ficha.ingredientes)

  return (
    <main className="p-4 space-y-5 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/fichas"
          className="flex items-center justify-center size-9 rounded-full border transition-colors hover:bg-accent"
          aria-label="Voltar para fichas"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="min-w-0">
          <h1 className="text-lg font-semibold leading-tight truncate">{ficha.nome}</h1>
          {ficha.categoria && (
            <p className="text-xs font-medium" style={{ color: casaColor }}>
              {ficha.categoria}
            </p>
          )}
        </div>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-2 gap-3">
        {ficha.cmv_pct != null && (
          <div className="rounded-lg border shadow-sm bg-card p-4 flex flex-col gap-1">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              CMV
            </span>
            <span className={`text-3xl font-bold tabular-nums leading-none ${cmvColor(ficha.cmv_pct)}`}>
              {ficha.cmv_pct.toFixed(1)}%
            </span>
            <span className="text-[10px] text-muted-foreground">
              {ficha.cmv_pct > 30 ? 'acima da meta' : 'dentro da meta'}
            </span>
          </div>
        )}

        {ficha.custo_total != null && (
          <div className="rounded-lg border shadow-sm bg-card p-4 flex flex-col gap-1">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              Custo total
            </span>
            <span className="text-2xl font-bold tabular-nums leading-none">
              {brl.format(ficha.custo_total)}
            </span>
            {ficha.rendimento != null && (
              <span className="text-[10px] text-muted-foreground">
                rende {ficha.rendimento} {ficha.unidade_rendimento ?? 'un'}
              </span>
            )}
          </div>
        )}

        {ficha.preco_venda != null && (
          <div className="rounded-lg border shadow-sm bg-card p-4 flex flex-col gap-1">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              Preço de venda
            </span>
            <span className="text-2xl font-bold tabular-nums leading-none" style={{ color: casaColor }}>
              {brl.format(ficha.preco_venda)}
            </span>
          </div>
        )}

        {ficha.custo_total != null && ficha.rendimento != null && ficha.rendimento > 0 && (
          <div className="rounded-lg border shadow-sm bg-card p-4 flex flex-col gap-1">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              Custo unitário
            </span>
            <span className="text-2xl font-bold tabular-nums leading-none">
              {brl.format(ficha.custo_total / ficha.rendimento)}
            </span>
            <span className="text-[10px] text-muted-foreground">
              por {ficha.unidade_rendimento ?? 'un'}
            </span>
          </div>
        )}
      </div>

      {/* Ingredientes */}
      <section>
        <h2 className="mb-3 text-sm font-semibold flex items-center gap-2">
          <ChefHat size={16} />
          Ingredientes
          {ingredientes.length > 0 && (
            <span className="text-xs font-normal text-muted-foreground">
              ({ingredientes.length})
            </span>
          )}
        </h2>

        {ingredientes.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            Nenhum ingrediente cadastrado
          </p>
        ) : (
          <ul className="divide-y divide-border rounded-lg border shadow-sm overflow-hidden">
            {ingredientes.map((ing, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between px-4 py-3 bg-card text-sm"
              >
                <span className="font-medium">{ing.nome}</span>
                <div className="flex items-center gap-3 text-muted-foreground text-xs">
                  {ing.quantidade != null && (
                    <span className="tabular-nums">
                      {ing.quantidade} {ing.unidade ?? ''}
                    </span>
                  )}
                  {ing.custo != null && (
                    <span className="tabular-nums font-medium text-foreground">
                      {brl.format(ing.custo)}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
