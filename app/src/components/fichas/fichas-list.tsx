"use client"

import { useState } from "react"
import { ChefHat, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { FichaCard } from "@/components/fichas/ficha-card"
import type { Tables } from "@/types/database.types"

type FichaTecnica = Tables<"fichas_tecnicas">

interface FichasListProps {
  fichas: FichaTecnica[]
  categorias: string[]
}

function agruparPorCategoria(fichas: FichaTecnica[]) {
  return fichas.reduce<Record<string, FichaTecnica[]>>((acc, f) => {
    const cat = f.categoria ?? "Sem categoria"
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(f)
    return acc
  }, {})
}

export function FichasList({ fichas, categorias }: FichasListProps) {
  const [query, setQuery] = useState("")
  const [filtroCategoria, setFiltroCategoria] = useState<string | null>(null)

  const fichasFiltradas = fichas.filter(f => {
    const matchQuery = query.trim() === "" ||
      f.nome.toLowerCase().includes(query.toLowerCase()) ||
      (f.categoria ?? "").toLowerCase().includes(query.toLowerCase())
    const matchCategoria = filtroCategoria === null || (f.categoria ?? "Sem categoria") === filtroCategoria
    return matchQuery && matchCategoria
  })

  const grupos = agruparPorCategoria(fichasFiltradas)
  const gruposOrdenados = Object.keys(grupos).sort()

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar ficha..."
          className="w-full rounded-lg bg-gradient-surface ring-1 ring-foreground/10 shadow-inner-hairline pl-9 pr-3 py-2.5 text-sm placeholder:text-muted-foreground transition-shadow duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus:outline-none focus:ring-1 focus:ring-primary/50 focus:shadow-glow-brand-sm"
        />
      </div>

      {/* Filtro por categoria */}
      {categorias.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
          <button
            type="button"
            onClick={() => setFiltroCategoria(null)}
            className={cn(
              "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
              filtroCategoria === null
                ? "bg-gradient-brand text-bica-fg border-transparent shadow-glow-brand-sm"
                : "bg-transparent text-b3 border-ink4 [@media(hover:hover)]:hover:border-foreground/20 [@media(hover:hover)]:hover:text-b2"
            )}
          >
            Todas
          </button>
          {categorias.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setFiltroCategoria(filtroCategoria === cat ? null : cat)}
              className={cn(
                "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                filtroCategoria === cat
                  ? "bg-gradient-brand text-bica-fg border-transparent shadow-glow-brand-sm"
                  : "bg-transparent text-b3 border-ink4 [@media(hover:hover)]:hover:border-foreground/20 [@media(hover:hover)]:hover:text-b2"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Lista */}
      {fichasFiltradas.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl bg-gradient-surface ring-1 ring-foreground/10 shadow-inner-hairline py-16 text-muted-foreground">
          <div className="flex size-16 items-center justify-center rounded-full bg-gradient-surface-raised ring-1 ring-foreground/10">
            <ChefHat className="size-8 text-primary/70" />
          </div>
          <p className="text-sm">{query ? "Nenhuma ficha encontrada" : "Nenhuma ficha cadastrada"}</p>
        </div>
      ) : (
        gruposOrdenados.map(categoria => (
          <div key={categoria}>
            <h2 className="mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {categoria}
            </h2>
            <div className="space-y-3">
              {grupos[categoria].map(ficha => (
                <FichaCard key={ficha.id} ficha={ficha} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
