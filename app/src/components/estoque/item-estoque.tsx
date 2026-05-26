'use client'

import { useState, useTransition, useRef } from 'react'
import { Plus, Minus, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { atualizarQuantidade, atualizarItemEstoque } from '@/app/actions/estoque'

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
  const [editConfig, setEditConfig] = useState(false)
  const [valor, setValor] = useState(String(atual))
  const [quantidade, setQuantidade] = useState(atual)
  const [minimoState, setMinimoState] = useState(minimo)
  const [unidadeState, setUnidadeState] = useState(unidade ?? '')
  const [minimoVal, setMinimoVal] = useState(String(minimo))
  const [unidadeVal, setUnidadeVal] = useState(unidade ?? '')
  const [, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)

  const status = getItemStatus(quantidade, minimoState)
  const percent =
    minimoState > 0 ? Math.min(100, Math.round((quantidade / minimoState) * 100)) : 100

  const isCritico = status.color === 'danger'
  const isBaixo = status.color === 'warning'

  const barClass = isCritico ? 'bg-danger' : isBaixo ? 'bg-warning' : 'bg-success'
  const badgeClass = isCritico
    ? 'bg-danger-bg text-danger'
    : isBaixo
    ? 'bg-warning-bg text-warning'
    : 'bg-success-bg text-success'

  const unidadeLabel = unidadeState

  function salvar(nova: number) {
    if (isNaN(nova) || nova < 0) return
    setQuantidade(nova)
    setValor(String(nova))
    startTransition(async () => {
      try {
        await atualizarQuantidade(id, nova)
      } catch {
        toast.error('Não foi possível salvar', `${nome} — tente novamente`)
      }
    })
  }

  function ajustar(delta: number) {
    const nova = Math.max(0, quantidade + delta)
    salvar(nova)
  }

  function handleConfirmar() {
    const nova = parseFloat(valor)
    if (isNaN(nova) || nova < 0) {
      setValor(String(quantidade))
      setEditando(false)
      return
    }
    salvar(nova)
    setEditando(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleConfirmar()
    if (e.key === 'Escape') {
      setValor(String(quantidade))
      setEditando(false)
    }
  }

  function salvarConfig() {
    const novoMin = parseFloat(minimoVal)
    if (isNaN(novoMin) || novoMin < 0) {
      toast.error('Mínimo inválido')
      return
    }
    const novaUnidade = unidadeVal.trim()
    setMinimoState(novoMin)
    setUnidadeState(novaUnidade)
    setEditConfig(false)
    startTransition(async () => {
      try {
        await atualizarItemEstoque(id, { minimo: novoMin, unidade: novaUnidade })
        toast.success(`${nome} atualizado`)
      } catch {
        toast.error('Não foi possível atualizar', nome)
      }
    })
  }

  return (
    <div className="space-y-2 py-3">
      {/* Row 1: nome + badge + ajustes */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium leading-tight">
          {nome}
          {unidadeLabel && (
            <span className="ml-1 text-xs font-normal text-muted-foreground">({unidadeLabel})</span>
          )}
        </span>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className={cn('rounded-full px-2 py-0.5 text-xs font-semibold', badgeClass)}>
            {status.label}
          </span>
          <Button
            type="button"
            size="icon-xs"
            variant="ghost"
            onClick={() => setEditConfig((v) => !v)}
            className="size-7 text-b4 hover:text-foreground"
            aria-label="Ajustar mínimo e unidade"
            aria-expanded={editConfig}
          >
            <SlidersHorizontal className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Config: mínimo + unidade */}
      {editConfig && (
        <div className="flex flex-wrap items-end gap-2 rounded-md bg-ink2 p-2.5">
          <label className="flex flex-col gap-0.5 text-xs text-muted-foreground">
            Mínimo
            <input
              type="number"
              min="0"
              step="0.5"
              value={minimoVal}
              onChange={(e) => setMinimoVal(e.target.value)}
              className="w-20 rounded border border-border bg-background px-2 py-1 text-sm tabular-nums focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </label>
          <label className="flex flex-col gap-0.5 text-xs text-muted-foreground">
            Unidade
            <input
              type="text"
              value={unidadeVal}
              onChange={(e) => setUnidadeVal(e.target.value)}
              placeholder="un, kg, L…"
              className="w-24 rounded border border-border bg-background px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </label>
          <Button type="button" size="sm" variant="brand" onClick={salvarConfig}>
            Salvar
          </Button>
        </div>
      )}

      {/* Row 2: barra de nível */}
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={cn('h-full rounded-full transition-all', barClass)}
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Row 3: valores + edição + step buttons */}
      <div className="flex items-center justify-between gap-2">
        {editando ? (
          <div className="flex flex-1 items-center gap-2">
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
              className="rounded bg-primary px-2 py-0.5 text-xs font-semibold text-bica-fg"
            >
              OK
            </button>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={() => {
                setEditando(true)
                setTimeout(() => inputRef.current?.select(), 50)
              }}
              className="text-left text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="font-medium text-foreground">{quantidade}</span>
              {unidadeLabel && ` ${unidadeLabel}`}
              &nbsp;/&nbsp;mín: {minimoState} {unidadeLabel}
            </button>
            <div className="flex shrink-0 items-center gap-1">
              <Button
                type="button"
                size="icon-xs"
                variant="ghost"
                onClick={() => ajustar(-1)}
                className="size-7 text-b3 hover:bg-danger-bg hover:text-danger"
                aria-label="Diminuir 1"
              >
                <Minus className="size-3.5" />
              </Button>
              <Button
                type="button"
                size="icon-xs"
                variant="ghost"
                onClick={() => ajustar(1)}
                className="size-7 text-b3 hover:bg-success-bg hover:text-success"
                aria-label="Aumentar 1"
              >
                <Plus className="size-3.5" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
