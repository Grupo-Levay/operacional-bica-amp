import { Badge } from '@/components/ui/badge'
import { EstoqueList } from '@/components/estoque/estoque-list'
import { PageHeader } from '@/components/shared/page-header'
import type { Database } from '@/types/database.types'

type Categoria = Database['public']['Tables']['estoque_categorias']['Row']
type Item = Database['public']['Tables']['estoque_itens']['Row']

async function getEstoqueData(): Promise<{ categorias: Categoria[]; itens: Item[] }> {
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const { getCurrentCasa } = await import('@/lib/tenant')
    const supabase = await createClient()
    const casa = await getCurrentCasa()
    const [{ data: categorias }, { data: itens }] = await Promise.all([
      supabase.from('estoque_categorias').select('*').eq('casa', casa).order('ordem'),
      supabase.from('estoque_itens').select('*').eq('casa', casa).eq('ativo', true).order('nome'),
    ])
    return { categorias: categorias ?? [], itens: itens ?? [] }
  } catch (e) {
    console.error('[estoque] getEstoqueData error:', e)
    return { categorias: [], itens: [] }
  }
}

export default async function EstoquePage() {
  const { categorias, itens } = await getEstoqueData()
  const criticos = itens.filter(i => (i.minimo ?? 0) > 0 && (i.atual ?? 0) < (i.minimo ?? 0))

  return (
    <main className="p-4 space-y-6 pb-24">
      <PageHeader
        title="Estoque"
        subtitle={`${itens.length} ${itens.length === 1 ? 'item cadastrado' : 'itens cadastrados'}`}
        badge={criticos.length > 0 ? (
          <Badge variant="destructive" className="shrink-0">
            {criticos.length} crítico{criticos.length !== 1 ? 's' : ''}
          </Badge>
        ) : undefined}
      />

      <EstoqueList categorias={categorias} itens={itens} />
    </main>
  )
}
