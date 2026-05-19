"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Tables } from "@/types/database.types"

type FichaTecnica = Tables<"fichas_tecnicas">

function getCmvColor(pct: number | null): string {
  if (!pct) return "text-muted-foreground"
  if (pct <= 25) return "text-green-600"
  if (pct <= 35) return "text-yellow-600"
  return "text-red-600"
}

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })

interface FichaCardProps {
  ficha: FichaTecnica
}

export function FichaCard({ ficha }: FichaCardProps) {
  return (
    <Card size="sm" className="rounded-lg border shadow-sm">
      <CardHeader className="pb-1">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="font-bold text-sm leading-tight">{ficha.nome}</CardTitle>
          {ficha.categoria && (
            <Badge variant="outline" className="shrink-0 text-xs">
              {ficha.categoria}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-1 pt-1">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">CMV</span>
          <span className={`text-sm font-semibold ${getCmvColor(ficha.cmv_pct)}`}>
            {ficha.cmv_pct != null ? `${ficha.cmv_pct.toFixed(1)}%` : "—"}
          </span>
        </div>
        {ficha.custo_total != null && (
          <p className="text-xs text-muted-foreground">
            Custo: <span className="font-medium text-foreground">{brl.format(ficha.custo_total)}</span>
          </p>
        )}
        {ficha.preco_venda != null && (
          <p className="text-xs text-muted-foreground">
            Venda: <span className="font-medium text-foreground">{brl.format(ficha.preco_venda)}</span>
          </p>
        )}
        {ficha.rendimento != null && (
          <p className="text-xs text-muted-foreground">
            Rende:{" "}
            <span className="font-medium text-foreground">
              {ficha.rendimento} {ficha.unidade_rendimento ?? "unidade"}
            </span>
          </p>
        )}
      </CardContent>
    </Card>
  )
}
