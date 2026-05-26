"use client"

import * as React from "react"
import { useEffect, useState, useTransition } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { calcularCmv } from "@/lib/fichas"
import { salvarFicha } from "@/app/actions/fichas"
import { cn } from "@/lib/utils"
import type { Tables } from "@/types/database.types"

type FichaTecnica = Tables<"fichas_tecnicas">

interface FichaFormDialogProps {
  ficha?: FichaTecnica
  trigger: React.ReactElement<{ onClick?: () => void }>
}

function parseNum(v: string): number | null {
  const t = v.trim()
  if (t === "") return null
  const n = parseFloat(t.replace(",", "."))
  return Number.isFinite(n) ? n : null
}

const cmvColor = (cmv: number) =>
  cmv <= 25 ? "text-success" : cmv <= 35 ? "text-warning" : "text-danger"

export function FichaFormDialog({ ficha, trigger }: FichaFormDialogProps) {
  const editing = Boolean(ficha?.id)
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  const [nome, setNome] = useState(ficha?.nome ?? "")
  const [categoria, setCategoria] = useState(ficha?.categoria ?? "")
  const [custo, setCusto] = useState(ficha?.custo_total != null ? String(ficha.custo_total) : "")
  const [venda, setVenda] = useState(ficha?.preco_venda != null ? String(ficha.preco_venda) : "")
  const [rendimento, setRendimento] = useState(
    ficha?.rendimento != null ? String(ficha.rendimento) : ""
  )
  const [unidade, setUnidade] = useState(ficha?.unidade_rendimento ?? "")

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  const cmvPreview = calcularCmv(parseNum(custo), parseNum(venda))

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nome.trim()) {
      toast.error("Informe o nome da ficha")
      return
    }
    startTransition(async () => {
      try {
        await salvarFicha({
          id: ficha?.id,
          nome,
          categoria,
          custoTotal: parseNum(custo),
          precoVenda: parseNum(venda),
          rendimento: parseNum(rendimento),
          unidadeRendimento: unidade,
        })
        toast.success(editing ? "Ficha atualizada" : "Ficha criada", nome.trim())
        setOpen(false)
      } catch {
        toast.error("Não foi possível salvar a ficha")
      }
    })
  }

  const triggerWithHandler = React.cloneElement(trigger, {
    onClick: () => setOpen(true),
  })

  const field =
    "w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
  const labelCls = "flex flex-col gap-1 text-xs font-medium text-muted-foreground"

  return (
    <>
      {triggerWithHandler}

      {open && (
        <div className="fixed inset-0 z-[150] flex items-end justify-center sm:items-center">
          <button
            type="button"
            aria-label="Fechar"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={editing ? "Editar ficha" : "Nova ficha"}
            className="relative max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-card p-4 ring-1 ring-foreground/10 sm:max-w-md sm:rounded-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl text-primary">
                {editing ? "Editar ficha" : "Nova ficha"}
              </h2>
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
                  placeholder="Ex.: Drink autoral"
                />
              </label>

              <label className={labelCls}>
                Categoria
                <input
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className={field}
                  placeholder="Ex.: Coquetelaria"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className={labelCls}>
                  Custo (R$)
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    value={custo}
                    onChange={(e) => setCusto(e.target.value)}
                    className={field}
                  />
                </label>
                <label className={labelCls}>
                  Venda (R$)
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    value={venda}
                    onChange={(e) => setVenda(e.target.value)}
                    className={field}
                  />
                </label>
              </div>

              <div className="flex items-center justify-between rounded-md bg-ink2 px-3 py-2">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  CMV calculado
                </span>
                <span
                  className={cn(
                    "font-mono text-base font-semibold tabular-nums",
                    cmvPreview != null ? cmvColor(cmvPreview) : "text-muted-foreground"
                  )}
                >
                  {cmvPreview != null ? `${cmvPreview.toFixed(1)}%` : "—"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className={labelCls}>
                  Rendimento
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    inputMode="decimal"
                    value={rendimento}
                    onChange={(e) => setRendimento(e.target.value)}
                    className={field}
                  />
                </label>
                <label className={labelCls}>
                  Unidade
                  <input
                    value={unidade}
                    onChange={(e) => setUnidade(e.target.value)}
                    className={field}
                    placeholder="un, porção…"
                  />
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setOpen(false)}
                  disabled={pending}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="brand"
                  className="flex-1"
                  disabled={pending}
                >
                  {pending ? "Salvando…" : "Salvar"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
