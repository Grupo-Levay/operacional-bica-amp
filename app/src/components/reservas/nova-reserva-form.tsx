'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { criarReserva } from '@/app/actions/reservas'
import type { Tables } from '@/types/database.types'

interface NovaReservaFormProps {
  tables: Tables<'bar_tables'>[]
  defaultDate: string
}

const inputClass =
  'w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary'

export function NovaReservaForm({ tables, defaultDate }: NovaReservaFormProps) {
  const [aberto, setAberto] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [erro, setErro] = useState<string | null>(null)

  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [data, setData] = useState(defaultDate)
  const [inicio, setInicio] = useState('')
  const [fim, setFim] = useState('')
  const [pessoas, setPessoas] = useState('2')
  const [mesa, setMesa] = useState('')
  const [obs, setObs] = useState('')

  function limpar() {
    setNome('')
    setTelefone('')
    setData(defaultDate)
    setInicio('')
    setFim('')
    setPessoas('2')
    setMesa('')
    setObs('')
    setErro(null)
  }

  function fechar() {
    setAberto(false)
    limpar()
  }

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
      try {
        await criarReserva({
          customerName: nome.trim(),
          customerPhone: telefone.trim() || undefined,
          reservationDate: data,
          startTime: inicio,
          endTime: fim,
          guestCount: Number(pessoas) || 1,
          tableId: mesa || null,
          notes: obs.trim() || undefined,
        })
        fechar()
      } catch (err) {
        setErro(err instanceof Error ? err.message : 'Erro ao criar reserva')
      }
    })
  }

  if (!aberto) {
    return (
      <Button
        variant="brand"
        size="cta"
        onClick={() => setAberto(true)}
      >
        Nova reserva
      </Button>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-lg border border-border bg-card p-4"
    >
      <div className="space-y-1">
        <label className="text-b3 text-xs font-medium">
          Nome do cliente
        </label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          autoFocus
          placeholder="Nome"
          className={inputClass}
        />
      </div>

      <div className="space-y-1">
        <label className="text-b3 text-xs font-medium">
          Telefone
        </label>
        <input
          type="tel"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          placeholder="(opcional)"
          className={inputClass}
        />
      </div>

      <div className="space-y-1">
        <label className="text-b3 text-xs font-medium">
          Data
        </label>
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="flex gap-3">
        <div className="flex-1 space-y-1">
          <label className="text-b3 text-xs font-medium">
            Início
          </label>
          <input
            type="time"
            value={inicio}
            onChange={(e) => setInicio(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex-1 space-y-1">
          <label className="text-b3 text-xs font-medium">
            Fim
          </label>
          <input
            type="time"
            value={fim}
            onChange={(e) => setFim(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <div className="w-24 space-y-1">
          <label className="text-b3 text-xs font-medium">
            Pessoas
          </label>
          <input
            type="number"
            min={1}
            value={pessoas}
            onChange={(e) => setPessoas(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex-1 space-y-1">
          <label className="text-b3 text-xs font-medium">
            Mesa
          </label>
          <select
            value={mesa}
            onChange={(e) => setMesa(e.target.value)}
            className={inputClass}
          >
            <option value="">Sem mesa</option>
            {tables.map((t) => (
              <option key={t.id} value={t.id}>
                Mesa {t.number}
                {t.location ? ` - ${t.location}` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-b3 text-xs font-medium">
          Observações
        </label>
        <textarea
          value={obs}
          onChange={(e) => setObs(e.target.value)}
          rows={2}
          placeholder="(opcional)"
          className={inputClass}
        />
      </div>

      {erro && (
        <p className="text-xs text-danger">
          {erro}
        </p>
      )}

      <div className="flex items-center gap-2 pt-1">
        <Button
          type="submit"
          variant="brand"
          size="cta"
          disabled={isPending}
        >
          {isPending ? 'Salvando...' : 'Salvar Reserva'}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={fechar}
          disabled={isPending}
          className="min-h-[52px]"
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}
