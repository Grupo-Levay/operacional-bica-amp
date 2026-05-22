"use client"

import { useTransition, useOptimistic } from "react"
import { Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tables } from "@/types/database.types"
import { marcarItemComprado, fecharRodada, removerItemRodada } from "@/app/actions/compras"
import { AdicionarItemSheet } from "@/components/compras/adicionar-item-sheet"

type RodadaItem = Tables<"rodada_itens">
type Rodada = Tables<"rodadas"> & { rodada_itens: RodadaItem[] }
type ComprasCategoria = Tables<"compras_categorias"> & {
  compras_itens: Tables<"compras_itens">[]
}

interface RodadaCardProps {
  rodada: Rodada
  categorias?: ComprasCategoria[]
}

function formatarMoeda(valor: number | null): string {
  if (valor == null) return "R$ 0,00"
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

function formatarData(data: string): string {
  const [ano, mes, dia] = data.split("-")
  return `${dia}/${mes}/${ano}`
}

function RodadaAberta({
  rodada,
  categorias,
}: {
  rodada: Rodada
  categorias: ComprasCategoria[]
}) {
  const [, startTransition] = useTransition()
  const itensInicial = rodada.rodada_itens ?? []

  const [itens, setItens] = useOptimistic(
    itensInicial,
    (
      state,
      action:
        | { type: "toggle"; id: string; comprado: boolean }
        | { type: "remover"; id: string }
    ) => {
      if (action.type === "toggle")
        return state.map((i) => (i.id === action.id ? { ...i, comprado: action.comprado } : i))
      return state.filter((i) => i.id !== action.id)
    }
  )

  const total = itens.reduce((acc, item) => acc + (item.total ?? 0), 0)
  const itemIdsNaRodada = itensInicial.map((i) => i.item_id ?? "").filter(Boolean)

  function handleToggle(item: RodadaItem) {
    const novoComprado = !(item.comprado ?? false)
    startTransition(async () => {
      setItens({ type: "toggle", id: item.id, comprado: novoComprado })
      await marcarItemComprado(item.id, novoComprado)
    })
  }

  function handleRemover(itemId: string) {
    startTransition(async () => {
      setItens({ type: "remover", id: itemId })
      await removerItemRodada(itemId)
    })
  }

  function handleFechar() {
    startTransition(async () => {
      await fecharRodada(rodada.id)
    })
  }

  return (
    <Card
      className="rounded-lg border shadow-sm"
      style={{ borderColor: "var(--color-bica)" }}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">{rodada.nome}</CardTitle>
          <Badge
            className="text-xs font-semibold shrink-0"
            style={{ backgroundColor: "#16a34a", color: "#fff" }}
          >
            ABERTA
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">{formatarData(rodada.data)}</p>
      </CardHeader>

      <CardContent className="space-y-3">
        {itens.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            Nenhum item — adicione do catálogo abaixo
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {itens.map((item) => (
              <li key={item.id} className="group flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggle(item)}
                  className="flex-1 flex items-center gap-3 py-2.5 text-sm text-left min-w-0"
                  style={{ minHeight: "44px" }}
                >
                  <input
                    type="checkbox"
                    checked={item.comprado ?? false}
                    readOnly
                    className="accent-[var(--color-bica)] h-4 w-4 shrink-0 pointer-events-none"
                  />
                  <span
                    className={`flex-1 min-w-0 truncate ${item.comprado ? "line-through text-muted-foreground" : ""}`}
                  >
                    {item.nome}
                  </span>
                  <span className="text-muted-foreground text-xs shrink-0">
                    {item.quantidade ?? 1} {item.unidade ?? "un"}
                  </span>
                  {item.preco_unit != null && (
                    <span className="text-xs font-medium shrink-0">
                      {formatarMoeda(item.preco_unit)}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleRemover(item.id)}
                  className="shrink-0 p-1.5 rounded text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  aria-label="Remover item"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center justify-between gap-2 pt-1">
          <AdicionarItemSheet
            rodadaId={rodada.id}
            categorias={categorias}
            itemIdsNaRodada={itemIdsNaRodada}
          />
          <p className="text-sm font-bold">
            Total:{" "}
            <span style={{ color: "var(--color-bica)" }}>{formatarMoeda(total)}</span>
          </p>
        </div>

        <div className="border-t pt-2">
          <button
            type="button"
            onClick={handleFechar}
            className="text-xs text-muted-foreground underline underline-offset-2"
          >
            Fechar rodada
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

export function RodadaCard({ rodada, categorias = [] }: RodadaCardProps) {
  if (rodada.status === "aberta")
    return <RodadaAberta rodada={rodada} categorias={categorias} />

  const total =
    rodada.total ??
    (rodada.rodada_itens ?? []).reduce((acc, item) => acc + (item.total ?? 0), 0)

  return (
    <Card className="rounded-lg border shadow-sm">
      <CardContent className="flex items-center justify-between py-3">
        <div>
          <p className="text-sm font-medium">{rodada.nome}</p>
          <p className="text-xs text-muted-foreground">{formatarData(rodada.data)}</p>
        </div>
        <p className="text-sm font-semibold">{formatarMoeda(total)}</p>
      </CardContent>
    </Card>
  )
}
