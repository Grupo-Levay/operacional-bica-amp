'use client'

import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { montarLinkWhatsApp } from '@/lib/reservas-whatsapp'
import type { Tables } from '@/types/database.types'

interface WhatsAppButtonProps {
  reserva: Tables<'reservations'>
  nomeCasa: string
}

export function WhatsAppButton({ reserva, nomeCasa }: WhatsAppButtonProps) {
  const link = montarLinkWhatsApp(
    {
      customer_name: reserva.customer_name,
      customer_phone: reserva.customer_phone,
      reservation_date: reserva.reservation_date,
      start_time: reserva.start_time,
      guest_count: reserva.guest_count,
    },
    nomeCasa,
  )

  if (!link) return null

  return (
    <Button
      variant="ghost"
      size="sm"
      className="min-h-[44px] text-success hover:text-success"
      render={
        <a href={link} target="_blank" rel="noopener noreferrer" />
      }
    >
      <MessageCircle aria-hidden="true" />
      Confirmar no WhatsApp
    </Button>
  )
}
