import { CheckSquare } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ChecklistCard } from '@/components/checklists/checklist-card'
import type { Database } from '@/types/database.types'

type Checklist = Database['public']['Tables']['checklists']['Row']
type Registro = Database['public']['Tables']['checklist_registros']['Row']

async function getChecklists(): Promise<{ checklists: Checklist[]; registros: Registro[] }> {
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const hoje = new Date().toISOString().split('T')[0]

    const { data: checklists } = await supabase
      .from('checklists')
      .select('*')
      .order('turno')

    const { data: registros } = await supabase
      .from('checklist_registros')
      .select('*')
      .eq('data', hoje)

    return { checklists: checklists ?? [], registros: registros ?? [] }
  } catch (e) {
    console.error('[checklists] getChecklists error:', e)
    return { checklists: [], registros: [] }
  }
}

function formatarData(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export default async function ChecklistsPage() {
  const { checklists, registros } = await getChecklists()

  const registroMap = new Map<string, Registro>()
  for (const reg of registros) {
    if (reg.checklist_id) {
      registroMap.set(reg.checklist_id, reg)
    }
  }

  const pendentes = checklists.filter((c) => {
    const reg = registroMap.get(c.id)
    return !reg || !reg.concluido
  })

  const abertura = checklists.filter((c) => c.turno.toLowerCase() === 'abertura')
  const fechamento = checklists.filter((c) => c.turno.toLowerCase() === 'fechamento')
  const outros = checklists.filter(
    (c) =>
      c.turno.toLowerCase() !== 'abertura' && c.turno.toLowerCase() !== 'fechamento'
  )

  const grupos: { label: string; items: Checklist[] }[] = []
  if (abertura.length > 0) grupos.push({ label: 'Abertura', items: abertura })
  if (fechamento.length > 0) grupos.push({ label: 'Fechamento', items: fechamento })
  if (outros.length > 0) grupos.push({ label: 'Outros', items: outros })

  return (
    <main className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Checklists</h1>
          <p className="text-xs text-muted-foreground capitalize">
            {formatarData(new Date())}
          </p>
        </div>
        {pendentes.length > 0 && (
          <Badge variant="destructive" className="shrink-0 mt-1">
            {pendentes.length} pendente{pendentes.length !== 1 ? 's' : ''}
          </Badge>
        )}
      </div>

      {/* Empty state */}
      {checklists.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <CheckSquare className="size-12 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">Nenhum checklist cadastrado</p>
        </div>
      )}

      {/* Grupos por turno */}
      {grupos.map((grupo) => (
        <section key={grupo.label} className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {grupo.label}
          </h2>
          <div className="space-y-3">
            {grupo.items.map((checklist) => {
              const itens = Array.isArray(checklist.itens) ? checklist.itens : []
              const totalItens = itens.length
              const reg = registroMap.get(checklist.id)
              const itensConcluidos = Array.isArray(reg?.itens_concluidos)
                ? reg.itens_concluidos.length
                : 0

              return (
                <ChecklistCard
                  key={checklist.id}
                  id={checklist.id}
                  nome={checklist.nome}
                  turno={checklist.turno}
                  totalItens={totalItens}
                  itensConcluidos={itensConcluidos}
                />
              )
            })}
          </div>
        </section>
      ))}
    </main>
  )
}
