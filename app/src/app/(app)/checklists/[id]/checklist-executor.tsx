'use client'

import { useOptimistic, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { marcarItemChecklist, reabrirChecklist } from '@/app/actions/checklist'
import { Button } from '@/components/ui/button'
import { ChecklistProgressBar } from '@/components/checklists/checklist-progress-bar'
import { ChecklistItem } from '@/components/checklists/checklist-item'
import { CompletionBanner } from '@/components/checklists/completion-banner'

type Props = {
  checklistId: string
  nome: string
  turno: string
  itens: string[]
  itensConcluidos: string[]
  concluido: boolean
}

export function ChecklistExecutor({
  checklistId,
  nome,
  turno,
  itens,
  itensConcluidos,
}: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const isAbertura = turno.toLowerCase() === 'abertura'
  const corClass = isAbertura ? 'text-primary' : 'text-amp'

  const [concluidos, setConcluidos] = useOptimistic(
    new Set(itensConcluidos),
    (state, { item, marcar }: { item: string; marcar: boolean }) => {
      const next = new Set(state)
      if (marcar) next.add(item)
      else next.delete(item)
      return next
    },
  )

  const percent = itens.length > 0 ? Math.round((concluidos.size / itens.length) * 100) : 0
  const todosFeitos = concluidos.size >= itens.length && itens.length > 0

  function handleToggle(item: string) {
    const marcar = !concluidos.has(item)
    startTransition(async () => {
      setConcluidos({ item, marcar })
      await marcarItemChecklist(checklistId, item, marcar)
    })
  }

  function handleReabrir() {
    startTransition(async () => {
      await reabrirChecklist(checklistId)
    })
  }

  return (
    <main className="p-4 space-y-5 pb-24">
      {/* Voltar */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="-ml-2 text-b3 hover:text-b1"
      >
        <ChevronLeft className="size-4 mr-1" />
        Checklists
      </Button>

      {/* Header */}
      <div className="bg-ink2 rounded-xl px-4 py-3 space-y-0.5">
        <span className={cn('text-xs font-medium uppercase tracking-wide', corClass)}>
          {turno}
        </span>
        <h1 className="font-display text-2xl leading-tight text-b1">{nome}</h1>
      </div>

      {/* Progresso */}
      <ChecklistProgressBar
        total={itens.length}
        concluidos={concluidos.size}
        percent={percent}
        concluido={todosFeitos}
      />

      {/* Concluído banner */}
      {todosFeitos && (
        <CompletionBanner
          nome={nome}
          onReabrir={handleReabrir}
          isPending={isPending}
        />
      )}

      {/* Lista de itens */}
      <ul className="divide-y divide-border/50 rounded-xl border border-border overflow-hidden">
        {itens.map((item) => (
          <ChecklistItem
            key={item}
            item={item}
            concluido={concluidos.has(item)}
            onToggle={() => handleToggle(item)}
          />
        ))}
      </ul>
    </main>
  )
}
