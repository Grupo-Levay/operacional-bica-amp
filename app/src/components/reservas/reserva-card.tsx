'use client'

import { useState, useTransition } from 'react'
import { updateReservaStatus, type ReservaStatus } from '@/app/actions/reservas'
import { useToast } from '@/components/ui/toast'

export type Reserva = {
  id: string
  customer_name: string
  customer_phone: string | null
  reservation_date: string
  start_time: string
  end_time: string
  guest_count: number
  status: ReservaStatus
  notes: string | null
  created_by_name: string | null
}

const STATUS_LABEL: Record<ReservaStatus, string> = {
  pendente: 'Pendente',
  confirmada: 'Confirmada',
  cancelada: 'Cancelada',
  concluida: 'Concluída',
}

const STATUS_CLASS: Record<ReservaStatus, string> = {
  pendente:   'bg-amber-950/60 text-amber-200 border-amber-800/50',
  confirmada: 'bg-green-950/60 text-green-200 border-green-800/50',
  cancelada:  'bg-zinc-800/60  text-zinc-400  border-zinc-700/50',
  concluida:  'bg-amber-950/40 text-amber-300/70 border-amber-800/30',
}

function fmtTime(t: string) {
  return t.slice(0, 5)
}

function fmtDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  })
}

export function ReservaCard({
  reserva,
  casaColor,
}: {
  reserva: Reserva
  casaColor: string
}) {
  const [status, setStatus] = useState<ReservaStatus>(reserva.status)
  const [isPending, startTransition] = useTransition()
  const [confirmAction, setConfirmAction] = useState<ReservaStatus | null>(null)
  const toast = useToast()

  function handleStatus(next: ReservaStatus) {
    if (next === 'cancelada' || next === 'concluida') {
      setConfirmAction(next)
      return
    }
    apply(next)
  }

  function apply(next: ReservaStatus) {
    setStatus(next)
    setConfirmAction(null)
    startTransition(async () => {
      const result = await updateReservaStatus(reserva.id, next)
      if (result?.error) {
        toast.error(result.error)
        setStatus(reserva.status)
      } else {
        toast.success(`Reserva ${STATUS_LABEL[next].toLowerCase()}`)
      }
    })
  }

  const isActive = status !== 'cancelada' && status !== 'concluida'

  return (
    <div
      className="rounded-lg border shadow-sm overflow-hidden"
      style={{ backgroundColor: 'var(--color-ink2)', borderColor: 'var(--border)' }}
    >
      {/* Main info */}
      <div className="px-4 py-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-sm leading-tight truncate" style={{ color: 'var(--color-b1)' }}>
            {reserva.customer_name}
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-b4)' }}>
            {fmtDate(reserva.reservation_date)} · {fmtTime(reserva.start_time)}–{fmtTime(reserva.end_time)}
          </p>
          <p className="text-xs" style={{ color: 'var(--color-b4)' }}>
            {reserva.guest_count} pessoa{reserva.guest_count !== 1 ? 's' : ''}
            {reserva.customer_phone && ` · ${reserva.customer_phone}`}
          </p>
          {reserva.notes && (
            <p className="text-xs mt-1 italic truncate" style={{ color: 'var(--color-b4)', opacity: 0.7 }}>
              {reserva.notes}
            </p>
          )}
        </div>
        <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_CLASS[status]}`}>
          {STATUS_LABEL[status]}
        </span>
      </div>

      {/* Action bar */}
      {isActive && (
        <div className="border-t px-4 py-2 flex items-center gap-2" style={{ borderColor: 'var(--border)' }}>
          {confirmAction ? (
            <>
              <span className="text-xs flex-1" style={{ color: 'var(--color-b4)' }}>
                {confirmAction === 'cancelada' ? 'Cancelar reserva?' : 'Marcar como concluída?'}
              </span>
              <button
                onClick={() => setConfirmAction(null)}
                className="text-xs px-2 py-1 rounded border hover:opacity-80 transition-opacity"
                style={{ borderColor: 'var(--border)', color: 'var(--color-b3)' }}
              >
                Não
              </button>
              <button
                onClick={() => apply(confirmAction)}
                disabled={isPending}
                className="text-xs px-2 py-1 rounded text-white disabled:opacity-60"
                style={{ backgroundColor: confirmAction === 'cancelada' ? '#dc2626' : casaColor }}
              >
                Sim
              </button>
            </>
          ) : (
            <>
              {status === 'pendente' && (
                <button
                  onClick={() => handleStatus('confirmada')}
                  disabled={isPending}
                  className="text-xs px-3 py-1 rounded text-white disabled:opacity-60 font-medium"
                  style={{ backgroundColor: casaColor }}
                >
                  Confirmar
                </button>
              )}
              <button
                onClick={() => handleStatus('concluida')}
                disabled={isPending}
                className="text-xs px-3 py-1 rounded border disabled:opacity-60 hover:opacity-80 transition-opacity"
                style={{ borderColor: 'var(--border)', color: 'var(--color-b3)' }}
              >
                Concluída
              </button>
              <button
                onClick={() => handleStatus('cancelada')}
                disabled={isPending}
                className="text-xs px-3 py-1 rounded border disabled:opacity-60 ml-auto"
                style={{ borderColor: '#dc2626', color: '#ef4444' }}
              >
                Cancelar
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
