"use client"

import { useTransition, useOptimistic } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tables } from "@/types/database.types"
import { marcarItemComprado, fecharRodada } from "@/app/actions/compras"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"

type RodadaItem = Tables<"rodada_itens">
type Rodada = Tables<"rodadas"> & { rodada_itens: RodadaItem[] }

interface RodadaCardProps {
  rodada: Rodada
}

function formatarMoeda(valor: number | null): string {
  if (valor == null) return "R$ 0,00"
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

function formatarData(data: string): string {
  const [ano, mes, dia] = data.split("-")
  return `${dia}/${mes}/${ano}`
}

function RodadaAberta({ rodada }: { rodada: Rodada }) {
  const [, startTransition] = useTransition()
  const itensInicial = rodada.rodada_itens ?? []

  const [itens, setItens] = useOptimistic(
    itensInicial,
    (state, { id, comprado }: { id: string; comprado: boolean }) =>
      state.map((i) => (i.id === id ? { ...i, comprado } : i)),
  )

  const total =
    rodada.total ?? itens.reduce((acc, item) => acc + (item.total ?? 0), 0)

  function handleToggle(item: RodadaItem) {
    const novoComprado = !(item.comprado ?? false)
    startTransition(async () => {
      setItens({ id: item.id, comprado: novoComprado })
      try {
        await marcarItemComprado(item.id, novoComprado)
      } catch {
        toast.error("Não foi possível atualizar o item")
      }
    })
  }

  function handleFechar() {
    startTransition(async () => {
      try {
        await fecharRodada(rodada.id)
        toast.success("Rodada fechada", rodada.nome)
      } catch {
        toast.error("Não foi possível fechar a rodada")
      }
    })
  }

  return (
    <Card
      className={cn("rounded-lg border shadow-sm", "border-primary")}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">{rodada.nome}</CardTitle>
          <Badge variant="success" className="shrink-0 text-xs font-semibold">
            ABERTA
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">{formatarData(rodada.data)}</p>
      </CardHeader>

      <CardContent className="space-y-3">
        {itens.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">Nenhum item nesta rodada</p>
        ) : (
          <ul className="divide-y divide-border">
            {itens.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => handleToggle(item)}
                  className={cn("w-full flex items-center gap-3 py-2.5 text-sm text-left", "min-h-[52px]")}
                >
                  <input
                    type="checkbox"
                    checked={item.comprado ?? false}
                    readOnly
                    className="accent-bica h-4 w-4 shrink-0 pointer-events-none"
                  />
                  <span
                    className={`flex-1 ${item.comprado ? "line-through text-muted-foreground" : ""}`}
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
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center justify-between border-t pt-2">
          <button
            type="button"
            onClick={handleFechar}
            className="text-xs text-muted-foreground underline underline-offset-2"
          >
            Fechar rodada
          </button>
          <p className="text-sm font-bold">
            Total:{" "}
            <span className="text-primary">{formatarMoeda(total)}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export function RodadaCard({ rodada }: RodadaCardProps) {
  if (rodada.status === "aberta") return <RodadaAberta rodada={rodada} />

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
