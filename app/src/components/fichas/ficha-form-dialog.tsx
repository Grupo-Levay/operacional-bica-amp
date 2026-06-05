"use client"

import * as React from "react"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  NumberField,
  NumberFieldGroup,
} from "@/components/ui/number-field"
import { calcularCmv } from "@/lib/fichas"
import { salvarFicha } from "@/app/actions/fichas"
import { cn } from "@/lib/utils"
import type { Tables } from "@/types/database.types"

type FichaTecnica = Tables<"fichas_tecnicas">

interface FichaFormDialogProps {
  ficha?: FichaTecnica
  trigger: React.ReactElement<{ onClick?: () => void }>
}

const cmvColor = (cmv: number) =>
  cmv <= 30 ? "text-success" : cmv <= 40 ? "text-warning" : "text-danger"

export function FichaFormDialog({ ficha, trigger }: FichaFormDialogProps) {
  const editing = Boolean(ficha?.id)
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  const [nome, setNome] = useState(ficha?.nome ?? "")
  const [categoria, setCategoria] = useState(ficha?.categoria ?? "")
  const [custo, setCusto] = useState<number | null>(ficha?.custo_total ?? null)
  const [venda, setVenda] = useState<number | null>(ficha?.preco_venda ?? null)
  const [rendimento, setRendimento] = useState<number | null>(
    ficha?.rendimento ?? null
  )
  const [unidade, setUnidade] = useState(ficha?.unidade_rendimento ?? "")

  const cmvPreview = calcularCmv(custo, venda)

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
          custoTotal: custo,
          precoVenda: venda,
          rendimento,
          unidadeRendimento: unidade,
        })
        toast.success(editing ? "Ficha atualizada" : "Ficha criada", nome.trim())
        setOpen(false)
      } catch {
        toast.error("Não foi possível salvar a ficha")
      }
    })
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        // Bloqueia fechar enquanto salva.
        if (pending) return
        setOpen(next)
      }}
    >
      <SheetTrigger render={trigger} />
      <SheetContent side="bottom" className="sm:mx-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{editing ? "Editar ficha" : "Nova ficha"}</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Field>
            <FieldLabel required>Nome</FieldLabel>
            <Input
              autoFocus
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex.: Drink autoral"
            />
          </Field>

          <Field>
            <FieldLabel>Categoria</FieldLabel>
            <Input
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              placeholder="Ex.: Coquetelaria"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel>Custo (R$)</FieldLabel>
              <NumberField value={custo} onValueChange={setCusto} min={0} step={0.01}>
                <NumberFieldGroup />
              </NumberField>
            </Field>
            <Field>
              <FieldLabel>Venda (R$)</FieldLabel>
              <NumberField value={venda} onValueChange={setVenda} min={0} step={0.01}>
                <NumberFieldGroup />
              </NumberField>
            </Field>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-gradient-surface-raised px-4 py-3 ring-1 ring-foreground/10 shadow-inner-hairline">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              CMV calculado
            </span>
            <span
              className={cn(
                "font-mono text-xl font-bold tabular-nums leading-none transition-colors duration-200",
                cmvPreview != null ? cmvColor(cmvPreview) : "text-muted-foreground"
              )}
            >
              {cmvPreview != null ? `${cmvPreview.toFixed(1)}%` : "—"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel>Rendimento</FieldLabel>
              <NumberField
                value={rendimento}
                onValueChange={setRendimento}
                min={0}
                step={0.5}
              >
                <NumberFieldGroup />
              </NumberField>
            </Field>
            <Field>
              <FieldLabel>Unidade</FieldLabel>
              <Input
                value={unidade}
                onChange={(e) => setUnidade(e.target.value)}
                placeholder="un, porção…"
              />
            </Field>
          </div>

          <SheetFooter>
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
              variant="gradient"
              size="cta"
              className="flex-1"
              disabled={pending}
            >
              {pending ? "Salvando…" : "Salvar"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
