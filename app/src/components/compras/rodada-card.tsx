"use client"

import { useTransition, useOptimistic } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Checkbox } from "@/components/ui/checkbox"
import {
  TableContainer,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
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

  function handleToggle(item: RodadaItem, novoComprado: boolean) {
    startTransition(async () => {
      setItens({ id: item.id, comprado: novoComprado })
      try {
        await marcarItemComprado(item.id, novoComprado)
      } catch {
        toast.error("Não foi possível atualizar o item")
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
          <TableContainer>
            <Table>
              <TableHeader>
                <TableRow>
                  {/* Coluna do checkbox — sem rótulo visível */}
                  <TableHead className="w-10" />
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Qtd</TableHead>
                  <TableHead className="text-right">Preço</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itens.map((item) => {
                  const comprado = item.comprado ?? false
                  // Linha inteira clicável; checkbox reflete e controla o estado.
                  return (
                    <TableRow
                      key={item.id}
                      data-state={comprado ? "selected" : undefined}
                      onClick={() => handleToggle(item, !comprado)}
                      className="cursor-pointer"
                    >
                      <TableCell className="w-10">
                        <Checkbox
                          checked={comprado}
                          aria-label={`Marcar ${item.nome} como comprado`}
                          onCheckedChange={(checked) =>
                            handleToggle(item, checked)
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                      <TableCell
                        className={cn(
                          comprado && "line-through text-muted-foreground",
                        )}
                      >
                        {item.nome}
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">
                        {item.quantidade ?? 1} {item.unidade ?? "un"}
                      </TableCell>
                      <TableCell className="text-right text-xs font-medium whitespace-nowrap">
                        {item.preco_unit != null
                          ? formatarMoeda(item.preco_unit)
                          : "—"}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <div className="flex items-center justify-between border-t pt-2">
          <ConfirmDialog
            trigger={
              <button
                type="button"
                className="text-xs text-muted-foreground underline underline-offset-2"
              >
                Fechar rodada
              </button>
            }
            title="Fechar esta rodada?"
            description="Uma rodada fechada não pode ser reaberta nem editada."
            confirmLabel="Fechar rodada"
            destructive
            successMessage={`Rodada fechada · ${rodada.nome}`}
            onConfirm={() => fecharRodada(rodada.id)}
          />
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
