'use client'

import { useTransition } from 'react'
import { ChevronRight, ChevronLeft, Trash2, Calendar, User } from 'lucide-react'
import { moverTarefa, excluirTarefa, atribuirTarefa, type TarefaStatus } from '@/app/actions/tarefas'
import { Badge } from '@/components/ui/badge'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'

interface Perfil {
  id: string
  nome: string | null
}

interface Tarefa {
  id: string
  titulo: string
  descricao: string | null
  status: string
  prioridade: string
  prazo: string | null
  perfil_id: string | null
  atribuido?: { nome: string | null } | null
}

interface Props {
  tarefas: Tarefa[]
  perfis: Perfil[]
}

const COLUNAS: { key: TarefaStatus; label: string }[] = [
  { key: 'a_fazer', label: 'A fazer' },
  { key: 'fazendo', label: 'Fazendo' },
  { key: 'concluida', label: 'Concluída' },
]

const PRIORIDADE_VARIANT: Record<string, 'destructive' | 'warning' | 'secondary'> = {
  alta: 'destructive',
  media: 'warning',
  baixa: 'secondary',
}

function formatPrazo(iso: string) {
  const [ano, mes, dia] = iso.split('-').map(Number)
  return new Date(ano, mes - 1, dia).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

function KanbanCard({
  tarefa,
  perfis,
}: {
  tarefa: Tarefa
  perfis: Perfil[]
}) {
  const [pending, startTransition] = useTransition()

  const status = tarefa.status as TarefaStatus
  const colIdx = COLUNAS.findIndex((c) => c.key === status)

  function mover(dir: -1 | 1) {
    const alvo = COLUNAS[colIdx + dir]
    if (!alvo) return
    startTransition(async () => { await moverTarefa(tarefa.id, alvo.key) })
  }

  function handleAtribuir(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value || null
    startTransition(async () => { await atribuirTarefa(tarefa.id, val) })
  }

  function handleDelete() {
    startTransition(async () => { await excluirTarefa(tarefa.id) })
  }

  return (
    <div
      className={`rounded-lg border bg-card p-3 space-y-2 text-sm transition-opacity ${pending ? 'opacity-50' : ''}`}
      style={{ borderColor: 'var(--border)' }}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium text-foreground leading-tight">{tarefa.titulo}</p>
        <Badge variant={PRIORIDADE_VARIANT[tarefa.prioridade] ?? 'secondary'} className="shrink-0 text-[10px]">
          {tarefa.prioridade}
        </Badge>
      </div>

      {tarefa.descricao && (
        <p className="text-xs text-muted-foreground line-clamp-2">{tarefa.descricao}</p>
      )}

      <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        {tarefa.prazo && (
          <span className="flex items-center gap-1">
            <Calendar size={11} aria-hidden="true" />
            {formatPrazo(tarefa.prazo)}
          </span>
        )}
        {tarefa.atribuido?.nome && (
          <span className="flex items-center gap-1">
            <User size={11} aria-hidden="true" />
            {tarefa.atribuido.nome}
          </span>
        )}
      </div>

      {perfis.length > 0 && (
        <select
          value={tarefa.perfil_id ?? ''}
          onChange={handleAtribuir}
          disabled={pending}
          aria-label="Atribuir membro"
          className="w-full rounded border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">Sem atribuição</option>
          {perfis.map((p) => (
            <option key={p.id} value={p.id}>{p.nome ?? p.id}</option>
          ))}
        </select>
      )}

      <div className="flex items-center gap-1 pt-0.5">
        <button
          type="button"
          onClick={() => mover(-1)}
          disabled={pending || colIdx === 0}
          aria-label="Mover para coluna anterior"
          className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30"
        >
          <ChevronLeft size={14} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => mover(1)}
          disabled={pending || colIdx === COLUNAS.length - 1}
          aria-label="Mover para próxima coluna"
          className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30"
        >
          <ChevronRight size={14} aria-hidden="true" />
        </button>
        <span className="flex-1" />
        <ConfirmDialog
          trigger={
            <button
              type="button"
              disabled={pending}
              aria-label="Excluir tarefa"
              className="rounded p-1 text-muted-foreground hover:bg-danger/10 hover:text-danger disabled:opacity-30"
            >
              <Trash2 size={14} aria-hidden="true" />
            </button>
          }
          title="Excluir tarefa?"
          description={`"${tarefa.titulo}" será removida permanentemente.`}
          confirmLabel="Excluir"
          destructive
          onConfirm={handleDelete}
        />
      </div>
    </div>
  )
}

export function KanbanBoard({ tarefas, perfis }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {COLUNAS.map((col) => {
        const items = tarefas.filter((t) => t.status === col.key)
        return (
          <div key={col.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">{col.label}</h3>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {items.length}
              </span>
            </div>
            <div className="space-y-2 min-h-[80px]">
              {items.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                  Nenhuma tarefa
                </div>
              ) : (
                items.map((t) => (
                  <KanbanCard key={t.id} tarefa={t} perfis={perfis} />
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
