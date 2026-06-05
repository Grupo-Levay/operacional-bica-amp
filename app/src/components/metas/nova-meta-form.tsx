'use client'

import { useState, useTransition } from 'react'
import { Plus, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel, FieldDescription } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  // Selects do Base UI não respondem a form.reset(); mantemos controlados e
  // resetamos manualmente no sucesso. O `name` em Select.Root emite o hidden
  // input que alimenta o FormData lido pela server action.
  const [escopo, setEscopo] = useState<'individual' | 'equipe'>('individual')
  const [periodo, setPeriodo] = useState('mensal')
  const [perfilId, setPerfilId] = useState('')
  const [pending, startTransition] = useTransition()
  const [erro, setErro] = useState<string | null>(null)

  function resetCampos() {
    setEscopo('individual')
    setPeriodo('mensal')
    setPerfilId('')
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    setErro(null)
    startTransition(async () => {
      const res = await criarMeta(fd)
      if (res?.error) {
        setErro(res.error)
      } else {
        form.reset()
        resetCampos()
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
        <form onSubmit={handleSubmit} className="border-t border-border p-4 space-y-3">
          <Field>
            <FieldLabel htmlFor="titulo-meta" required>
              Título
            </FieldLabel>
            <Input
              id="titulo-meta"
              name="titulo"
              required
              maxLength={200}
              placeholder="Ex: Vendas do mês…"
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field>
              <FieldLabel>Escopo</FieldLabel>
              <Select
                name="escopo"
                value={escopo}
                onValueChange={(v) => setEscopo(v as 'individual' | 'equipe')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="equipe">Equipe</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>Período</FieldLabel>
              <Select name="periodo" value={periodo} onValueChange={(v) => setPeriodo(v as string)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semanal">Semanal</SelectItem>
                  <SelectItem value="mensal">Mensal</SelectItem>
                  <SelectItem value="trimestral">Trimestral</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>

          {escopo === 'individual' && (
            <Field>
              <FieldLabel required>Membro</FieldLabel>
              <Select
                name="perfil_id"
                required
                value={perfilId}
                onValueChange={(v) => setPerfilId((v as string) ?? '')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione…" />
                </SelectTrigger>
                <SelectContent>
                  {perfis.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.nome ?? p.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Field className="sm:col-span-2">
              <FieldLabel htmlFor="alvo" required>
                Alvo
              </FieldLabel>
              <Input
                id="alvo"
                name="alvo"
                type="number"
                min="0.01"
                step="any"
                required
                placeholder="100"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="unidade">Unidade</FieldLabel>
              <Input
                id="unidade"
                name="unidade"
                maxLength={10}
                defaultValue="un"
                placeholder="un"
              />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="periodo_ref">Referência do período</FieldLabel>
            <Input
              id="periodo_ref"
              name="periodo_ref"
              defaultValue={periodoRefDefault}
              maxLength={20}
              placeholder="2026-06"
            />
            <FieldDescription className="text-[10px]">
              Mensal: 2026-06 · Semanal: 2026-W22 · Trimestral: 2026-Q2
            </FieldDescription>
          </Field>

          {erro && <p className="text-xs text-danger">{erro}</p>}

          <Button type="submit" variant="gradient" size="cta" disabled={pending}>
            {pending ? 'Criando…' : 'Criar meta'}
          </Button>
        </form>
      )}
    </div>
  )
}
