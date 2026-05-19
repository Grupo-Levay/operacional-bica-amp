"use client"

import { Badge } from "@/components/ui/badge"

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
  AB: "AB",
  FE: "FE",
}

function formatDia(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "numeric",
  }).format(date)
}

export function EscalaGrid({ membros, escala, dias }: Props) {
  if (membros.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center gap-2">
        <p className="text-muted-foreground text-sm">Equipe não cadastrada</p>
      </div>
    )
  }

  // Index escala por membro_id + data
  const escalaIndex = new Map<string, EscalaItem>()
  for (const item of escala) {
    if (item.membro_id) {
      escalaIndex.set(`${item.membro_id}__${item.data}`, item)
    }
  }

  const hasEscala = escala.length > 0

  return (
    <div>
      {!hasEscala && (
        <p className="text-sm text-muted-foreground mb-4">
          Nenhuma escala para esta semana
        </p>
      )}

      <div className="overflow-x-auto -mx-4 px-4">
        <div className="min-w-[480px]">
          {/* Header row */}
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
                className="text-xs text-muted-foreground font-medium text-center py-1 capitalize"
              >
                {formatDia(dia)}
              </div>
            ))}
          </div>

          {/* Member rows */}
          <div className="flex flex-col gap-1">
            {membros.map((membro) => (
              <div
                key={membro.id}
                className="grid gap-1 items-center"
                style={{
                  gridTemplateColumns: `180px repeat(${dias.length}, 1fr)`,
                }}
              >
                {/* Member info */}
                <div className="flex flex-col py-2 pr-2">
                  <span className="font-semibold text-sm leading-tight truncate">
                    {membro.nome}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {membro.funcao}
                  </span>
                </div>

                {/* Day cells */}
                {dias.map((dia) => {
                  const dataStr = dia.toISOString().split("T")[0]
                  const item = escalaIndex.get(`${membro.id}__${dataStr}`)

                  return (
                    <div
                      key={dataStr}
                      className="flex items-center justify-center h-10"
                    >
                      {item ? (
                        <Badge
                          className={
                            item.confirmado
                              ? "text-[10px] font-bold px-1.5 h-7 text-white border-0"
                              : "text-[10px] font-bold px-1.5 h-7 border-0"
                          }
                          style={
                            item.confirmado
                              ? { backgroundColor: "var(--color-bica)" }
                              : undefined
                          }
                          variant={item.confirmado ? "default" : "secondary"}
                        >
                          {TURNO_LABEL[item.turno] ?? item.turno}
                        </Badge>
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

      {/* Legenda */}
      <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
        <span>
          <span className="font-semibold">AB</span> = Abertura
        </span>
        <span>
          <span className="font-semibold">FE</span> = Fechamento
        </span>
        <span className="flex items-center gap-1">
          <span
            className="inline-block w-3 h-3 rounded-sm"
            style={{ backgroundColor: "var(--color-bica)" }}
          />
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
