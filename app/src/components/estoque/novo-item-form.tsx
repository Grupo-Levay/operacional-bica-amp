'use client'

import * as React from 'react'
import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { NumberField, NumberFieldGroup } from '@/components/ui/number-field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/components/ui/toast'
import { criarItemEstoque } from '@/app/actions/estoque'
import type { Database } from '@/types/database.types'

type Categoria = Database['public']['Tables']['estoque_categorias']['Row']

interface NovoItemFormProps {
  categorias: Categoria[]
  trigger: React.ReactElement
}

export function NovoItemForm({ categorias, trigger }: NovoItemFormProps) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  const [nome, setNome] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const [minimo, setMinimo] = useState<number | null>(null)
  const [unidade, setUnidade] = useState('')
  const [atual, setAtual] = useState<number | null>(null)

  function reset() {
    setNome('')
    setCategoriaId('')
    setMinimo(null)
    setUnidade('')
    setAtual(null)
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
          minimo,
          unidade,
          atual,
        })
        toast.success('Item criado', nome.trim())
        reset()
        setOpen(false)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Não foi possível criar o item')
      }
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        // Bloqueia fechar durante o envio.
        if (pending) return
        setOpen(next)
      }}
    >
      <DialogTrigger render={trigger} />

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo item</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Field>
            <FieldLabel required>Nome</FieldLabel>
            <Input
              autoFocus
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex.: Gin Tanqueray"
            />
          </Field>

          {categorias.length > 0 && (
            <Field>
              <FieldLabel>Categoria</FieldLabel>
              <Select
                value={categoriaId}
                onValueChange={(v) => setCategoriaId((v as string) ?? '')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sem categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Sem categoria</SelectItem>
                  {categorias.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.emoji ? `${c.emoji} ` : ''}
                      {c.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}

          <div className="flex flex-wrap gap-3">
            <Field className="flex-1">
              <FieldLabel>Quantidade inicial</FieldLabel>
              <NumberField value={atual} onValueChange={setAtual} min={0} step={0.5}>
                <NumberFieldGroup />
              </NumberField>
            </Field>
            <Field className="flex-1">
              <FieldLabel>Mínimo</FieldLabel>
              <NumberField value={minimo} onValueChange={setMinimo} min={0} step={0.5}>
                <NumberFieldGroup />
              </NumberField>
            </Field>
            <Field className="w-24">
              <FieldLabel>Unidade</FieldLabel>
              <Input
                value={unidade}
                onChange={(e) => setUnidade(e.target.value)}
                placeholder="un, kg, L"
              />
            </Field>
          </div>

          <Button type="submit" variant="gradient" size="cta" disabled={pending} className="mt-1">
            {pending ? 'Criando…' : 'Criar item'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
