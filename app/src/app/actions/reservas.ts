'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentCasa } from '@/lib/tenant'
import { getTodayISO } from '@/lib/utils'

async function getAuthedContext() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const casa = await getCurrentCasa()
  return { supabase, casa, user }
}

export type ReservaStatus = 'pendente' | 'confirmada' | 'cancelada' | 'concluida'

export async function updateReservaStatus(reservaId: string, status: ReservaStatus) {
  const { supabase, casa } = await getAuthedContext()

  const { data: reserva } = await supabase
    .from('reservations')
    .select('id')
    .eq('id', reservaId)
    .eq('casa', casa)
    .maybeSingle()

  if (!reserva) return { error: 'Reserva não encontrada' }

  const { error } = await supabase
    .from('reservations')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', reservaId)

  if (error) return { error: error.message }

  revalidatePath('/reservas')
}

export async function criarReserva(formData: FormData) {
  const { supabase, casa, user } = await getAuthedContext()

  const customer_name = String(formData.get('customer_name') ?? '').trim()
  const customer_phone = String(formData.get('customer_phone') ?? '').trim() || null
  const reservation_date = String(formData.get('reservation_date') ?? '').trim()
  const start_time = String(formData.get('start_time') ?? '').trim()
  const end_time = String(formData.get('end_time') ?? '').trim()
  const guest_count = parseInt(String(formData.get('guest_count') ?? '1'), 10)
  const notes = String(formData.get('notes') ?? '').trim() || null

  if (!customer_name || !reservation_date || !start_time || !end_time) {
    return { error: 'Preencha todos os campos obrigatórios.' }
  }
  if (!Number.isInteger(guest_count) || guest_count < 1) {
    return { error: 'Número de pessoas inválido.' }
  }

  const { data: { user: authUser } } = await supabase.auth.getUser()
  const created_by_name = authUser?.email ?? 'Sistema'

  const { error } = await supabase.from('reservations').insert({
    customer_name,
    customer_phone,
    reservation_date,
    start_time,
    end_time,
    guest_count,
    notes,
    casa,
    status: 'pendente',
    created_by: user.id,
    created_by_name,
  })

  if (error) return { error: error.message }

  revalidatePath('/reservas')
}
