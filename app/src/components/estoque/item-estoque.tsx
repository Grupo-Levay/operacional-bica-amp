'use client'

import { Badge } from '@/components/ui/badge'

type ItemEstoqueProps = {
  nome: string
  unidade: string | null
  atual: number
  minimo: number
}

function getItemStatus(atual: number, minimo: number) {
  if (atual >= minimo) return { label: 'OK', color: 'success' as const }
  if (atual >= minimo * 0.5) return { label: 'BAIXO', color: 'warning' as const }
  return { label: 'CRÍTICO', color: 'danger' as const }
}

export function ItemEstoque({ nome, unidade, atual, minimo }: ItemEstoqueProps) {
  const status = getItemStatus(atual, minimo)
  const percent = minimo > 0 ? Math.min(100, Math.round((atual / minimo) * 100)) : 100

  const barColor =
    status.color === 'success'
      ? '#22c55e'
      : status.color === 'warning'
        ? '#eab308'
        : '#ef4444'

  const badgeBg =
    status.color === 'success'
      ? '#dcfce7'
      : status.color === 'warning'
        ? '#fef9c3'
        : '#fee2e2'

  const badgeText =
    status.color === 'success'
      ? '#15803d'
      : status.color === 'warning'
        ? '#854d0e'
        : '#b91c1c'

  const unidadeLabel = unidade ?? ''

  return (
    <div className="py-3 space-y-2">
      {/* Row 1: nome + badge */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium leading-tight">
          {nome}
          {unidadeLabel && (
            <span className="text-xs text-muted-foreground font-normal ml-1">
              ({unidadeLabel})
            </span>
          )}
        </span>
        <span
          className="shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: badgeBg, color: badgeText }}
        >
          {status.label}
        </span>
      </div>

      {/* Row 2: barra de nível */}
      <div className="h-2 rounded-full bg-neutral-200 overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${percent}%`, backgroundColor: barColor }}
        />
      </div>

      {/* Row 3: valores */}
      <p className="text-xs text-muted-foreground">
        {atual} {unidadeLabel} &nbsp;/&nbsp; mín: {minimo} {unidadeLabel}
      </p>
    </div>
  )
}
