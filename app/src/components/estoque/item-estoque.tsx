'use client'

import { useState, useTransition, useRef } from 'react'
import { registrarContagem } from '@/app/actions/estoque'

type ItemEstoqueProps = {
  id: string
  nome: string
  unidade: string | null
  atual: number
  minimo: number
  updatedAt: string | null
}

function getStatus(atual: number, minimo: number) {
  if (minimo === 0 || atual >= minimo) return 'ok' as const
  if (atual >= minimo * 0.5) return 'baixo' as const
  return 'critico' as const
}

const STATUS_CONFIG = {
  ok:      { label: 'OK',      bg: '#dcfce7', text: '#15803d' },
  baixo:   { label: 'BAIXO',   bg: '#fef9c3', text: '#854d0e' },
  critico: { label: 'CRÍTICO', bg: '#fee2e2', text: '#b91c1c' },
}

const BAR_COLOR = { ok: '#22c55e', baixo: '#eab308', critico: '#ef4444' }

function tempoDesde(isoStr: string | null): string | null {
  if (!isoStr) return null
  const diff = Date.now() - new Date(isoStr).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'agora mesmo'
  if (min < 60) return `${min}min atrás`
  const h = Math.floor(min / 60)
  if (h < 24) return `${h}h atrás`
  return `${Math.floor(h / 24)}d atrás`
}

export function ItemEstoque({ id, nome, unidade, atual, minimo, updatedAt }: ItemEstoqueProps) {
  const [editando, setEditando] = useState(false)
  const [inputVal, setInputVal] = useState(String(atual))
  const [erro, setErro] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)

  const status = getStatus(atual, minimo)
  const cfg = STATUS_CONFIG[status]
  const percent = minimo > 0 ? Math.min(100, Math.round((atual / minimo) * 100)) : 100
  const unidadeLabel = unidade ?? ''
  const contadoHa = tempoDesde(updatedAt)

  function abrirEdicao() {
    setInputVal(String(atual))
    setErro(null)
    setEditando(true)
    setTimeout(() => inputRef.current?.select(), 50)
  }

  function cancelar() {
    setEditando(false)
    setErro(null)
  }

  function confirmar() {
    const qty = parseFloat(inputVal.replace(',', '.'))
    if (!Number.isFinite(qty) || qty < 0) {
      setErro('Valor inválido')
      return
    }
    setErro(null)
    startTransition(async () => {
      const result = await registrarContagem(id, qty)
      if (result?.error) {
        setErro(result.error)
      } else {
        setEditando(false)
      }
    })
  }

  return (
    <div className="py-3 space-y-2">
      {/* Linha 1: nome + badge + botão contar */}
      <div className="flex items-center gap-2">
        <span className="flex-1 text-sm font-medium leading-tight">
          {nome}
          {unidadeLabel && (
            <span className="text-xs text-muted-foreground font-normal ml-1">
              ({unidadeLabel})
            </span>
          )}
        </span>
        <span
          className="shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: cfg.bg, color: cfg.text }}
        >
          {cfg.label}
        </span>
        <button
          type="button"
          onClick={abrirEdicao}
          className="shrink-0 text-xs px-2 py-0.5 rounded border hover:bg-muted"
          style={{ minHeight: 28 }}
        >
          Contar
        </button>
      </div>

      {/* Barra de nível */}
      <div className="h-2 rounded-full bg-neutral-200 overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${percent}%`, backgroundColor: BAR_COLOR[status] }}
        />
      </div>

      {/* Linha 2: valores + timestamp */}
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          {atual} {unidadeLabel}
          {minimo > 0 && <> / mín: {minimo} {unidadeLabel}</>}
        </p>
        {contadoHa && (
          <p className="text-xs text-muted-foreground/70">contado {contadoHa}</p>
        )}
      </div>

      {/* Input inline de contagem */}
      {editando && (
        <div className="flex items-center gap-2 pt-1">
          <input
            ref={inputRef}
            type="number"
            inputMode="decimal"
            min="0"
            step="0.1"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') confirmar()
              if (e.key === 'Escape') cancelar()
            }}
            className="w-24 rounded border px-2 py-1 text-sm tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            disabled={isPending}
          />
          {unidadeLabel && (
            <span className="text-xs text-muted-foreground">{unidadeLabel}</span>
          )}
          <button
            type="button"
            onClick={cancelar}
            disabled={isPending}
            className="text-xs px-2 py-1 rounded border hover:bg-muted disabled:opacity-50"
          >
            ✕
          </button>
          <button
            type="button"
            onClick={confirmar}
            disabled={isPending}
            className="text-xs px-3 py-1 rounded font-semibold text-white disabled:opacity-60"
            style={{ backgroundColor: 'var(--color-bica)' }}
          >
            {isPending ? '…' : 'OK'}
          </button>
          {erro && <p className="text-xs text-destructive">{erro}</p>}
        </div>
      )}
    </div>
  )
}
