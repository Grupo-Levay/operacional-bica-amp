'use client'

import { useOptimistic, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Check, ChevronLeft, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { marcarItemChecklist, reabrirChecklist } from '@/app/actions/checklist'

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
  const [, startTransition] = useTransition()
  const isAbertura = turno.toLowerCase() === 'abertura'
  const corClass = isAbertura ? 'text-bica' : 'text-amp'

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
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-muted-foreground -ml-1 touch-target"
      >
        <ChevronLeft className="size-4" />
        Checklists
      </button>

      {/* Header */}
      <div>
        <span
          className={cn('text-xs font-semibold uppercase tracking-wide', corClass)}
        >
          {turno}
        </span>
        <h1 className="font-display text-2xl leading-tight">{nome}</h1>
      </div>

      {/* Progresso */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{concluidos.size} de {itens.length} itens</span>
          <span>{percent}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-muted overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-300',
              isAbertura ? 'bg-bica' : 'bg-amp',
            )}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Concluído banner */}
      {todosFeitos && (
        <div
          className={cn(
            'flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium',
            isAbertura ? 'bg-bica text-bica-fg' : 'bg-amp text-amp-fg',
          )}
        >
          <div className="flex items-center gap-2">
            <Check className="size-4" />
            Checklist concluído!
          </div>
          <button
            type="button"
            onClick={handleReabrir}
            className="flex items-center gap-1 text-xs opacity-80 hover:opacity-100"
          >
            <RotateCcw className="size-3" />
            Reabrir
          </button>
        </div>
      )}

      {/* Lista de itens */}
      <ul className="divide-y divide-border rounded-lg border shadow-sm overflow-hidden">
        {itens.map((item) => {
          const feito = concluidos.has(item)
          return (
            <li key={item}>
              <button
                type="button"
                onClick={() => handleToggle(item)}
                className="w-full flex items-center gap-3 px-4 py-4 text-left bg-card active:bg-muted transition-colors min-h-[52px]"
              >
                <span
                  className={cn(
                    'shrink-0 size-5 rounded-full border-2 flex items-center justify-center transition-all',
                    feito && (isAbertura ? 'border-bica bg-bica' : 'border-amp bg-amp'),
                  )}
                >
                  {feito && <Check className="size-3 text-white" strokeWidth={3} />}
                </span>
                <span
                  className={`text-sm flex-1 ${feito ? 'line-through text-muted-foreground' : ''}`}
                >
                  {item}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </main>
  )
}
