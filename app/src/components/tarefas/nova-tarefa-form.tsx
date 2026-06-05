'use client'

import { useRef, useState, useTransition } from 'react'
import { Plus, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { criarTarefa } from '@/app/actions/tarefas'

interface Perfil {
  id: string
  nome: string | null
}

interface Props {
  perfis: Perfil[]
}

export function NovaTarefaForm({ perfis }: Props) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const [erro, setErro] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  // Selects do Base UI são controlados: o `name` emite o hidden input para o
  // FormData, mas o estado precisa ser resetado manualmente (não respondem ao
  // form.reset() nativo como inputs/textarea).
  const [prioridade, setPrioridade] = useState('media')
  const [perfilId, setPerfilId] = useState('')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setErro(null)
    startTransition(async () => {
      const res = await criarTarefa(fd)
      if (res?.error) {
        setErro(res.error)
      } else {
        formRef.current?.reset()
        setPrioridade('media')
        setPerfilId('')
        setOpen(false)
      }
    })
  }

  return (
    <div className="rounded-xl border border-border bg-card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between p-4 text-sm font-medium text-foreground"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <Plus size={16} aria-hidden="true" />
          Nova tarefa
        </span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {open && (
        <form ref={formRef} onSubmit={handleSubmit} className="border-t border-border p-4 space-y-3">
          <Field>
            <FieldLabel htmlFor="titulo" required>
              Título
            </FieldLabel>
            <Input
              id="titulo"
              name="titulo"
              required
              maxLength={200}
              placeholder="Descreva a tarefa…"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="descricao">Detalhes</FieldLabel>
            <Textarea
              id="descricao"
              name="descricao"
              rows={2}
              maxLength={1000}
              placeholder="Contexto adicional (opcional)…"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel>Prioridade</FieldLabel>
              <Select
                name="prioridade"
                value={prioridade}
                onValueChange={(v) => setPrioridade((v as string) ?? 'media')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="prazo">Prazo</FieldLabel>
              <Input id="prazo" name="prazo" type="date" />
            </Field>
          </div>

          {perfis.length > 0 && (
            <Field>
              <FieldLabel>Atribuir a</FieldLabel>
              <Select
                name="perfil_id"
                value={perfilId}
                onValueChange={(v) => setPerfilId((v as string) ?? '')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sem atribuição" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Sem atribuição</SelectItem>
                  {perfis.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.nome ?? p.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}

          {erro && <p className="text-xs text-danger">{erro}</p>}

          <Button type="submit" variant="gradient" size="cta" disabled={pending}>
            {pending ? 'Criando…' : 'Criar tarefa'}
          </Button>
        </form>
      )}
    </div>
  )
}
