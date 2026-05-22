'use client'

import { useState, useTransition, useMemo } from 'react'
import { Plus, X, Search, ShoppingCart, Check } from 'lucide-react'
import { adicionarItemRodada } from '@/app/actions/compras'
import type { Tables } from '@/types/database.types'

type ComprasCategoria = Tables<'compras_categorias'> & {
  compras_itens: Tables<'compras_itens'>[]
}

type Props = {
  rodadaId: string
  categorias: ComprasCategoria[]
  itemIdsNaRodada: string[]
}

export function AdicionarItemSheet({ rodadaId, categorias, itemIdsNaRodada }: Props) {
  const [aberto, setAberto] = useState(false)
  const [busca, setBusca] = useState('')
  const [adicionando, setAdicionando] = useState<Set<string>>(new Set())
  const [adicionados, setAdicionados] = useState<Set<string>>(new Set(itemIdsNaRodada))
  const [, startTransition] = useTransition()

  const categoriasFiltradas = useMemo(() => {
    if (!busca.trim()) return categorias
    const q = busca.toLowerCase()
    return categorias
      .map((cat) => ({
        ...cat,
        compras_itens: cat.compras_itens.filter((i) =>
          i.nome.toLowerCase().includes(q)
        ),
      }))
      .filter((cat) => cat.compras_itens.length > 0)
  }, [categorias, busca])

  function handleAdicionar(item: Tables<'compras_itens'>) {
    if (adicionando.has(item.id)) return
    setAdicionando((prev) => new Set([...prev, item.id]))
    setAdicionados((prev) => new Set([...prev, item.id]))
    startTransition(async () => {
      await adicionarItemRodada(rodadaId, item.id, item.nome, item.unidade, 1)
      setAdicionando((prev) => {
        const next = new Set(prev)
        next.delete(item.id)
        return next
      })
    })
  }

  function fechar() {
    setAberto(false)
    setBusca('')
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setAberto(true)}
        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors"
        style={{ borderColor: 'var(--color-bica)', color: 'var(--color-bica)' }}
      >
        <Plus className="size-3.5" />
        Adicionar item
      </button>

      {aberto && (
        <>
          <div
            className="fixed inset-0 z-[200] bg-black/50"
            onClick={fechar}
          />
          <div
            className="fixed bottom-0 left-0 right-0 z-[201] bg-background rounded-t-2xl shadow-2xl flex flex-col"
            style={{ maxHeight: '82dvh' }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
              <h2 className="text-base font-semibold flex items-center gap-2">
                <ShoppingCart className="size-4" style={{ color: 'var(--color-bica)' }} />
                Adicionar itens
              </h2>
              <button
                type="button"
                onClick={fechar}
                className="p-1.5 rounded-full hover:bg-muted"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="px-4 py-2 border-b shrink-0">
              <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-1.5">
                <Search className="size-3.5 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar item..."
                  className="flex-1 text-sm bg-transparent outline-none"
                  autoFocus
                />
                {busca && (
                  <button type="button" onClick={() => setBusca('')}>
                    <X className="size-3.5 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pb-10">
              {categoriasFiltradas.length === 0 ? (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  Nenhum item encontrado
                </p>
              ) : (
                categoriasFiltradas.map((cat) => (
                  <div key={cat.id}>
                    <div className="sticky top-0 bg-muted/80 backdrop-blur-sm px-4 py-1.5 border-b">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                        {cat.emoji && `${cat.emoji} `}
                        {cat.nome}
                      </span>
                    </div>
                    <ul className="divide-y divide-border">
                      {cat.compras_itens.map((item) => {
                        const jaAdicionado = adicionados.has(item.id)
                        const loading = adicionando.has(item.id)
                        return (
                          <li
                            key={item.id}
                            className="flex items-center justify-between px-4 py-3 gap-3 bg-card"
                          >
                            <div className="min-w-0">
                              <span className="text-sm font-medium block leading-snug">
                                {item.nome}
                              </span>
                              {item.unidade && (
                                <span className="text-xs text-muted-foreground">
                                  {item.unidade}
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              disabled={loading}
                              onClick={() => handleAdicionar(item)}
                              className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all"
                              style={
                                jaAdicionado
                                  ? { backgroundColor: '#dcfce7', color: '#15803d' }
                                  : { backgroundColor: 'var(--color-bica)', color: '#fff' }
                              }
                            >
                              {jaAdicionado ? (
                                <>
                                  <Check className="size-3" />
                                  Adicionado
                                </>
                              ) : (
                                <>
                                  <Plus className="size-3" />
                                  Add
                                </>
                              )}
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}
