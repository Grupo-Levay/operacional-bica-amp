'use client'

import { useState, useTransition, useRef } from 'react'
import { criarReserva } from '@/app/actions/reservas'
import { useToast } from '@/components/ui/toast'
import { getTodayISO } from '@/lib/utils'

export function NovaReservaForm({ casaColor }: { casaColor: string }) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)
  const toast = useToast()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await criarReserva(fd)
      if (result?.error) {
        setError(result.error)
        return
      }
      formRef.current?.reset()
      setOpen(false)
      toast.success('Reserva criada com sucesso!')
    })
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-lg border-2 border-dashed py-3 text-sm font-medium transition-opacity hover:opacity-80"
        style={{ borderColor: 'var(--border)', color: 'var(--color-b4)' }}
      >
        + Nova reserva
      </button>
    )
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="rounded-lg border shadow-sm p-4 space-y-3"
      style={{ backgroundColor: 'var(--color-ink2)', borderColor: 'var(--border)' }}
    >
      <p className="text-sm font-semibold" style={{ color: 'var(--color-b1)' }}>
        Nova reserva
      </p>

      {/* Nome */}
      <div className="space-y-1">
        <label className="text-xs font-medium" style={{ color: 'var(--color-b4)' }}>
          Nome do cliente *
        </label>
        <input
          name="customer_name"
          required
          className="flex h-9 w-full rounded-md border bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-1"
          style={{ borderColor: 'var(--border)', color: 'var(--color-b1)' }}
          placeholder="Ex: João Silva"
        />
      </div>

      {/* Data + Pessoas */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-xs font-medium" style={{ color: 'var(--color-b4)' }}>
            Data *
          </label>
          <input
            name="reservation_date"
            type="date"
            required
            defaultValue={getTodayISO()}
            className="flex h-9 w-full rounded-md border bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-1"
            style={{ borderColor: 'var(--border)', color: 'var(--color-b1)' }}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium" style={{ color: 'var(--color-b4)' }}>
            Pessoas *
          </label>
          <input
            name="guest_count"
            type="number"
            min="1"
            required
            defaultValue="2"
            className="flex h-9 w-full rounded-md border bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-1"
            style={{ borderColor: 'var(--border)', color: 'var(--color-b1)' }}
          />
        </div>
      </div>

      {/* Início + Fim */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-xs font-medium" style={{ color: 'var(--color-b4)' }}>
            Início *
          </label>
          <input
            name="start_time"
            type="time"
            required
            className="flex h-9 w-full rounded-md border bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-1"
            style={{ borderColor: 'var(--border)', color: 'var(--color-b1)' }}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium" style={{ color: 'var(--color-b4)' }}>
            Fim *
          </label>
          <input
            name="end_time"
            type="time"
            required
            className="flex h-9 w-full rounded-md border bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-1"
            style={{ borderColor: 'var(--border)', color: 'var(--color-b1)' }}
          />
        </div>
      </div>

      {/* Telefone */}
      <div className="space-y-1">
        <label className="text-xs font-medium" style={{ color: 'var(--color-b4)' }}>
          Telefone
        </label>
        <input
          name="customer_phone"
          type="tel"
          className="flex h-9 w-full rounded-md border bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-1"
          style={{ borderColor: 'var(--border)', color: 'var(--color-b1)' }}
          placeholder="(11) 99999-9999"
        />
      </div>

      {/* Observações */}
      <div className="space-y-1">
        <label className="text-xs font-medium" style={{ color: 'var(--color-b4)' }}>
          Observações
        </label>
        <textarea
          name="notes"
          rows={2}
          className="flex w-full rounded-md border bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 resize-none"
          style={{ borderColor: 'var(--border)', color: 'var(--color-b1)' }}
          placeholder="Aniversário, pedido especial…"
        />
      </div>

      {error && (
        <p className="text-xs" style={{ color: '#ef4444' }}>
          {error}
        </p>
      )}

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={() => { setOpen(false); setError(null) }}
          className="flex-1 py-2 rounded-md border text-sm hover:opacity-80 transition-opacity"
          style={{ borderColor: 'var(--border)', color: 'var(--color-b3)' }}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 py-2 rounded-md text-sm font-semibold text-white disabled:opacity-60"
          style={{ backgroundColor: casaColor }}
        >
          {isPending ? 'Salvando…' : 'Salvar'}
        </button>
      </div>
    </form>
  )
}
