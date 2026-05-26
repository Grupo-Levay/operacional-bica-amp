'use client'

import { useState, useTransition } from 'react'
import { Users, Phone, MapPin, StickyNote, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { atualizarStatusReserva } from '@/app/actions/reservas'
import { cn } from '@/lib/utils'
import type { Tables, Enums } from '@/types/database.types'

interface ReservaCardProps {
  reserva: Tables<'reservations'>
  mesa?: { number: string; location: string | null } | null
}

type Status = Enums<'reservation_status'>

const STATUS_LABEL: Record<Status, string> = {
  pendente: 'Pendente',
  confirmada: 'Confirmada',
  concluida: 'Concluída',
  cancelada: 'Cancelada',
}

const STATUS_BORDER: Record<Status, string> = {
  pendente: 'border-l-warning',
  confirmada: 'border-l-primary',
  concluida: 'border-l-success',
  cancelada: 'border-l-danger/40',
}

/** Corta segundos de um horário 'HH:MM:SS' -> 'HH:MM'. */
function formatarHora(time: string): string {
  return time.slice(0, 5)
}

function StatusBadge({ status }: { status: Status }) {
  if (status === 'confirmada') {
    return (
      <Badge className="bg-primary text-bica-fg border-0 shrink-0">
        {STATUS_LABEL[status]}
      </Badge>
    )
  }
  if (status === 'concluida') {
    return (
      <Badge className="bg-success text-white border-0 shrink-0">
        {STATUS_LABEL[status]}
      </Badge>
    )
  }
  if (status === 'cancelada') {
    return <Badge variant="destructive" className="shrink-0">{STATUS_LABEL[status]}</Badge>
  }
  return <Badge variant="secondary" className="shrink-0">{STATUS_LABEL[status]}</Badge>
}

export function ReservaCard({ reserva, mesa }: ReservaCardProps) {
  const [isPending, startTransition] = useTransition()
  const [erro, setErro] = useState<string | null>(null)
  const status = reserva.status

  function mudarStatus(novo: Status) {
    setErro(null)
    startTransition(async () => {
      try {
        await atualizarStatusReserva(reserva.id, novo)
      } catch (err) {
        setErro(err instanceof Error ? err.message : 'Erro ao atualizar')
      }
    })
  }

  const cancelada = status === 'cancelada'

  return (
    <Card
      size="sm"
      className={cn(
        'rounded-lg border-l-4 transition-opacity',
        STATUS_BORDER[status],
        cancelada && 'opacity-60',
      )}
    >
      <CardContent className="space-y-2">
        {/* Linha principal: horário + badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-2xl font-mono font-bold text-b1 leading-none">
              {formatarHora(reserva.start_time)}
              <span className="text-sm font-normal text-b3 ml-1">
                – {formatarHora(reserva.end_time)}
              </span>
            </p>
            <p className={cn('text-sm font-medium text-b2 mt-1', cancelada && 'line-through')}>
              {reserva.customer_name}
            </p>
          </div>
          <StatusBadge status={status} />
        </div>

        {/* Detalhes */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-b3">
          <span className="flex items-center gap-1">
            <Users size={13} aria-hidden="true" />
            {reserva.guest_count} {reserva.guest_count === 1 ? 'pessoa' : 'pessoas'}
          </span>
          {mesa && (
            <span className={cn('flex items-center gap-1', status === 'confirmada' && 'text-primary')}>
              <MapPin size={13} aria-hidden="true" />
              Mesa {mesa.number}
              {mesa.location ? ` · ${mesa.location}` : ''}
            </span>
          )}
          {reserva.customer_phone && (
            <span className="flex items-center gap-1">
              <Phone size={13} aria-hidden="true" />
              {reserva.customer_phone}
            </span>
          )}
        </div>

        {reserva.notes && (
          <p className="flex items-start gap-1 text-xs text-b4">
            <StickyNote size={13} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>{reserva.notes}</span>
          </p>
        )}

        {erro && <p className="text-xs text-danger">{erro}</p>}

        {status === 'pendente' && (
          <div className="flex items-center gap-2 pt-1">
            <Button
              variant="brand"
              size="sm"
              disabled={isPending}
              onClick={() => mudarStatus('confirmada')}
              className="min-h-[52px] flex-1"
            >
              {isPending ? <Loader2 className="size-4 animate-spin" /> : 'Confirmar'}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              disabled={isPending}
              onClick={() => mudarStatus('cancelada')}
              className="min-h-[52px]"
            >
              Cancelar
            </Button>
          </div>
        )}

        {status === 'confirmada' && (
          <div className="flex items-center gap-2 pt-1">
            <Button
              size="sm"
              disabled={isPending}
              onClick={() => mudarStatus('concluida')}
              className="bg-success text-white hover:bg-success/90 min-h-[52px] flex-1"
            >
              {isPending ? <Loader2 className="size-4 animate-spin" /> : 'Concluir'}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              disabled={isPending}
              onClick={() => mudarStatus('cancelada')}
              className="min-h-[52px]"
            >
              Cancelar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
