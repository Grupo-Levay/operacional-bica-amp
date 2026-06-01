'use client'

import { useState, useTransition } from 'react'
import { Users, Phone, MapPin, StickyNote, Loader2, Pencil } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ReservaForm } from '@/components/reservas/reserva-form'
import { atualizarStatusReserva } from '@/app/actions/reservas'
import { toast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'
import type { ReservaSlot } from '@/lib/reservas-availability'
import type { Tables, Enums } from '@/types/database.types'

interface ReservaCardProps {
  reserva: Tables<'reservations'>
  mesa?: { number: string; location: string | null } | null
  /** Mesas e reservas do dia, necessárias para o modo de edição inline. */
  tables: Tables<'bar_tables'>[]
  reservasDoDia: ReservaSlot[]
}

type Status = Enums<'reservation_status'>

const STATUS_LABEL: Record<Status, string> = {
  pendente: 'Pendente',
  confirmada: 'Confirmada',
  presente: 'Na casa',
  concluida: 'Concluída',
  cancelada: 'Cancelada',
  nao_compareceu: 'Não compareceu',
}

const STATUS_BORDER: Record<Status, string> = {
  pendente: 'border-l-warning',
  confirmada: 'border-l-primary',
  presente: 'border-l-success',
  concluida: 'border-l-b3',
  cancelada: 'border-l-danger/40',
  nao_compareceu: 'border-l-warning/50',
}

const STATUS_BADGE: Record<Status, React.ComponentProps<typeof Badge>['variant']> = {
  pendente: 'secondary',
  confirmada: 'outline',
  presente: 'default',
  concluida: 'success',
  cancelada: 'destructive',
  nao_compareceu: 'warning',
}

const STATUS_DONE_LABEL: Record<Status, string> = {
  pendente: 'Reserva atualizada',
  confirmada: 'Reserva confirmada',
  presente: 'Cliente registrado na casa',
  concluida: 'Reserva concluída',
  cancelada: 'Reserva cancelada',
  nao_compareceu: 'Marcada como não compareceu',
}

/** Estados não-terminais permitem edição. */
const STATUS_EDITAVEL: ReadonlySet<Status> = new Set<Status>([
  'pendente',
  'confirmada',
  'presente',
])

/** Corta segundos de um horário 'HH:MM:SS' -> 'HH:MM'. */
function formatarHora(time: string): string {
  return time.slice(0, 5)
}

export function ReservaCard({ reserva, mesa, tables, reservasDoDia }: ReservaCardProps) {
  const [isPending, startTransition] = useTransition()
  const [erro, setErro] = useState<string | null>(null)
  const [editando, setEditando] = useState(false)
  const status = reserva.status

  function mudarStatus(novo: Status) {
    setErro(null)
    startTransition(async () => {
      try {
        await atualizarStatusReserva(reserva.id, novo)
        toast.success(STATUS_DONE_LABEL[novo], reserva.customer_name)
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Erro ao atualizar'
        setErro(msg)
        toast.error('Não foi possível atualizar', msg)
      }
    })
  }

  if (editando) {
    return (
      <ReservaForm
        tables={tables}
        reservasDoDia={reservasDoDia}
        defaultDate={reserva.reservation_date}
        reserva={reserva}
        onCancel={() => setEditando(false)}
        onSuccess={() => setEditando(false)}
      />
    )
  }

  const cancelada = status === 'cancelada'
  const editavel = STATUS_EDITAVEL.has(status)

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
          <div className="flex items-center gap-1.5 shrink-0">
            {editavel && (
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Editar reserva"
                disabled={isPending}
                onClick={() => setEditando(true)}
              >
                <Pencil size={14} aria-hidden="true" />
              </Button>
            )}
            <Badge variant={STATUS_BADGE[status]}>{STATUS_LABEL[status]}</Badge>
          </div>
        </div>

        {/* Detalhes */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-b3">
          <span className="flex items-center gap-1">
            <Users size={13} aria-hidden="true" />
            {reserva.guest_count} {reserva.guest_count === 1 ? 'pessoa' : 'pessoas'}
          </span>
          {mesa && (
            <span className={cn('flex items-center gap-1', (status === 'confirmada' || status === 'presente') && 'text-primary')}>
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
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="success"
                disabled={isPending}
                onClick={() => mudarStatus('presente')}
                className="min-h-[52px] flex-1"
              >
                {isPending ? <Loader2 className="size-4 animate-spin" /> : 'Cliente chegou'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={isPending}
                onClick={() => mudarStatus('nao_compareceu')}
                className="min-h-[52px]"
              >
                Não veio
              </Button>
            </div>
            <Button
              size="sm"
              variant="ghost"
              disabled={isPending}
              onClick={() => mudarStatus('cancelada')}
              className="min-h-[44px] w-full text-danger hover:text-danger"
            >
              Cancelar reserva
            </Button>
          </div>
        )}

        {status === 'presente' && (
          <div className="flex items-center gap-2 pt-1">
            <Button
              size="sm"
              variant="success"
              disabled={isPending}
              onClick={() => mudarStatus('concluida')}
              className="min-h-[52px] flex-1"
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
