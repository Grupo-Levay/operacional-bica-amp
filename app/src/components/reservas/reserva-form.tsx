'use client'

import { useMemo, useState, useTransition } from 'react'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { NumberField, NumberFieldGroup } from '@/components/ui/number-field'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/toast'
import { criarReserva, editarReserva } from '@/app/actions/reservas'
import {
  mesasOcupadas,
  sugerirMesa,
  type ReservaSlot,
} from '@/lib/reservas-availability'
import type { Tables } from '@/types/database.types'

type Mesa = Tables<'bar_tables'>
type Reserva = Tables<'reservations'>

interface ReservaFormProps {
  tables: Mesa[]
  /** Reservas do dia, para cálculo de disponibilidade de mesa. */
  reservasDoDia: ReservaSlot[]
  defaultDate: string
  /** Reserva existente → modo edição. Ausente → modo criação. */
  reserva?: Reserva
  onCancel: () => void
  onSuccess: () => void
}

export function ReservaForm({
  tables,
  reservasDoDia,
  defaultDate,
  reserva,
  onCancel,
  onSuccess,
}: ReservaFormProps) {
  const editando = Boolean(reserva)
  const [isPending, startTransition] = useTransition()
  const [erro, setErro] = useState<string | null>(null)

  const [nome, setNome] = useState(reserva?.customer_name ?? '')
  const [telefone, setTelefone] = useState(reserva?.customer_phone ?? '')
  const [data, setData] = useState(reserva?.reservation_date ?? defaultDate)
  const [inicio, setInicio] = useState(reserva?.start_time?.slice(0, 5) ?? '')
  const [fim, setFim] = useState(reserva?.end_time?.slice(0, 5) ?? '')
  // NumberField trabalha com `number | null`.
  const [pessoas, setPessoas] = useState<number | null>(reserva?.guest_count ?? 2)
  const [mesa, setMesa] = useState(reserva?.table_id ?? '')
  const [obs, setObs] = useState(reserva?.notes ?? '')

  const pessoasNum = pessoas ?? 1

  // Ids de mesas ocupadas no período escolhido (exclui a própria reserva ao editar).
  const ocupadas = useMemo(
    () => mesasOcupadas(reservasDoDia, inicio, fim, reserva?.id),
    [reservasDoDia, inicio, fim, reserva?.id],
  )

  // Best-fit: menor mesa livre que comporta o nº de pessoas.
  const sugestaoId = useMemo(() => {
    if (!inicio || !fim || fim <= inicio) return null
    return sugerirMesa(
      tables.map((t) => ({ id: t.id, capacity: t.capacity })),
      ocupadas,
      pessoasNum,
    )
  }, [tables, ocupadas, pessoasNum, inicio, fim])

  const mesaSugerida = sugestaoId ? tables.find((t) => t.id === sugestaoId) : null
  const mostrarSugestao = mesaSugerida && mesaSugerida.id !== mesa

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)

    if (!nome.trim()) {
      setErro('Informe o nome do cliente')
      return
    }
    if (!data || !inicio || !fim) {
      setErro('Informe data e horários')
      return
    }
    if (fim <= inicio) {
      setErro('Horário de fim deve ser maior que o de início')
      return
    }

    startTransition(async () => {
      const payload = {
        customerName: nome.trim(),
        customerPhone: telefone.trim() || undefined,
        reservationDate: data,
        startTime: inicio,
        endTime: fim,
        guestCount: pessoasNum,
        tableId: mesa || null,
        notes: obs.trim() || undefined,
      }
      try {
        if (editando && reserva) {
          await editarReserva({ ...payload, id: reserva.id })
          toast.success('Reserva atualizada', nome.trim())
        } else {
          await criarReserva(payload)
          toast.success('Reserva criada', nome.trim())
        }
        onSuccess()
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Erro ao salvar reserva'
        setErro(msg)
        toast.error('Não foi possível salvar a reserva', msg)
      }
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-xl bg-card bg-gradient-surface p-4 shadow-md shadow-inner-hairline ring-1 ring-foreground/10"
    >
      <Field>
        <FieldLabel required>Nome do cliente</FieldLabel>
        <Input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          autoFocus
          placeholder="Nome"
        />
      </Field>

      <Field>
        <FieldLabel>Telefone</FieldLabel>
        <Input
          type="tel"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          placeholder="(opcional)"
        />
      </Field>

      <Field>
        <FieldLabel required>Data</FieldLabel>
        <Input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
      </Field>

      <div className="flex gap-3">
        <Field className="flex-1">
          <FieldLabel required>Início</FieldLabel>
          <Input
            type="time"
            value={inicio}
            onChange={(e) => setInicio(e.target.value)}
          />
        </Field>
        <Field className="flex-1">
          <FieldLabel required>Fim</FieldLabel>
          <Input
            type="time"
            value={fim}
            onChange={(e) => setFim(e.target.value)}
          />
        </Field>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Field className="w-full sm:w-fit">
          <FieldLabel>Pessoas</FieldLabel>
          <NumberField value={pessoas} onValueChange={setPessoas} min={1} step={1}>
            <NumberFieldGroup />
          </NumberField>
        </Field>
        <Field className="flex-1">
          <FieldLabel>Mesa</FieldLabel>
          <Select
            value={mesa}
            onValueChange={(v) => setMesa((v as string) ?? '')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sem mesa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Sem mesa</SelectItem>
              {tables.map((t) => {
                const ocupada = ocupadas.has(t.id)
                return (
                  <SelectItem key={t.id} value={t.id} disabled={ocupada}>
                    Mesa {t.number}
                    {t.location ? ` · ${t.location}` : ''} · {t.capacity} lug.
                    {ocupada ? ' — ocupada' : ''}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </Field>
      </div>

      {mostrarSugestao && (
        <button
          type="button"
          onClick={() => setMesa(mesaSugerida.id)}
          className="flex w-full items-center gap-1.5 rounded-md bg-primary/10 px-3 py-2 text-xs font-medium text-primary ring-1 ring-primary/20 transition-[background-color,box-shadow] ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-primary/15 [@media(hover:hover)]:hover:shadow-glow-brand-sm"
        >
          <Sparkles size={14} aria-hidden="true" />
          Sugestão: Mesa {mesaSugerida.number} ({mesaSugerida.capacity} lug.) — melhor
          encaixe para {pessoasNum} {pessoasNum === 1 ? 'pessoa' : 'pessoas'}
        </button>
      )}

      <Field>
        <FieldLabel>Observações</FieldLabel>
        <Textarea
          value={obs}
          onChange={(e) => setObs(e.target.value)}
          rows={2}
          placeholder="(opcional)"
        />
      </Field>

      {erro && <p className="text-xs text-danger">{erro}</p>}

      <div className="flex flex-col gap-2 pt-1">
        <Button type="submit" variant="gradient" size="cta" disabled={isPending}>
          {isPending
            ? 'Salvando...'
            : editando
              ? 'Salvar alterações'
              : 'Salvar Reserva'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isPending}
          className="min-h-[44px] w-full"
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}
