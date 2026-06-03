'use client'

import * as React from 'react'
import { useState, useTransition } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { criarItemEstoque } from '@/app/actions/estoque'
import type { Database } from '@/types/database.types'

type Categoria = Database['public']['Tables']['estoque_categorias']['Row']

interface NovoItemFormProps {
  categorias: Categoria[]
  trigger: React.ReactElement<{ onClick?: () => void }>
}

function parseNum(v: string): number | null {
  const t = v.trim()
  if (t === '') return null
  const n = parseFloat(t.replace(',', '.'))
  return Number.isFinite(n) ? n : null
}

export function NovoItemForm({ categorias, trigger }: NovoItemFormProps) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  const [nome, setNome] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const [minimo, setMinimo] = useState('')
  const [unidade, setUnidade] = useState('')
  const [atual, setAtual] = useState('')

  const triggerWithHandler = React.cloneElement(trigger, {
    onClick: () => setOpen(true),
  })

  function reset() {
    setNome('')
    setCategoriaId('')
    setMinimo('')
    setUnidade('')
    setAtual('')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nome.trim()) {
      toast.error('Informe o nome do item')
      return
    }
    startTransition(async () => {
      try {
        await criarItemEstoque({
          nome,
          categoriaId: categoriaId || null,
          minimo: parseNum(minimo),
          unidade,
          atual: parseNum(atual),
        })
        toast.success('Item criado', nome.trim())
        reset()
        setOpen(false)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Não foi possível criar o item')
      }
    })
  }

  const field =
    'w-full rounded-md border border-border bg-background px-3 py-2 text-sm transition-shadow focus-ring-brand focus:border-primary/40'
  const labelCls = 'flex flex-col gap-1 text-xs font-medium text-muted-foreground'

  return (
    <>
      {triggerWithHandler}

      {open && (
        <div className="fixed inset-0 z-[150] flex items-end justify-center sm:items-center">
          <button
            type="button"
            aria-label="Fechar"
            onClick={() => !pending && setOpen(false)}
            className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Novo item de estoque"
            className="relative max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-gradient-surface-raised p-4 shadow-xl shadow-inner-hairline ring-1 ring-foreground/10 sm:max-w-md sm:rounded-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl text-primary">Novo item</h2>
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                onClick={() => setOpen(false)}
                aria-label="Fechar"
              >
                <X className="size-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <label className={labelCls}>
                Nome *
                <input
                  autoFocus
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className={field}
                  placeholder="Ex.: Gin Tanqueray"
                />
              </label>

              {categorias.length > 0 && (
                <label className={labelCls}>
                  Categoria
                  <select
                    value={categoriaId}
                    onChange={(e) => setCategoriaId(e.target.value)}
                    className={field}
                  >
                    <option value="">Sem categoria</option>
                    {categorias.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.emoji ? `${c.emoji} ` : ''}
                        {c.nome}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <div className="flex gap-3">
                <label className={`${labelCls} flex-1`}>
                  Quantidade inicial
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={atual}
                    onChange={(e) => setAtual(e.target.value)}
                    className={field}
                    placeholder="0"
                  />
                </label>
                <label className={`${labelCls} flex-1`}>
                  Mínimo
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={minimo}
                    onChange={(e) => setMinimo(e.target.value)}
                    className={field}
                    placeholder="0"
                  />
                </label>
                <label className={`${labelCls} w-24`}>
                  Unidade
                  <input
                    value={unidade}
                    onChange={(e) => setUnidade(e.target.value)}
                    className={field}
                    placeholder="un, kg, L"
                  />
                </label>
              </div>

              <Button
                type="submit"
                variant="gradient"
                size="cta"
                disabled={pending}
                className="mt-1"
              >
                {pending ? 'Criando…' : 'Criar item'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
