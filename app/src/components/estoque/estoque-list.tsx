"use client"

import { useState } from "react"
import { Package, AlertTriangle, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ItemEstoque } from "@/components/estoque/item-estoque"
import { NovoItemForm } from "@/components/estoque/novo-item-form"
import type { Database } from "@/types/database.types"

type Categoria = Database["public"]["Tables"]["estoque_categorias"]["Row"]
type Item = Database["public"]["Tables"]["estoque_itens"]["Row"]

interface EstoqueListProps {
  categorias: Categoria[]
  itens: Item[]
}

function AlertasEstoque({ itens }: { itens: Item[] }) {
  const criticos = itens.filter(
    (i) => (i.minimo ?? 0) > 0 && (i.atual ?? 0) < (i.minimo ?? 0) * 0.5
  )
  const baixos = itens.filter(
    (i) =>
      (i.minimo ?? 0) > 0 &&
      (i.atual ?? 0) >= (i.minimo ?? 0) * 0.5 &&
      (i.atual ?? 0) < (i.minimo ?? 0)
  )

  if (criticos.length === 0 && baixos.length === 0) return null

  return (
    <Card
      variant="flat"
      size="sm"
      className="gap-2 bg-danger-bg px-3.5 shadow-sm ring-destructive/20"
    >
      <div className="flex items-center gap-2">
        <AlertTriangle size={14} className="text-danger" />
        <span className="text-xs font-semibold uppercase tracking-wide text-danger">
          Alertas de Estoque
        </span>
      </div>
      {criticos.map((item) => (
        <div key={item.id} className="flex items-center justify-between text-xs">
          <span className="font-medium text-danger">
            {item.nome}
            {item.unidade && (
              <span className="font-normal text-muted-foreground ml-1">({item.unidade})</span>
            )}
          </span>
          <span className="text-danger">
            {item.atual ?? 0} / mín {item.minimo ?? 0}
          </span>
        </div>
      ))}
      {baixos.map((item) => (
        <div key={item.id} className="flex items-center justify-between text-xs">
          <span className="text-warning">
            {item.nome}
            {item.unidade && (
              <span className="font-normal text-muted-foreground ml-1">({item.unidade})</span>
            )}
          </span>
          <span className="text-warning">
            {item.atual ?? 0} / mín {item.minimo ?? 0}
          </span>
        </div>
      ))}
    </Card>
  )
}

export function EstoqueList({ categorias, itens }: EstoqueListProps) {
  const [filtro, setFiltro] = useState<string | null>(null)

  const itensFiltrados = filtro
    ? itens.filter(i => i.categoria_id === filtro)
    : itens

  const itensPorCategoria = new Map<string, Item[]>()
  for (const item of itensFiltrados) {
    const catId = item.categoria_id ?? "__sem_categoria__"
    if (!itensPorCategoria.has(catId)) itensPorCategoria.set(catId, [])
    itensPorCategoria.get(catId)!.push(item)
  }

  const categoriasComItens = categorias.filter(
    c => (itensPorCategoria.get(c.id)?.length ?? 0) > 0
  )
  const semCategoria = itensPorCategoria.get("__sem_categoria__") ?? []

  return (
    <>
      {/* Novo item */}
      <NovoItemForm
        categorias={categorias}
        trigger={
          <Button variant="gradient" size="cta" className="justify-center">
            <Plus className="size-4" />
            Novo item
          </Button>
        }
      />

      {/* Alertas */}
      <AlertasEstoque itens={itens} />

      {/* Filtro por categoria — segmented control (ToggleGroup) */}
      {categorias.length > 0 && (
        <div className="-mx-4 overflow-x-auto px-4 pb-1 scrollbar-none">
          <ToggleGroup
            value={[filtro ?? "todos"]}
            onValueChange={(vals) => {
              // Seleção única: "todos" (ou seleção vazia) limpa o filtro.
              const next = vals[0]
              setFiltro(!next || next === "todos" ? null : next)
            }}
            className="w-max"
          >
            <ToggleGroupItem value="todos" className="shrink-0 whitespace-nowrap">
              Todos
            </ToggleGroupItem>
            {categorias.map(cat => (
              <ToggleGroupItem key={cat.id} value={cat.id} className="shrink-0 whitespace-nowrap">
                {cat.emoji ? `${cat.emoji} ` : ""}{cat.nome}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      )}

      {/* Empty */}
      {itensFiltrados.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <Package className="size-12 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">Nenhum item nesta categoria</p>
        </div>
      )}

      {/* Categorias */}
      {categoriasComItens.map(categoria => {
        const itensCategoria = itensPorCategoria.get(categoria.id) ?? []
        return (
          <section key={categoria.id} className="space-y-2">
            <div className="sticky top-0 z-10 -mx-1 bg-background/90 px-1 pb-2 pt-1 backdrop-blur-sm">
              <h2 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                {categoria.emoji && <span>{categoria.emoji}</span>}
                {categoria.nome}
                <span className="ml-1 text-xs font-normal text-muted-foreground">
                  ({itensCategoria.length})
                </span>
              </h2>
              <div className="mt-1.5 h-px bg-gradient-to-r from-border to-transparent" />
            </div>
            <div className="space-y-2">
              {itensCategoria.map(item => (
                <ItemEstoque
                  key={item.id}
                  id={item.id}
                  nome={item.nome}
                  unidade={item.unidade}
                  atual={item.atual ?? 0}
                  minimo={item.minimo ?? 0}
                />
              ))}
            </div>
          </section>
        )
      })}

      {/* Sem categoria */}
      {semCategoria.length > 0 && (
        <section className="space-y-2">
          <div className="sticky top-0 z-10 -mx-1 bg-background/90 px-1 pb-2 pt-1 backdrop-blur-sm">
            <h2 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              Outros
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                ({semCategoria.length})
              </span>
            </h2>
            <div className="mt-1.5 h-px bg-gradient-to-r from-border to-transparent" />
          </div>
          <div className="space-y-2">
            {semCategoria.map(item => (
              <ItemEstoque
                key={item.id}
                id={item.id}
                nome={item.nome}
                unidade={item.unidade}
                atual={item.atual ?? 0}
                minimo={item.minimo ?? 0}
              />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
