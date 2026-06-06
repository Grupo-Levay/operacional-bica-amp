'use client'

import { useState, useTransition, useRef } from 'react'
import { Plus, Minus, MoreVertical, SlidersHorizontal, Archive } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { LevelBar } from '@/components/ui/level-bar'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { toast } from '@/components/ui/toast'
import { atualizarQuantidade, atualizarItemEstoque, arquivarItemEstoque } from '@/app/actions/estoque'

type ItemEstoqueProps = {
  id: string
  nome: string
  unidade: string | null
  atual: number
  minimo: number
}

type StatusBadgeVariant = 'success' | 'warning' | 'danger'

function getItemStatus(
  atual: number,
  minimo: number
): { label: string; variant: StatusBadgeVariant } {
  if (atual >= minimo) return { label: 'OK', variant: 'success' }
  if (atual >= minimo * 0.5) return { label: 'BAIXO', variant: 'warning' }
  return { label: 'CRÍTICO', variant: 'danger' }
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

  const isCritico = status.variant === 'danger'

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

  const fieldCls =
    'rounded-md border border-border bg-background px-2 py-1 text-sm tabular-nums transition-shadow focus-ring-brand focus:border-primary/40'

  return (
    <Card
      size="sm"
      variant="default"
      className={cn(
        'relative gap-3 px-3.5',
        // acento lateral âmbar/vermelho para itens em ruptura — leitura imediata de severidade
        'before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:rounded-l-xl',
        isCritico
          ? 'before:bg-danger/70 ring-destructive/20'
          : 'before:bg-transparent'
      )}
    >
      {/* Row 1: nome + badge de status + ajustes */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium leading-tight text-foreground">
          {nome}
          {unidadeLabel && (
            <span className="ml-1 text-xs font-normal text-muted-foreground">({unidadeLabel})</span>
          )}
        </span>
        <div className="flex shrink-0 items-center gap-1.5">
          <Badge variant={status.variant} className="font-semibold">
            {status.label}
          </Badge>
          {/* Ações secundárias agrupadas. Os +/- de ajuste rápido ficam diretos
              no card (ação primária de toque). O item destrutivo "Arquivar" usa
              o ConfirmDialog via `render`, preservando estado e server action. */}
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label={`Ações de ${nome}`}
              className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-b4 outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 aria-expanded:bg-muted aria-expanded:text-foreground"
            >
              <MoreVertical className="size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setEditConfig((v) => !v)}>
                <SlidersHorizontal className="size-4" />
                Ajustar mínimo e unidade
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <ConfirmDialog
                trigger={
                  <DropdownMenuItem variant="destructive" render={<button type="button" />}>
                    <Archive className="size-4" />
                    Arquivar
                  </DropdownMenuItem>
                }
                title="Arquivar item?"
                description={`"${nome}" deixará de aparecer no estoque. Você pode recriá-lo depois.`}
                confirmLabel="Arquivar"
                destructive
                successMessage="Item arquivado"
                onConfirm={() => arquivarItemEstoque(id)}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Config: mínimo + unidade */}
      {editConfig && (
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-2 rounded-lg bg-gradient-surface-raised p-2.5 shadow-inner-hairline ring-1 ring-foreground/10">
          <label className="flex flex-col gap-0.5 text-xs text-muted-foreground">
            Mínimo
            <input
              type="number"
              min="0"
              step="0.5"
              value={minimoVal}
              onChange={(e) => setMinimoVal(e.target.value)}
              className={cn(fieldCls, 'w-full sm:w-20')}
            />
          </label>
          <label className="flex flex-col gap-0.5 text-xs text-muted-foreground">
            Unidade
            <input
              type="text"
              value={unidadeVal}
              onChange={(e) => setUnidadeVal(e.target.value)}
              placeholder="un, kg, L…"
              className={cn(fieldCls, 'w-full sm:w-24')}
            />
          </label>
          <Button type="button" size="sm" variant="brand" onClick={salvarConfig} className="w-full sm:w-auto">
            Salvar
          </Button>
        </div>
      )}

      {/* Row 2: barra de nível (componente compartilhado, colorido por severidade) */}
      <LevelBar atual={quantidade} minimo={minimoState} className="h-2" />

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
              className={cn(fieldCls, 'w-20 py-0.5')}
            />
            <span className="text-xs text-muted-foreground">{unidadeLabel}</span>
            <Button
              type="button"
              size="sm"
              variant="brand"
              onClick={handleConfirmar}
            >
              OK
            </Button>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={() => {
                setEditando(true)
                setTimeout(() => inputRef.current?.select(), 50)
              }}
              className="rounded-md text-left text-xs text-muted-foreground transition-colors hover:text-foreground focus-ring-brand"
            >
              <span className="text-sm font-semibold tabular-nums text-foreground">{quantidade}</span>
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
    </Card>
  )
}
