'use client'

import { useState, useTransition } from 'react'
import { Users, User, Archive } from 'lucide-react'
import { atualizarProgresso, arquivarMeta } from '@/app/actions/metas'
import { MetaProgressBar } from '@/components/metas/progress-bar'
import { Badge } from '@/components/ui/badge'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'

interface Meta {
  id: string
  titulo: string
  descricao: string | null
  escopo: string
  alvo: number
  atual: number
  unidade: string
  periodo: string
  periodo_ref: string
  atribuido?: { nome: string | null } | null
}

const PERIODO_LABEL: Record<string, string> = {
  semanal: 'Sem.',
  mensal: 'Mensal',
  trimestral: 'Trim.',
}

function MetaCard({ meta, isAdmin }: { meta: Meta; isAdmin: boolean }) {
  const [editing, setEditing] = useState(false)
  const [valor, setValor] = useState(String(meta.atual))
  const [pending, startTransition] = useTransition()

  function salvarProgresso() {
    const n = parseFloat(valor)
    if (isNaN(n) || n < 0) return
    startTransition(async () => {
      await atualizarProgresso(meta.id, n)
      setEditing(false)
    })
  }

  return (
    <div className={`rounded-lg border border-border bg-card p-3 space-y-2 text-sm transition-opacity ${pending ? 'opacity-50' : ''}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-medium text-foreground leading-tight truncate">{meta.titulo}</p>
          {meta.atribuido?.nome && (
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
              <User size={10} aria-hidden="true" />
              {meta.atribuido.nome}
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Badge variant="secondary" className="text-[10px]">
            {PERIODO_LABEL[meta.periodo] ?? meta.periodo} {meta.periodo_ref}
          </Badge>
          {meta.escopo === 'equipe' && (
            <Badge variant="outline" className="text-[10px] gap-1">
              <Users size={9} aria-hidden="true" />
              equipe
            </Badge>
          )}
        </div>
      </div>

      <MetaProgressBar atual={meta.atual} alvo={meta.alvo} unidade={meta.unidade} />

      {meta.descricao && (
        <p className="text-xs text-muted-foreground line-clamp-2">{meta.descricao}</p>
      )}

      <div className="flex items-center gap-2 pt-0.5">
        {editing ? (
          <>
            <input
              type="number"
              min="0"
              step="any"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className="w-24 rounded border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              autoFocus
            />
            <button
              type="button"
              onClick={salvarProgresso}
              disabled={pending}
              className="rounded px-2 py-1 text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={() => { setEditing(false); setValor(String(meta.atual)) }}
              className="rounded px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
            >
              Cancelar
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            disabled={pending}
            className="rounded px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
          >
            Atualizar progresso
          </button>
        )}

        {isAdmin && (
          <span className="flex-1 flex justify-end">
            <ConfirmDialog
              trigger={
                <button
                  type="button"
                  disabled={pending}
                  aria-label="Arquivar meta"
                  className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30"
                >
                  <Archive size={13} aria-hidden="true" />
                </button>
              }
              title="Arquivar meta?"
              description={`"${meta.titulo}" será arquivada e não aparecerá mais no painel.`}
              confirmLabel="Arquivar"
              onConfirm={async () => { await arquivarMeta(meta.id) }}
            />
          </span>
        )}
      </div>
    </div>
  )
}

export function MetasList({ metas, isAdmin = false }: { metas: Meta[]; isAdmin?: boolean }) {
  const individuais = metas.filter((m) => m.escopo === 'individual')
  const equipe = metas.filter((m) => m.escopo === 'equipe')

  if (metas.length === 0) {
    return (
      <p className="rounded-lg bg-muted p-4 text-center text-xs text-muted-foreground">
        Nenhuma meta ativa no momento.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {equipe.length > 0 && (
        <div className="space-y-2">
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <Users size={14} className="text-primary" aria-hidden="true" />
            Metas da equipe
          </h3>
          {equipe.map((m) => <MetaCard key={m.id} meta={m} isAdmin={isAdmin} />)}
        </div>
      )}

      {individuais.length > 0 && (
        <div className="space-y-2">
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <User size={14} className="text-primary" aria-hidden="true" />
            Metas individuais
          </h3>
          {individuais.map((m) => <MetaCard key={m.id} meta={m} isAdmin={isAdmin} />)}
        </div>
      )}
    </div>
  )
}
