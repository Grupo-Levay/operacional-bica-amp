'use client'

import { useTransition } from 'react'
import { ListChecks, Calendar, ChevronRight } from 'lucide-react'
import { moverTarefa, type TarefaStatus } from '@/app/actions/tarefas'
import { Badge } from '@/components/ui/badge'

interface Tarefa {
  id: string
  titulo: string
  descricao: string | null
  status: string
  prioridade: string
  prazo: string | null
}

const PRIORIDADE_VARIANT: Record<string, 'destructive' | 'warning' | 'secondary'> = {
  alta: 'destructive',
  media: 'warning',
  baixa: 'secondary',
}

const STATUS_NEXT: Record<string, TarefaStatus | null> = {
  a_fazer: 'fazendo',
  fazendo: 'concluida',
  concluida: null,
}

const STATUS_LABEL: Record<string, string> = {
  a_fazer: 'A fazer',
  fazendo: 'Fazendo',
  concluida: 'Concluída',
}

function formatPrazo(iso: string) {
  const [ano, mes, dia] = iso.split('-').map(Number)
  return new Date(ano, mes - 1, dia).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

function TarefaItem({ tarefa }: { tarefa: Tarefa }) {
  const [pending, startTransition] = useTransition()
  const proximo = STATUS_NEXT[tarefa.status]

  function avancar() {
    if (!proximo) return
    startTransition(async () => { await moverTarefa(tarefa.id, proximo) })
  }

  return (
    <li className={`flex items-start gap-3 p-3 transition-opacity ${pending ? 'opacity-50' : ''}`}>
      <button
        type="button"
        onClick={avancar}
        disabled={!proximo || pending}
        aria-label={proximo ? `Mover para ${STATUS_LABEL[proximo]}` : 'Tarefa concluída'}
        className="mt-0.5 size-4 shrink-0 rounded border border-border bg-background hover:border-primary hover:bg-primary/10 disabled:cursor-default disabled:opacity-50 transition-colors"
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground leading-tight">{tarefa.titulo}</p>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <Badge variant={PRIORIDADE_VARIANT[tarefa.prioridade] ?? 'secondary'} className="text-[10px]">
            {tarefa.prioridade}
          </Badge>
          <Badge variant="secondary" className="text-[10px]">
            {STATUS_LABEL[tarefa.status] ?? tarefa.status}
          </Badge>
          {tarefa.prazo && (
            <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
              <Calendar size={10} aria-hidden="true" />
              {formatPrazo(tarefa.prazo)}
            </span>
          )}
        </div>
      </div>
      {proximo && (
        <ChevronRight size={14} className="mt-1 shrink-0 text-muted-foreground" aria-hidden="true" />
      )}
    </li>
  )
}

export function MinhasTarefas({ tarefas }: { tarefas: Tarefa[] }) {
  return (
    <section className="space-y-2">
      <h3 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
        <ListChecks size={15} className="text-primary" aria-hidden="true" />
        Minhas tarefas
      </h3>

      {tarefas.length === 0 ? (
        <p className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
          Nenhuma tarefa atribuída a você no momento.
        </p>
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {tarefas.map((t) => (
            <TarefaItem key={t.id} tarefa={t} />
          ))}
        </ul>
      )}
    </section>
  )
}
