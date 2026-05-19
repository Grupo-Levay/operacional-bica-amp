'use client'

import { useState, useTransition } from 'react'
import { confirmarPresenca } from '@/app/actions/escala'

type Membro = {
  id: string
  nome: string
  funcao: string
  ativo: boolean | null
  turno: string | null
  created_at: string | null
}

type EscalaItem = {
  id: string
  data: string
  turno: string
  membro_id: string | null
  confirmado: boolean | null
  observacao: string | null
  equipe: { nome: string; funcao: string } | null
}

type Props = {
  membros: Membro[]
  escala: EscalaItem[]
  dias: Date[]
}

const TURNO_LABEL: Record<string, string> = {
  abertura: 'AB',
  fechamento: 'FE',
  AB: 'AB',
  FE: 'FE',
  manha: 'MH',
  tarde: 'TD',
  noite: 'NT',
  integral: 'IN',
}

function formatDia(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short',
    day: 'numeric',
  }).format(date)
}

function CelulaEscala({ item }: { item: EscalaItem }) {
  const [confirmado, setConfirmado] = useState(item.confirmado ?? false)
  const [isPending, startTransition] = useTransition()

  function handleToggle() {
    const next = !confirmado
    setConfirmado(next)
    startTransition(async () => {
      await confirmarPresenca(item.id, next)
    })
  }

  const label = TURNO_LABEL[item.turno] ?? item.turno.slice(0, 2).toUpperCase()

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      title={confirmado ? 'Clique para desconfirmar' : 'Clique para confirmar'}
      className="flex items-center justify-center h-9 w-full rounded text-[10px] font-bold border transition-colors disabled:opacity-60"
      style={
        confirmado
          ? { backgroundColor: 'var(--color-bica)', color: '#fff', borderColor: 'var(--color-bica)' }
          : { backgroundColor: 'transparent', color: 'hsl(var(--muted-foreground))', borderColor: 'hsl(var(--border))' }
      }
    >
      {label}
    </button>
  )
}

export function EscalaGrid({ membros, escala, dias }: Props) {
  if (membros.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center gap-2">
        <p className="text-muted-foreground text-sm">Equipe não cadastrada</p>
      </div>
    )
  }

  // index: membro_id__data → EscalaItem
  const escalaIndex = new Map<string, EscalaItem>()
  for (const item of escala) {
    if (item.membro_id) {
      escalaIndex.set(`${item.membro_id}__${item.data}`, item)
    }
  }

  return (
    <div>
      {escala.length === 0 && (
        <p className="text-sm text-muted-foreground mb-4">
          Nenhuma escala para esta semana
        </p>
      )}

      <div className="overflow-x-auto -mx-4 px-4">
        <div className="min-w-[440px]">
          {/* Header */}
          <div
            className="grid gap-1 mb-1"
            style={{ gridTemplateColumns: `160px repeat(${dias.length}, 1fr)` }}
          >
            <div className="text-xs text-muted-foreground font-medium py-1">Membro</div>
            {dias.map((dia) => (
              <div
                key={dia.toISOString()}
                className="text-xs text-muted-foreground font-medium text-center py-1 capitalize"
              >
                {formatDia(dia)}
              </div>
            ))}
          </div>

          {/* Linhas de membros */}
          <div className="flex flex-col gap-1">
            {membros.map((membro) => (
              <div
                key={membro.id}
                className="grid gap-1 items-center"
                style={{ gridTemplateColumns: `160px repeat(${dias.length}, 1fr)` }}
              >
                <div className="flex flex-col py-1.5 pr-2">
                  <span className="font-semibold text-sm leading-tight truncate">
                    {membro.nome}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {membro.funcao}
                  </span>
                </div>

                {dias.map((dia) => {
                  const dataStr = dia.toISOString().split('T')[0]
                  const item = escalaIndex.get(`${membro.id}__${dataStr}`)

                  return (
                    <div key={dataStr} className="flex items-center justify-center">
                      {item ? (
                        <CelulaEscala item={item} />
                      ) : (
                        <span className="text-xs text-muted-foreground/40 text-center w-full block">
                          –
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legenda */}
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span><strong>AB</strong> Abertura</span>
        <span><strong>FE</strong> Fechamento</span>
        <span><strong>MH</strong> Manhã</span>
        <span><strong>TD</strong> Tarde</span>
        <span><strong>NT</strong> Noite</span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: 'var(--color-bica)' }} />
          Confirmado
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-sm border" />
          Não confirmado
        </span>
      </div>
    </div>
  )
}
