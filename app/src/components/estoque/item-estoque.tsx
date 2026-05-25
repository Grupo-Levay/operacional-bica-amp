'use client'

import { useState, useTransition, useRef } from 'react'
import { cn } from '@/lib/utils'
import { atualizarQuantidade } from '@/app/actions/estoque'

type ItemEstoqueProps = {
  id: string
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

export function ItemEstoque({ id, nome, unidade, atual, minimo }: ItemEstoqueProps) {
  const [editando, setEditando] = useState(false)
  const [valor, setValor] = useState(String(atual))
  const [quantidade, setQuantidade] = useState(atual)
  const [, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)

  const status = getItemStatus(quantidade, minimo)
  const percent = minimo > 0 ? Math.min(100, Math.round((quantidade / minimo) * 100)) : 100

  const isCritico = status.color === 'danger'
  const isBaixo = status.color === 'warning'

  const barClass = isCritico ? 'bg-danger' : isBaixo ? 'bg-warning' : 'bg-success'
  const badgeClass = isCritico
    ? 'bg-danger-bg text-danger'
    : isBaixo
    ? 'bg-warning-bg text-warning'
    : 'bg-success-bg text-success'

  const unidadeLabel = unidade ?? ''

  function handleConfirmar() {
    const nova = parseFloat(valor)
    if (isNaN(nova) || nova < 0) {
      setValor(String(quantidade))
      setEditando(false)
      return
    }
    setQuantidade(nova)
    setEditando(false)
    startTransition(async () => {
      await atualizarQuantidade(id, nova)
    })
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleConfirmar()
    if (e.key === 'Escape') {
      setValor(String(quantidade))
      setEditando(false)
    }
  }

  return (
    <div className="py-3 space-y-2">
      {/* Row 1: nome + badge */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium leading-tight">
          {nome}
          {unidadeLabel && (
            <span className="text-xs text-muted-foreground font-normal ml-1">({unidadeLabel})</span>
          )}
        </span>
        <span
          className={cn("shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full", badgeClass)}
        >
          {status.label}
        </span>
      </div>

      {/* Row 2: barra de nível */}
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", barClass)}
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Row 3: valores + edição inline */}
      <div className="flex items-center justify-between gap-2">
        {editando ? (
          <div className="flex items-center gap-2 flex-1">
            <input
              ref={inputRef}
              type="number"
              min="0"
              step="0.5"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleConfirmar}
              autoFocus
              className="w-20 rounded border border-border bg-background px-2 py-0.5 text-sm tabular-nums focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <span className="text-xs text-muted-foreground">{unidadeLabel}</span>
            <button
              type="button"
              onClick={handleConfirmar}
              className={cn("text-xs font-semibold px-2 py-0.5 rounded text-white", "bg-primary")}
            >
              OK
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setEditando(true)
              setTimeout(() => inputRef.current?.select(), 50)
            }}
            className="text-xs text-muted-foreground text-left hover:text-foreground transition-colors"
          >
            <span className="font-medium text-foreground">{quantidade}</span>
            {unidadeLabel && ` ${unidadeLabel}`}
            &nbsp;/&nbsp;mín: {minimo} {unidadeLabel}
            <span className="ml-1 opacity-50 text-[10px]">✏️</span>
          </button>
        )}
      </div>
    </div>
  )
}
