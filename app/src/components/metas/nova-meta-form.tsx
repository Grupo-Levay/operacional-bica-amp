'use client'

import { useRef, useState, useTransition } from 'react'
import { Plus, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { criarMeta } from '@/app/actions/metas'

interface Perfil {
  id: string
  nome: string | null
}

interface Props {
  perfis: Perfil[]
  periodoRefDefault: string
}

export function NovaMetaForm({ perfis, periodoRefDefault }: Props) {
  const [open, setOpen] = useState(false)
  const [escopo, setEscopo] = useState<'individual' | 'equipe'>('individual')
  const [pending, startTransition] = useTransition()
  const [erro, setErro] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setErro(null)
    startTransition(async () => {
      const res = await criarMeta(fd)
      if (res?.error) {
        setErro(res.error)
      } else {
        formRef.current?.reset()
        setEscopo('individual')
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
          Nova meta
        </span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {open && (
        <form ref={formRef} onSubmit={handleSubmit} className="border-t border-border p-4 space-y-3">
          <div className="space-y-1">
            <label htmlFor="titulo-meta" className="text-xs font-medium text-foreground">Título *</label>
            <input
              id="titulo-meta"
              name="titulo"
              required
              maxLength={200}
              placeholder="Ex: Vendas do mês…"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="escopo" className="text-xs font-medium text-foreground">Escopo</label>
              <select
                id="escopo"
                name="escopo"
                value={escopo}
                onChange={(e) => setEscopo(e.target.value as 'individual' | 'equipe')}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="individual">Individual</option>
                <option value="equipe">Equipe</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="periodo" className="text-xs font-medium text-foreground">Período</label>
              <select
                id="periodo"
                name="periodo"
                defaultValue="mensal"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="semanal">Semanal</option>
                <option value="mensal">Mensal</option>
                <option value="trimestral">Trimestral</option>
              </select>
            </div>
          </div>

          {escopo === 'individual' && (
            <div className="space-y-1">
              <label htmlFor="perfil_id-meta" className="text-xs font-medium text-foreground">Membro *</label>
              <select
                id="perfil_id-meta"
                name="perfil_id"
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Selecione…</option>
                {perfis.map((p) => (
                  <option key={p.id} value={p.id}>{p.nome ?? p.id}</option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-1">
              <label htmlFor="alvo" className="text-xs font-medium text-foreground">Alvo *</label>
              <input
                id="alvo"
                name="alvo"
                type="number"
                min="0.01"
                step="any"
                required
                placeholder="100"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="unidade" className="text-xs font-medium text-foreground">Unidade</label>
              <input
                id="unidade"
                name="unidade"
                maxLength={10}
                defaultValue="un"
                placeholder="un"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="periodo_ref" className="text-xs font-medium text-foreground">Referência do período</label>
            <input
              id="periodo_ref"
              name="periodo_ref"
              defaultValue={periodoRefDefault}
              maxLength={20}
              placeholder="2026-06"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-[10px] text-muted-foreground">Mensal: 2026-06 · Semanal: 2026-W22 · Trimestral: 2026-Q2</p>
          </div>

          {erro && <p className="text-xs text-danger">{erro}</p>}

          <Button type="submit" disabled={pending} className="w-full" size="sm">
            {pending ? 'Criando…' : 'Criar meta'}
          </Button>
        </form>
      )}
    </div>
  )
}
