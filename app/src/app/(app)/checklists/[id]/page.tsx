import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { getCurrentCasa } from '@/lib/tenant'
import { getTodayISO } from '@/lib/utils'
import { ChecklistItems } from '@/components/checklists/checklist-items'

async function getChecklistData(id: string, casa: string) {
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const [{ data: checklist }, { data: registro }] = await Promise.all([
      supabase.from('checklists').select('*').eq('id', id).eq('casa', casa).single(),
      supabase
        .from('checklist_registros')
        .select('itens_concluidos')
        .eq('checklist_id', id)
        .eq('casa', casa)
        .eq('data', getTodayISO())
        .maybeSingle(),
    ])

    return { checklist, registro }
  } catch {
    return { checklist: null, registro: null }
  }
}

type Props = { params: Promise<{ id: string }> }

export default async function ChecklistDetailPage({ params }: Props) {
  const { id } = await params
  const casa = await getCurrentCasa()
  const { checklist, registro } = await getChecklistData(id, casa)

  if (!checklist) notFound()

  const rawItems = Array.isArray(checklist.itens) ? checklist.itens : []
  const items: string[] = rawItems.map((item: unknown) =>
    typeof item === 'string' ? item : (item as { nome: string }).nome ?? String(item)
  )

  const concluidos: string[] = Array.isArray(registro?.itens_concluidos)
    ? (registro.itens_concluidos as string[])
    : []

  const casaColor = casa === 'bica' ? 'var(--color-bica)' : 'var(--color-amp)'

  return (
    <main className="p-4 space-y-5">
      <div className="flex items-center gap-3">
        <Link
          href="/checklists"
          className="flex items-center justify-center size-9 rounded-full border transition-colors hover:bg-accent"
          aria-label="Voltar para checklists"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="min-w-0">
          <h1 className="text-lg font-semibold leading-tight truncate">{checklist.nome}</h1>
          <p className="text-xs font-medium capitalize" style={{ color: casaColor }}>
            {checklist.turno}
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          Nenhum item cadastrado neste checklist.
        </p>
      ) : (
        <ChecklistItems
          checklistId={id}
          items={items}
          concluidos={concluidos}
          casaColor={casaColor}
        />
      )}
    </main>
  )
}
