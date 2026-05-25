"use client"

import { useState } from "react"
import { Package, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { ItemEstoque } from "@/components/estoque/item-estoque"
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
    <section className="rounded-lg p-3 space-y-2 bg-danger-bg">
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
    </section>
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
      {/* Alertas */}
      <AlertasEstoque itens={itens} />

      {/* Filtro por categoria */}
      {categorias.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
          <button
            type="button"
            onClick={() => setFiltro(null)}
            className={cn(
              "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border border-transparent transition-colors",
              filtro === null
                ? "bg-primary text-bica-fg"
                : "bg-ink4 text-b3 border-ink4"
            )}
          >
            Todos
          </button>
          {categorias.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFiltro(filtro === cat.id ? null : cat.id)}
              className={cn(
                "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                filtro === cat.id
                  ? "bg-primary text-bica-fg border-transparent"
                  : "bg-transparent text-b3 border-ink4"
              )}
            >
              {cat.emoji ? `${cat.emoji} ` : ""}{cat.nome}
            </button>
          ))}
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
          <section key={categoria.id}>
            <div className="sticky top-0 bg-background z-10 pb-1 mb-1">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                {categoria.emoji && <span>{categoria.emoji}</span>}
                {categoria.nome}
                <span className="text-xs font-normal text-muted-foreground ml-1">
                  ({itensCategoria.length})
                </span>
              </h2>
              <div className="h-px bg-border mt-1" />
            </div>
            <div className="divide-y divide-border">
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
        <section>
          <div className="sticky top-0 bg-background z-10 pb-1 mb-1">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              Outros
              <span className="text-xs font-normal text-muted-foreground ml-1">
                ({semCategoria.length})
              </span>
            </h2>
            <div className="h-px bg-border mt-1" />
          </div>
          <div className="divide-y divide-border">
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
