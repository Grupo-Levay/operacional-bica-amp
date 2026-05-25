"use client"

import { useState, useTransition } from "react"
import { Badge } from "@/components/ui/badge"
import { salvarEscala, removerEscala } from "@/app/actions/escala"
import { cn } from "@/lib/utils"

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
  canEdit?: boolean
}

const TURNO_LABEL: Record<string, string> = {
  AB: "AB",
  FE: "FE",
}

function formatDia(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "numeric",
  }).format(date)
}

export function EscalaGrid({ membros, escala, dias, canEdit = false }: Props) {
  const [openCell, setOpenCell] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

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

  function handleCellClick(key: string) {
    if (!canEdit || isPending) return
    setOpenCell(openCell === key ? null : key)
  }

  function handleSave(membroId: string, dataStr: string, turno: string) {
    startTransition(async () => {
      await salvarEscala(membroId, dataStr, turno)
      setOpenCell(null)
    })
  }

  function handleRemove(id: string) {
    startTransition(async () => {
      await removerEscala(id)
      setOpenCell(null)
    })
  }

  const hasEscala = escala.length > 0

  return (
    <div>
      {canEdit && (
        <p className="text-xs text-muted-foreground mb-3">
          Toque em uma célula para editar a escala.
        </p>
      )}
      {!hasEscala && !canEdit && (
        <p className="text-sm text-muted-foreground mb-4">
          Nenhuma escala para esta semana
        </p>
      )}

      <div className="overflow-x-auto scroll-smooth snap-x snap-mandatory -mx-4 px-4">
        <div className="min-w-[480px]">
          <div
            className="grid gap-1 mb-1"
            style={{ gridTemplateColumns: `180px repeat(${dias.length}, 1fr)` }}
          >
            <div className="text-xs text-muted-foreground font-medium py-1">
              Membro
            </div>
            {dias.map((dia) => (
              <div
                key={dia.toISOString()}
                className="text-xs text-muted-foreground font-medium text-center py-1 capitalize snap-start"
              >
                {formatDia(dia)}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-1">
            {membros.map((membro) => (
              <div
                key={membro.id}
                className="grid gap-1 items-center"
                style={{
                  gridTemplateColumns: `180px repeat(${dias.length}, 1fr)`,
                }}
              >
                <div className="flex flex-col py-2 pr-2">
                  <span className="font-semibold text-sm leading-tight truncate">
                    {membro.nome}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {membro.funcao}
                  </span>
                </div>

                {dias.map((dia) => {
                  const dataStr = dia.toISOString().split("T")[0]
                  const key = `${membro.id}__${dataStr}`
                  const item = escalaIndex.get(key)
                  const isOpen = openCell === key

                  if (canEdit && isOpen) {
                    return (
                      <div
                        key={dataStr}
                        className="flex flex-col items-center gap-0.5 h-auto py-1"
                      >
                        <div className="flex gap-0.5">
                          {["AB", "FE"].map((t) => (
                            <button
                              key={t}
                              type="button"
                              disabled={isPending}
                              onClick={() => handleSave(membro.id, dataStr, t)}
                              className={cn(
                                "text-[10px] font-bold px-1.5 py-1 rounded transition-opacity disabled:opacity-50",
                                item?.turno === t
                                  ? "bg-primary text-[#14100D]"
                                  : "bg-ink4 text-b3"
                              )}
                            >
                              {t}
                            </button>
                          ))}
                          {item && (
                            <button
                              type="button"
                              disabled={isPending}
                              onClick={() => handleRemove(item.id)}
                              className="text-[10px] font-bold px-1 py-1 rounded transition-opacity disabled:opacity-50 bg-danger-bg text-danger"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => setOpenCell(null)}
                          className="text-[9px] text-muted-foreground/60 leading-none"
                        >
                          fechar
                        </button>
                      </div>
                    )
                  }

                  return (
                    <div
                      key={dataStr}
                      className="flex items-center justify-center h-10"
                    >
                      {item ? (
                        <button
                          type="button"
                          onClick={() => handleCellClick(key)}
                          disabled={isPending}
                          className={
                            canEdit
                              ? "cursor-pointer hover:opacity-80 transition-opacity"
                              : "cursor-default"
                          }
                        >
                          <Badge
                            className={cn(
                              "text-[10px] font-bold px-1.5 h-7 border-0",
                              item.confirmado && "bg-primary text-white"
                            )}
                            variant={item.confirmado ? "default" : "secondary"}
                          >
                            {TURNO_LABEL[item.turno] ?? item.turno}
                          </Badge>
                        </button>
                      ) : canEdit ? (
                        <button
                          type="button"
                          onClick={() => handleCellClick(key)}
                          disabled={isPending}
                          className="w-8 h-8 rounded flex items-center justify-center text-muted-foreground/40 hover:text-muted-foreground hover:bg-muted/50 transition-colors text-base"
                        >
                          +
                        </button>
                      ) : (
                        <span className="text-xs text-muted-foreground/50">
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

      <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
        <span>
          <span className="font-semibold">AB</span> = Abertura
        </span>
        <span>
          <span className="font-semibold">FE</span> = Fechamento
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-sm bg-primary" />
          Confirmado
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-sm bg-secondary" />
          Não confirmado
        </span>
      </div>
    </div>
  )
}
