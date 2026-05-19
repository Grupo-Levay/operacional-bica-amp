'use client'

import { useState, useTransition } from 'react'
import { CheckCircle2, Circle } from 'lucide-react'
import { toggleChecklistItem } from '@/app/actions/checklist'

type Props = {
  checklistId: string
  turno: string
  casa: string
  items: string[]
  concluidos: string[]
  registroId?: string
  casaColor: string
}

export function ChecklistItems({
  checklistId,
  turno,
  casa,
  items,
  concluidos: initialConcluidos,
  registroId: initialRegistroId,
  casaColor,
}: Props) {
  const [concluidos, setConcluidos] = useState<Set<string>>(new Set(initialConcluidos))
  const [isPending, startTransition] = useTransition()

  const percent = items.length > 0 ? Math.round((concluidos.size / items.length) * 100) : 0
  const allDone = items.length > 0 && concluidos.size === items.length

  function toggle(item: string) {
    const next = new Set(concluidos)
    if (next.has(item)) next.delete(item)
    else next.add(item)
    setConcluidos(next)

    startTransition(async () => {
      await toggleChecklistItem({
        checklistId,
        turno,
        casa,
        item,
        completed: next.has(item),
        currentConcluidos: Array.from(next),
        allDone: next.size === items.length,
      })
    })
  }

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{concluidos.size} de {items.length} itens</span>
          <span>{percent}%</span>
        </div>
        <div className="h-2 rounded-full bg-neutral-200 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${percent}%`, backgroundColor: casaColor }}
          />
        </div>
        {allDone && (
          <p className="text-xs font-medium text-center" style={{ color: casaColor }}>
            Checklist concluído!
          </p>
        )}
      </div>

      {/* Items */}
      <ul className="space-y-1">
        {items.map((item) => {
          const done = concluidos.has(item)
          return (
            <li key={item}>
              <button
                type="button"
                onClick={() => toggle(item)}
                disabled={isPending}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-3.5 text-left transition-colors hover:bg-accent active:bg-accent/80"
                style={{ minHeight: 52 }}
              >
                {done ? (
                  <CheckCircle2
                    size={22}
                    className="shrink-0"
                    style={{ color: casaColor }}
                  />
                ) : (
                  <Circle size={22} className="shrink-0 text-muted-foreground/40" />
                )}
                <span
                  className={`text-sm leading-snug transition-colors ${done ? 'line-through text-muted-foreground' : ''}`}
                >
                  {item}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
