'use client'

import { useRef, useState, useTransition } from 'react'
import { Plus, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
          <div className="space-y-1">
            <label htmlFor="titulo" className="text-xs font-medium text-foreground">
              Título *
            </label>
            <input
              id="titulo"
              name="titulo"
              required
              maxLength={200}
              placeholder="Descreva a tarefa…"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="descricao" className="text-xs font-medium text-foreground">
              Detalhes
            </label>
            <textarea
              id="descricao"
              name="descricao"
              rows={2}
              maxLength={1000}
              placeholder="Contexto adicional (opcional)…"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="prioridade" className="text-xs font-medium text-foreground">
                Prioridade
              </label>
              <select
                id="prioridade"
                name="prioridade"
                defaultValue="media"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="prazo" className="text-xs font-medium text-foreground">
                Prazo
              </label>
              <input
                id="prazo"
                name="prazo"
                type="date"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {perfis.length > 0 && (
            <div className="space-y-1">
              <label htmlFor="perfil_id" className="text-xs font-medium text-foreground">
                Atribuir a
              </label>
              <select
                id="perfil_id"
                name="perfil_id"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Sem atribuição</option>
                {perfis.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome ?? p.id}
                  </option>
                ))}
              </select>
            </div>
          )}

          {erro && <p className="text-xs text-danger">{erro}</p>}

          <Button type="submit" disabled={pending} className="w-full" size="sm">
            {pending ? 'Criando…' : 'Criar tarefa'}
          </Button>
        </form>
      )}
    </div>
  )
}
