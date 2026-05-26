"use client"

import { Pencil } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FichaFormDialog } from "@/components/fichas/ficha-form-dialog"
import { cn } from "@/lib/utils"
import type { Tables } from "@/types/database.types"

type FichaTecnica = Tables<"fichas_tecnicas">

function getCmvToken(pct: number | null): { text: string; bar: string } {
  if (!pct) return { text: 'text-b3', bar: 'bg-b3' }
  if (pct <= 25) return { text: 'text-success', bar: 'bg-success' }
  if (pct <= 35) return { text: 'text-warning', bar: 'bg-warning' }
  return { text: 'text-danger', bar: 'bg-danger' }
}

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })

interface FichaCardProps {
  ficha: FichaTecnica
}

export function FichaCard({ ficha }: FichaCardProps) {
  const cmvTokens = getCmvToken(ficha.cmv_pct)
  const cmvPercent = ficha.cmv_pct != null ? Math.min(100, ficha.cmv_pct) : 0

  return (
    <Card size="sm" className="rounded-lg border shadow-sm">
      <CardHeader className="pb-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <CardTitle className="font-bold text-sm leading-tight">{ficha.nome}</CardTitle>
            {ficha.rendimento != null && (
              <p className="text-xs text-b3 mt-0.5">
                Rende {ficha.rendimento} {ficha.unidade_rendimento ?? 'un'}
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {ficha.categoria && (
              <Badge variant="outline" className="text-xs">
                {ficha.categoria}
              </Badge>
            )}
            <FichaFormDialog
              ficha={ficha}
              trigger={
                <Button
                  size="icon-xs"
                  variant="ghost"
                  className="size-7 text-b4 hover:text-foreground"
                  aria-label={`Editar ${ficha.nome}`}
                >
                  <Pencil className="size-3.5" />
                </Button>
              }
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pt-1">
        {/* CMV com barra visual */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-b3">CMV</span>
            <span className={cn("text-sm font-semibold tabular-nums", cmvTokens.text)}>
              {ficha.cmv_pct != null ? `${ficha.cmv_pct.toFixed(1)}%` : "—"}
            </span>
          </div>
          {ficha.cmv_pct != null && (
            <div className="h-1.5 rounded-full bg-ink4 overflow-hidden">
              <div
                className={cn("h-full rounded-full", cmvTokens.bar)}
                style={{ width: `${cmvPercent}%` }}
              />
            </div>
          )}
        </div>

        {/* Custo e Venda lado a lado */}
        <div className="flex gap-4">
          {ficha.custo_total != null && (
            <div>
              <p className="text-xs text-b3">Custo</p>
              <p className="text-sm font-medium text-b1 tabular-nums">{brl.format(ficha.custo_total)}</p>
            </div>
          )}
          {ficha.preco_venda != null && (
            <div>
              <p className="text-xs text-b3">Venda</p>
              <p className="text-sm font-medium text-b1 tabular-nums">{brl.format(ficha.preco_venda)}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
