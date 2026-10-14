"use client"

import { useState, useTransition } from "react"
import { Badge } from "@/components/ui/badge"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { salvarEscala, removerEscala, confirmarEscala } from "@/app/actions/escala"
import { toast } from "@/components/ui/toast"
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

function formatDiaSemana(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
  }).format(date).replace(".", "")
}

function formatDiaNumero(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
  }).format(date)
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
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

  const hoje = new Date()

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
      try {
        await salvarEscala(membroId, dataStr, turno)
        setOpenCell(null)
      } catch {
        toast.error("Não foi possível salvar a escala")
      }
    })
  }

  function handleConfirmar(id: string, confirmado: boolean) {
    startTransition(async () => {
      try {
        await confirmarEscala(id, confirmado)
        toast.success(confirmado ? "Turno confirmado" : "Confirmação desfeita")
      } catch {
        toast.error("Não foi possível confirmar o turno")
      }
    })
  }


  const hasEscala = escala.length > 0

  return (
    <div>
      {canEdit && (
        <p className="text-xs text-muted-foreground mb-3">
          Toque numa célula para editar. Use{" "}
          <span className="text-success font-bold">✓</span> para confirmar o turno.
        </p>
      )}
      {!hasEscala && !canEdit && (
        <p className="text-sm text-muted-foreground mb-4">
          Nenhuma escala para esta semana
        </p>
      )}

      <p className="text-[10px] text-muted-foreground sm:hidden mb-1.5 text-center" aria-hidden>
        ← deslize →
      </p>

      <div className="relative -mx-4">
        <div className="overflow-x-auto scroll-smooth snap-x snap-mandatory px-4">
          <div className="min-w-[480px]">
          <div
            className="grid gap-1 mb-2"
            style={{ gridTemplateColumns: `180px repeat(${dias.length}, 1fr)` }}
          >
            <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium py-1 self-end">
              Membro
            </div>
            {dias.map((dia) => {
              const today = isSameDay(dia, hoje)
              return (
                <div
                  key={dia.toISOString()}
                  aria-current={today ? "date" : undefined}
                  className={cn(
                    "flex flex-col items-center gap-0.5 rounded-lg py-1.5 snap-start transition-colors",
                    today
                      ? "bg-gradient-surface-raised shadow-inner-hairline ring-1 ring-primary/30 shadow-glow-brand-sm"
                      : "ring-1 ring-transparent"
                  )}
                >
                  <span
                    className={cn(
                      "text-[10px] uppercase tracking-wide font-semibold capitalize",
                      today ? "text-primary" : "text-muted-foreground/70"
                    )}
                  >
                    {formatDiaSemana(dia)}
                  </span>
                  <span
                    className={cn(
                      "text-sm font-bold leading-none tabular-nums",
                      today ? "text-primary" : "text-foreground/80"
                    )}
                  >
                    {formatDiaNumero(dia)}
                  </span>
                  {today && (
                    <span className="sr-only">hoje</span>
                  )}
                </div>
              )
            })}
          </div>

          <div className="flex flex-col gap-1">
            {membros.map((membro) => (
              <div
                key={membro.id}
                className="grid gap-1 items-center rounded-lg bg-gradient-surface ring-1 ring-foreground/5 shadow-inner-hairline px-1 [@media(hover:hover)]:hover:ring-foreground/10 transition-colors"
                style={{
                  gridTemplateColumns: `180px repeat(${dias.length}, 1fr)`,
                }}
              >
                <div className="flex flex-col py-2 px-2 min-w-0">
                  <span className="font-semibold text-sm leading-tight truncate text-foreground">
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
                  const today = isSameDay(dia, hoje)

                  if (canEdit && isOpen) {
                    return (
                      <div
                        key={dataStr}
                        className="flex flex-col items-center gap-1 h-auto py-1.5 px-1 rounded-lg bg-gradient-surface-raised ring-1 ring-primary/25 shadow-glow-brand-sm"
                      >
                        <div className="flex gap-0.5">
                          {["AB", "FE"].map((t) => (
                            <button
                              key={t}
                              type="button"
                              disabled={isPending}
                              onClick={() => handleSave(membro.id, dataStr, t)}
                              className={cn(
                                "text-[10px] font-bold px-2 py-1.5 rounded-md transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:opacity-50 focus-ring-brand [@media(hover:hover)]:hover:-translate-y-px motion-reduce:hover:translate-y-0 active:translate-y-0",
                                item?.turno === t
                                  ? "bg-gradient-brand text-bica-fg shadow-glow-brand-sm"
                                  : "bg-ink4 text-b3 [@media(hover:hover)]:hover:bg-ink4/80 [@media(hover:hover)]:hover:text-foreground"
                              )}
                            >
                              {t}
                            </button>
                          ))}
                          {item && (
                            <button
                              type="button"
                              disabled={isPending}
                              onClick={() => handleConfirmar(item.id, !item.confirmado)}
                              aria-pressed={item.confirmado ?? false}
                              aria-label={item.confirmado ? "Desmarcar confirmação" : "Confirmar turno"}
                              className={cn(
                                "text-[10px] font-bold px-2 py-1.5 rounded-md transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:opacity-50 focus-ring-brand [@media(hover:hover)]:hover:-translate-y-px motion-reduce:hover:translate-y-0 active:translate-y-0",
                                item.confirmado
                                  ? "border border-success/25 bg-success-bg text-success shadow-sm"
                                  : "bg-ink4 text-b3 [@media(hover:hover)]:hover:bg-success-bg [@media(hover:hover)]:hover:text-success"
                              )}
                            >
                              ✓
                            </button>
                          )}
                          {item && (
                            <ConfirmDialog
                              trigger={
                                <button
                                  type="button"
                                  disabled={isPending}
                                  className="text-[10px] font-bold px-2 py-1.5 rounded-md transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:opacity-50 focus-ring-brand bg-danger-bg text-danger border border-destructive/25 [@media(hover:hover)]:hover:-translate-y-px [@media(hover:hover)]:hover:bg-destructive/20 motion-reduce:hover:translate-y-0 active:translate-y-0"
                                >
                                  ✕
                                </button>
                              }
                              title="Remover turno?"
                              description="O turno escalado será removido. Esta ação não pode ser desfeita."
                              confirmLabel="Remover"
                              destructive
                              successMessage="Turno removido"
                              onConfirm={async () => {
                                await removerEscala(item.id)
                                setOpenCell(null)
                              }}
                            />
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => setOpenCell(null)}
                          className="text-[9px] text-muted-foreground/60 leading-none rounded focus-ring-brand [@media(hover:hover)]:hover:text-muted-foreground transition-colors"
                        >
                          fechar
                        </button>
                      </div>
                    )
                  }

                  return (
                    <div
                      key={dataStr}
                      className={cn(
                        "flex items-center justify-center h-10 rounded-lg",
                        today && "bg-primary/[0.06] ring-1 ring-primary/15"
                      )}
                    >
                      {item ? (
                        <button
                          type="button"
                          onClick={() => handleCellClick(key)}
                          disabled={isPending}
                          aria-label={`${TURNO_LABEL[item.turno] ?? item.turno} — ${item.confirmado ? "confirmado" : "pendente"}`}
                          className={cn(
                            "rounded-full transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus-ring-brand",
                            canEdit
                              ? "cursor-pointer [@media(hover:hover)]:hover:-translate-y-px [@media(hover:hover)]:hover:brightness-110 motion-reduce:hover:translate-y-0 active:translate-y-0"
                              : "cursor-default"
                          )}
                        >
                          <Badge
                            className="h-7 px-2 text-[10px] font-bold"
                            variant={item.confirmado ? "success" : "warning"}
                          >
                            {item.confirmado && (
                              <span aria-hidden className="text-success">✓</span>
                            )}
                            {TURNO_LABEL[item.turno] ?? item.turno}
                          </Badge>
                        </button>
                      ) : canEdit ? (
                        <button
                          type="button"
                          onClick={() => handleCellClick(key)}
                          disabled={isPending}
                          aria-label="Adicionar turno"
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground/40 [@media(hover:hover)]:hover:text-primary [@media(hover:hover)]:hover:bg-primary/10 [@media(hover:hover)]:hover:ring-1 [@media(hover:hover)]:hover:ring-primary/20 transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] text-base focus-ring-brand"
                        >
                          +
                        </button>
                      ) : (
                        <span className="text-xs text-muted-foreground/40" aria-hidden>
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
        {/* Affordance de scroll: fade sutil na borda direita, só no mobile */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent sm:hidden"
        />
      </div>

      <div className="mt-4 border-t border-border pt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        <span>
          <span className="font-semibold text-foreground/80">AB</span> = Abertura
        </span>
        <span>
          <span className="font-semibold text-foreground/80">FE</span> = Fechamento
        </span>
        <Badge variant="success" className="h-5 gap-1 text-[10px]">
          <span aria-hidden>✓</span> Confirmado
        </Badge>
        <Badge variant="warning" className="h-5 text-[10px]">
          Pendente
        </Badge>
      </div>
    </div>
  )
}
