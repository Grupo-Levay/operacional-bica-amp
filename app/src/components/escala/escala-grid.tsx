'use client'

import { useState, useTransition } from 'react'
import { Plus, X } from 'lucide-react'
import { confirmarPresenca, criarEntradaEscala, removerEntradaEscala, type Turno } from '@/app/actions/escala'
import { useToast } from '@/components/ui/toast'

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
  isAdmin?: boolean
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

const TURNOS: { value: Turno; label: string }[] = [
  { value: 'abertura',   label: 'Abertura' },
  { value: 'fechamento', label: 'Fechamento' },
  { value: 'manha',      label: 'Manhã' },
  { value: 'tarde',      label: 'Tarde' },
  { value: 'noite',      label: 'Noite' },
  { value: 'integral',   label: 'Integral' },
]

function formatDia(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short',
    day: 'numeric',
  }).format(date)
}

function CelulaEscala({ item, isAdmin }: { item: EscalaItem; isAdmin?: boolean }) {
  const [confirmado, setConfirmado] = useState(item.confirmado ?? false)
  const [isPending, startTransition] = useTransition()
  const toast = useToast()

  function handleToggle() {
    const next = !confirmado
    setConfirmado(next)
    startTransition(async () => {
      await confirmarPresenca(item.id, next)
      toast.success(next ? 'Presença confirmada' : 'Confirmação removida')
    })
  }

  const label = TURNO_LABEL[item.turno] ?? item.turno.slice(0, 2).toUpperCase()

  if (isAdmin) {
    return (
      <AdminCelulaOcupada item={item} label={label} confirmado={confirmado} onToggle={handleToggle} isPending={isPending} />
    )
  }

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

function AdminCelulaOcupada({
  item, label, confirmado, onToggle, isPending,
}: {
  item: EscalaItem; label: string; confirmado: boolean; onToggle: () => void; isPending: boolean;
}) {
  const [removing, startRemove] = useTransition()
  const toast = useToast()

  function handleRemove(e: React.MouseEvent) {
    e.stopPropagation()
    startRemove(async () => {
      const result = await removerEntradaEscala(item.id)
      if (result.error) toast.error(result.error)
      else toast.info('Entrada removida')
    })
  }

  return (
    <div className="relative group">
      <button
        type="button"
        onClick={onToggle}
        disabled={isPending || removing}
        className="flex items-center justify-center h-9 w-full rounded text-[10px] font-bold border transition-colors disabled:opacity-60"
        style={
          confirmado
            ? { backgroundColor: 'var(--color-bica)', color: '#fff', borderColor: 'var(--color-bica)' }
            : { backgroundColor: 'transparent', color: 'hsl(var(--muted-foreground))', borderColor: 'hsl(var(--border))' }
        }
      >
        {label}
      </button>
      <button
        onClick={handleRemove}
        disabled={removing}
        className="absolute -top-1.5 -right-1.5 hidden group-hover:flex items-center justify-center size-4 rounded-full bg-destructive text-white text-[9px] shadow-sm"
        title="Remover"
      >
        <X size={8} />
      </button>
    </div>
  )
}

function CelulaVazia({ membroId, dataStr, isAdmin }: { membroId: string; dataStr: string; isAdmin?: boolean }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const toast = useToast()

  if (!isAdmin) {
    return <span className="text-xs text-muted-foreground/40 text-center w-full block">–</span>
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center h-9 w-full rounded border border-dashed opacity-0 hover:opacity-100 transition-opacity text-muted-foreground"
        title="Adicionar turno"
      >
        <Plus size={12} />
      </button>
    )
  }

  return (
    <div className="absolute z-20 left-0 mt-1 bg-background border rounded-lg shadow-lg p-2 min-w-[120px]">
      <p className="text-[10px] font-medium text-muted-foreground mb-1.5">Turno</p>
      {TURNOS.map((t) => (
        <button
          key={t.value}
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              const result = await criarEntradaEscala(membroId, dataStr, t.value)
              if (result.error) toast.error(result.error)
              else toast.success('Turno adicionado')
              setOpen(false)
            })
          }}
          className="block w-full text-left px-2 py-1 text-xs rounded hover:bg-muted disabled:opacity-50"
        >
          {t.label}
        </button>
      ))}
      <button onClick={() => setOpen(false)} className="mt-1 block w-full text-left px-2 py-1 text-xs rounded hover:bg-muted text-muted-foreground">
        Cancelar
      </button>
    </div>
  )
}

export function EscalaGrid({ membros, escala, dias, isAdmin }: Props) {
  if (membros.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center gap-2">
        <p className="text-muted-foreground text-sm">Equipe não cadastrada</p>
      </div>
    )
  }

  const escalaIndex = new Map<string, EscalaItem>()
  for (const item of escala) {
    if (item.membro_id) {
      escalaIndex.set(`${item.membro_id}__${item.data}`, item)
    }
  }

  return (
    <div>
      {escala.length === 0 && !isAdmin && (
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
                  <span className="font-semibold text-sm leading-tight truncate">{membro.nome}</span>
                  <span className="text-xs text-muted-foreground truncate">{membro.funcao}</span>
                </div>

                {dias.map((dia) => {
                  const dataStr = dia.toISOString().split('T')[0]
                  const item = escalaIndex.get(`${membro.id}__${dataStr}`)

                  return (
                    <div key={dataStr} className="relative flex items-center justify-center">
                      {item ? (
                        <CelulaEscala item={item} isAdmin={isAdmin} />
                      ) : (
                        <CelulaVazia membroId={membro.id} dataStr={dataStr} isAdmin={isAdmin} />
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
        <span><strong>IN</strong> Integral</span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: 'var(--color-bica)' }} />
          Confirmado
        </span>
      </div>
    </div>
  )
}
