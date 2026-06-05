"use client"

import { Pencil, Archive } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { FichaFormDialog } from "@/components/fichas/ficha-form-dialog"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { arquivarFicha } from "@/app/actions/fichas"
import { cn } from "@/lib/utils"
import type { Tables } from "@/types/database.types"

type FichaTecnica = Tables<"fichas_tecnicas">

function getCmvToken(pct: number | null): { text: string; bar: string } {
  if (!pct) return { text: 'text-b3', bar: 'bg-b3' }
  if (pct <= 30) return { text: 'text-success', bar: 'bg-success' }
  if (pct <= 40) return { text: 'text-warning', bar: 'bg-warning' }
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
    <Card size="sm" variant="interactive">
      <CardHeader className="pb-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <CardTitle className="font-bold text-sm leading-tight text-b1">{ficha.nome}</CardTitle>
            {ficha.rendimento != null && (
              <p className="text-xs text-b3 mt-0.5">
                Rende {ficha.rendimento} {ficha.unidade_rendimento ?? 'un'}
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {ficha.categoria && (
              <Badge variant="neutral">
                {ficha.categoria}
              </Badge>
            )}
            {/* Ações agrupadas: o item do menu renderiza-se como o trigger do
                dialog (Base UI `render`), preservando ConfirmDialog/FichaFormDialog
                com seus estados e server actions intactos. */}
            <DropdownMenu>
              <DropdownMenuTrigger aria-label={`Ações de ${ficha.nome}`} />
              <DropdownMenuContent>
                <FichaFormDialog
                  ficha={ficha}
                  trigger={
                    <DropdownMenuItem render={<button type="button" />}>
                      <Pencil className="size-4" />
                      Editar
                    </DropdownMenuItem>
                  }
                />
                <DropdownMenuSeparator />
                <ConfirmDialog
                  trigger={
                    <DropdownMenuItem variant="destructive" render={<button type="button" />}>
                      <Archive className="size-4" />
                      Arquivar
                    </DropdownMenuItem>
                  }
                  title="Arquivar ficha?"
                  description={`"${ficha.nome}" deixará de aparecer na lista. Você pode recriá-la depois.`}
                  confirmLabel="Arquivar"
                  destructive
                  successMessage="Ficha arquivada"
                  onConfirm={() => arquivarFicha(ficha.id)}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-1">
        {/* CMV em destaque — número grande com cor semântica + barra de severidade */}
        <div className="space-y-1.5 rounded-lg bg-gradient-surface-raised p-3 shadow-inner-hairline ring-1 ring-foreground/5">
          <div className="flex items-baseline justify-between">
            <span className="text-[0.7rem] font-medium uppercase tracking-wide text-b3">CMV</span>
            <span className={cn("text-2xl font-bold leading-none tabular-nums", cmvTokens.text)}>
              {ficha.cmv_pct != null ? `${ficha.cmv_pct.toFixed(1)}%` : "—"}
            </span>
          </div>
          {ficha.cmv_pct != null && (
            <div className="h-1.5 overflow-hidden rounded-full bg-ink/60">
              <div
                className={cn(
                  "h-full rounded-full transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  cmvTokens.bar
                )}
                style={{ width: `${cmvPercent}%` }}
              />
            </div>
          )}
        </div>

        {/* Custo e Venda lado a lado */}
        <div className="flex gap-6">
          {ficha.custo_total != null && (
            <div>
              <p className="text-[0.7rem] uppercase tracking-wide text-b3">Custo</p>
              <p className="text-sm font-semibold text-b2 tabular-nums">{brl.format(ficha.custo_total)}</p>
            </div>
          )}
          {ficha.preco_venda != null && (
            <div>
              <p className="text-[0.7rem] uppercase tracking-wide text-b3">Venda</p>
              <p className="text-sm font-semibold text-primary tabular-nums">{brl.format(ficha.preco_venda)}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
