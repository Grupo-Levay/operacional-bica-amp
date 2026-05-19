"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tables } from "@/types/database.types"

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

export function RodadaCard({ rodada }: RodadaCardProps) {
  const isAberta = rodada.status === "aberta"
  const itens = rodada.rodada_itens ?? []
  const total =
    rodada.total ??
    itens.reduce((acc, item) => acc + (item.total ?? 0), 0)

  if (isAberta) {
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
          <p className="text-xs text-muted-foreground">
            {formatarData(rodada.data)}
          </p>
        </CardHeader>

        <CardContent className="space-y-2">
          {itens.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">
              Nenhum item nesta rodada
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {itens.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-2 py-2 text-sm"
                >
                  <input
                    type="checkbox"
                    defaultChecked={item.comprado ?? false}
                    className="accent-[var(--color-bica)] h-4 w-4 shrink-0 cursor-pointer"
                    readOnly
                  />
                  <span
                    className={`flex-1 ${item.comprado ? "line-through text-muted-foreground" : ""}`}
                  >
                    {item.nome}
                  </span>
                  <span className="text-muted-foreground text-xs shrink-0">
                    {item.quantidade ?? 1} {item.unidade ?? "un"}
                  </span>
                  <span className="text-xs font-medium shrink-0">
                    {formatarMoeda(item.preco_unit)}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="flex justify-end border-t pt-2">
            <p className="text-sm font-bold">
              Total:{" "}
              <span style={{ color: "var(--color-bica)" }}>
                {formatarMoeda(total)}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Rodada fechada — visão colapsada
  return (
    <Card className="rounded-lg border shadow-sm">
      <CardContent className="flex items-center justify-between py-3">
        <div>
          <p className="text-sm font-medium">{rodada.nome}</p>
          <p className="text-xs text-muted-foreground">
            {formatarData(rodada.data)}
          </p>
        </div>
        <p className="text-sm font-semibold">{formatarMoeda(total)}</p>
      </CardContent>
    </Card>
  )
}
