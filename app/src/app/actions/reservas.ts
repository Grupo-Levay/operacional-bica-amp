'use server'

import { revalidatePath } from 'next/cache'
import { requireUser } from '@/lib/auth-guard'
import type { Enums } from '@/types/database.types'

interface CriarReservaInput {
  customerName: string
  customerPhone?: string
  reservationDate: string
  startTime: string
  endTime: string
  guestCount: number
  tableId?: string | null
  notes?: string
}

/** Transições de status permitidas. Estados terminais não permitem saída. */
const TRANSICOES: Record<Enums<'reservation_status'>, Enums<'reservation_status'>[]> = {
  pendente: ['confirmada', 'cancelada'],
  confirmada: ['concluida', 'cancelada'],
  concluida: [],
  cancelada: [],
}

export async function criarReserva(input: CriarReservaInput) {
  const { supabase, userId, casa } = await requireUser()

  const customerName = input.customerName?.trim() ?? ''
  if (!customerName) {
    throw new Error('Nome do cliente é obrigatório')
  }
  if (!input.reservationDate || !input.startTime || !input.endTime) {
    throw new Error('Data e horários são obrigatórios')
  }
  const guestCount = Math.trunc(Number(input.guestCount))
  if (!Number.isInteger(guestCount) || guestCount < 1) {
    throw new Error('Número de pessoas deve ser ao menos 1')
  }
  // Comparação de string 'HH:MM' funciona lexicograficamente.
  if (input.endTime <= input.startTime) {
    throw new Error('Horário de fim deve ser maior que o de início')
  }

  // Quando há mesa selecionada: validar capacidade e ausência de colisão de horário.
  if (input.tableId) {
    const { data: mesa } = await supabase
      .from('bar_tables')
      .select('capacity, is_active')
      .eq('id', input.tableId)
      .eq('casa', casa)
      .single()

    if (!mesa || !mesa.is_active) {
      throw new Error('Mesa indisponível')
    }
    if (guestCount > mesa.capacity) {
      throw new Error(`Mesa comporta no máximo ${mesa.capacity} ${mesa.capacity === 1 ? 'pessoa' : 'pessoas'}`)
    }

    // Colisão: mesma mesa/data, horários sobrepostos [start, end), exceto canceladas.
    // Sobreposição ⇔ start_existente < end_nova E end_existente > start_nova.
    const { data: conflitos } = await supabase
      .from('reservations')
      .select('id')
      .eq('casa', casa)
      .eq('table_id', input.tableId)
      .eq('reservation_date', input.reservationDate)
      .neq('status', 'cancelada')
      .lt('start_time', input.endTime)
      .gt('end_time', input.startTime)

    if (conflitos && conflitos.length > 0) {
      throw new Error('Já existe uma reserva para esta mesa no horário selecionado')
    }
  }

  // Buscar o nome do perfil para registrar created_by_name.
  // NÃO gravar created_by (FK aponta para team_members, não para usuários do app).
  const { data: perfil } = await supabase
    .from('perfis')
    .select('nome')
    .eq('id', userId)
    .single()

  const createdByName = perfil?.nome?.trim() || 'Equipe'

  const phone = input.customerPhone?.trim()
  const notes = input.notes?.trim()

  const { error } = await supabase.from('reservations').insert({
    casa,
    customer_name: customerName,
    customer_phone: phone ? phone : null,
    reservation_date: input.reservationDate,
    start_time: input.startTime,
    end_time: input.endTime,
    guest_count: guestCount,
    table_id: input.tableId ? input.tableId : null,
    notes: notes ? notes : null,
    created_by_name: createdByName,
  })

  if (error) {
    throw new Error(`Erro ao criar reserva: ${error.message}`)
  }

  revalidatePath('/reservas')
}

export async function atualizarStatusReserva(
  id: string,
  novoStatus: Enums<'reservation_status'>,
) {
  const { supabase, casa } = await requireUser()

  const { data: atual, error: fetchError } = await supabase
    .from('reservations')
    .select('status')
    .eq('id', id)
    .eq('casa', casa)
    .single()

  if (fetchError || !atual) {
    throw new Error('Reserva não encontrada')
  }

  const permitidas = TRANSICOES[atual.status] ?? []
  if (!permitidas.includes(novoStatus)) {
    throw new Error(`Transição de "${atual.status}" para "${novoStatus}" não permitida`)
  }

  const { error } = await supabase
    .from('reservations')
    .update({ status: novoStatus })
    .eq('id', id)
    .eq('casa', casa)

  if (error) {
    throw new Error(`Erro ao atualizar reserva: ${error.message}`)
  }

  revalidatePath('/reservas')
}
