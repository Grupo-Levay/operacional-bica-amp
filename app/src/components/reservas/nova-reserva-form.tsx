'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ReservaForm } from '@/components/reservas/reserva-form'
import type { ReservaSlot } from '@/lib/reservas-availability'
import type { Tables } from '@/types/database.types'

interface NovaReservaFormProps {
  tables: Tables<'bar_tables'>[]
  reservasDoDia: ReservaSlot[]
  defaultDate: string
}

export function NovaReservaForm({
  tables,
  reservasDoDia,
  defaultDate,
}: NovaReservaFormProps) {
  const [aberto, setAberto] = useState(false)

  if (!aberto) {
    return (
      <Button variant="gradient" size="cta" onClick={() => setAberto(true)}>
        Nova reserva
      </Button>
    )
  }

  return (
    <ReservaForm
      tables={tables}
      reservasDoDia={reservasDoDia}
      defaultDate={defaultDate}
      onCancel={() => setAberto(false)}
      onSuccess={() => setAberto(false)}
    />
  )
}
