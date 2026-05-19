'use client'

import { useState, useTransition } from 'react'
import { updateReservaStatus, type ReservaStatus } from '@/app/actions/reservas'

type Reserva = {
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

const STATUS_COLOR: Record<ReservaStatus, string> = {
  pendente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmada: 'bg-green-100 text-green-800 border-green-200',
  cancelada: 'bg-red-100 text-red-800 border-red-200',
  concluida: 'bg-muted text-muted-foreground border-border',
}

function formatTime(t: string) {
  return t.slice(0, 5)
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  })
}

export function ReservaCard({ reserva, casaColor }: { reserva: Reserva; casaColor: string }) {
  const [status, setStatus] = useState<ReservaStatus>(reserva.status)
  const [isPending, startTransition] = useTransition()
  const [confirmAction, setConfirmAction] = useState<ReservaStatus | null>(null)

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
      await updateReservaStatus(reserva.id, next)
    })
  }

  const isActive = status !== 'cancelada' && status !== 'concluida'

  return (
    <div className="rounded-lg border shadow-sm bg-card overflow-hidden">
      <div className="px-4 py-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-sm leading-tight truncate">{reserva.customer_name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {formatDate(reserva.reservation_date)} · {formatTime(reserva.start_time)}–{formatTime(reserva.end_time)}
          </p>
          <p className="text-xs text-muted-foreground">
            {reserva.guest_count} pessoa{reserva.guest_count !== 1 ? 's' : ''}
            {reserva.customer_phone && ` · ${reserva.customer_phone}`}
          </p>
          {reserva.notes && (
            <p className="text-xs text-muted-foreground mt-1 italic truncate">{reserva.notes}</p>
          )}
        </div>
        <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLOR[status]}`}>
          {STATUS_LABEL[status]}
        </span>
      </div>

      {isActive && (
        <div className="border-t px-4 py-2 flex items-center gap-2">
          {confirmAction ? (
            <>
              <span className="text-xs text-muted-foreground flex-1">
                {confirmAction === 'cancelada' ? 'Cancelar reserva?' : 'Marcar como concluída?'}
              </span>
              <button
                onClick={() => setConfirmAction(null)}
                className="text-xs px-2 py-1 rounded border hover:bg-muted"
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
                  className="text-xs px-3 py-1 rounded text-white disabled:opacity-60"
                  style={{ backgroundColor: casaColor }}
                >
                  Confirmar
                </button>
              )}
              <button
                onClick={() => handleStatus('concluida')}
                disabled={isPending}
                className="text-xs px-3 py-1 rounded border hover:bg-muted disabled:opacity-60"
              >
                Concluída
              </button>
              <button
                onClick={() => handleStatus('cancelada')}
                disabled={isPending}
                className="text-xs px-3 py-1 rounded border text-destructive hover:bg-destructive/10 disabled:opacity-60 ml-auto"
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
