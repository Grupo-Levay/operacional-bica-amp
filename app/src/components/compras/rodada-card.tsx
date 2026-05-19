'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Tables } from '@/types/database.types'
import { toggleItemComprado, fecharRodada } from '@/app/actions/compras'
import { useToast } from '@/components/ui/toast'

type RodadaItem = Tables<'rodada_itens'>
type Rodada = Tables<'rodadas'> & { rodada_itens: RodadaItem[] }

function formatarMoeda(valor: number | null): string {
  if (valor == null) return '—'
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatarData(data: string): string {
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

function RodadaAberta({ rodada }: { rodada: Rodada }) {
  const itens = rodada.rodada_itens ?? []

  const [compradoMap, setCompradoMap] = useState<Map<string, boolean>>(() => {
    const m = new Map<string, boolean>()
    for (const item of itens) m.set(item.id, item.comprado ?? false)
    return m
  })
  const [togglePending, startToggle] = useTransition()
  const [fechando, setFechando] = useState(false)
  const [fecharPending, startFechar] = useTransition()
  const toast = useToast()

  const totalComprado = Array.from(compradoMap.values()).filter(Boolean).length

  function handleToggle(itemId: string) {
    const next = !(compradoMap.get(itemId) ?? false)
    setCompradoMap((prev) => new Map(prev).set(itemId, next))
    startToggle(async () => {
      await toggleItemComprado(itemId, next)
    })
  }

  function handleFechar() {
    startFechar(async () => {
      await fecharRodada(rodada.id)
      setFechando(false)
      toast.success('Rodada fechada com sucesso')
    })
  }

  const total =
    rodada.total ??
    itens.reduce((acc, item) => acc + (item.total ?? 0), 0)

  return (
    <Card
      className="rounded-lg border-2 shadow-sm"
      style={{ borderColor: 'var(--color-bica)' }}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">{rodada.nome}</CardTitle>
          <Badge
            className="text-xs font-semibold shrink-0 border-0"
            style={{ backgroundColor: '#16a34a', color: '#fff' }}
          >
            ABERTA
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {formatarData(rodada.data)}
          {itens.length > 0 && (
            <span className="ml-2">· {totalComprado}/{itens.length} comprados</span>
          )}
        </p>
      </CardHeader>

      <CardContent className="space-y-3">
        {itens.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            Nenhum item nesta rodada
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {itens.map((item) => {
              const comprado = compradoMap.get(item.id) ?? false
              return (
                <li key={item.id} className="flex items-center gap-3 py-2.5">
                  <button
                    type="button"
                    onClick={() => handleToggle(item.id)}
                    disabled={togglePending}
                    className="flex items-center gap-3 flex-1 text-left disabled:opacity-60"
                    style={{ minHeight: 44 }}
                  >
                    <span
                      className="flex items-center justify-center size-5 rounded border-2 shrink-0 transition-colors"
                      style={{
                        borderColor: comprado ? 'var(--color-bica)' : 'hsl(var(--border))',
                        backgroundColor: comprado ? 'var(--color-bica)' : 'transparent',
                      }}
                    >
                      {comprado && (
                        <svg viewBox="0 0 12 10" className="size-3" fill="none">
                          <path
                            d="M1 5l3.5 3.5L11 1"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                    <span
                      className={`flex-1 text-sm ${comprado ? 'line-through text-muted-foreground' : ''}`}
                    >
                      {item.nome}
                    </span>
                  </button>
                  <span className="text-muted-foreground text-xs shrink-0">
                    {item.quantidade ?? 1} {item.unidade ?? 'un'}
                  </span>
                  {item.preco_unit != null && (
                    <span className="text-xs font-medium shrink-0 tabular-nums">
                      {formatarMoeda(item.preco_unit)}
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
        )}

        {total > 0 && (
          <div className="flex justify-end border-t pt-2">
            <p className="text-sm font-bold">
              Total:{' '}
              <span className="tabular-nums" style={{ color: 'var(--color-bica)' }}>
                {formatarMoeda(total)}
              </span>
            </p>
          </div>
        )}

        <div className="flex justify-end pt-1">
          {fechando ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFechando(false)}
                disabled={fecharPending}
                className="px-3 py-1.5 text-xs rounded-lg border hover:bg-muted disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleFechar}
                disabled={fecharPending}
                className="px-3 py-1.5 text-xs rounded-lg font-semibold text-white disabled:opacity-60"
                style={{ backgroundColor: 'var(--color-amp)' }}
              >
                {fecharPending ? 'Fechando…' : 'Confirmar fechar'}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setFechando(true)}
              className="px-3 py-1.5 text-xs rounded-lg border hover:bg-muted"
            >
              Fechar Rodada
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function RodadaFechada({ rodada }: { rodada: Rodada }) {
  const itens = rodada.rodada_itens ?? []
  const total =
    rodada.total ??
    itens.reduce((acc, item) => acc + (item.total ?? 0), 0)

  return (
    <Card className="rounded-lg border shadow-sm">
      <CardContent className="flex items-center justify-between px-4 py-3">
        <div>
          <p className="text-sm font-medium">{rodada.nome}</p>
          <p className="text-xs text-muted-foreground">
            {formatarData(rodada.data)}
            {itens.length > 0 && ` · ${itens.length} itens`}
          </p>
        </div>
        <p className="text-sm font-semibold tabular-nums">{formatarMoeda(total)}</p>
      </CardContent>
    </Card>
  )
}

export function RodadaCard({ rodada }: { rodada: Rodada }) {
  if (rodada.status === 'aberta') return <RodadaAberta rodada={rodada} />
  return <RodadaFechada rodada={rodada} />
}
