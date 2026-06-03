'use server'

import { revalidatePath } from 'next/cache'
import { requireUser } from '@/lib/auth-guard'
import { STATUS_OCUPA_MESA } from '@/lib/reservas-availability'
import { criarMaquinaEstados } from '@/lib/state-machine'
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

interface EditarReservaInput extends CriarReservaInput {
  id: string
}

type Status = Enums<'reservation_status'>

/** Máquina de estados das reservas. Estados terminais não permitem saída.
 *  pendente   → confirmada | cancelada
 *  confirmada → presente | nao_compareceu | cancelada
 *  presente   → concluida | cancelada */
const reservaFsm = criarMaquinaEstados<Status>({
  pendente: ['confirmada', 'cancelada'],
  confirmada: ['presente', 'nao_compareceu', 'cancelada'],
  presente: ['concluida', 'cancelada'],
  concluida: [],
  cancelada: [],
  nao_compareceu: [],
})

/** Reservas ativas (não-terminais) podem ser editadas. */
const STATUS_EDITAVEL: ReadonlySet<Status> = new Set<Status>([
  'pendente',
  'confirmada',
  'presente',
])

/** Valida e normaliza os campos comuns de criação/edição.
 *  Lança Error com mensagem amigável na primeira inconsistência. */
function normalizarInput(input: CriarReservaInput) {
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

  return {
    customerName,
    guestCount,
    phone: input.customerPhone?.trim() || null,
    notes: input.notes?.trim() || null,
    tableId: input.tableId || null,
  }
}

/** Valida capacidade da mesa e ausência de colisão de horário.
 *  `excluirId` ignora uma reserva na checagem (usado na edição). */
async function validarMesa(
  supabase: Awaited<ReturnType<typeof requireUser>>['supabase'],
  casa: string,
  tableId: string,
  guestCount: number,
  input: CriarReservaInput,
  excluirId?: string,
) {
  const { data: mesa } = await supabase
    .from('bar_tables')
    .select('capacity, is_active')
    .eq('id', tableId)
    .eq('casa', casa)
    .single()

  if (!mesa || !mesa.is_active) {
    throw new Error('Mesa indisponível')
  }
  if (guestCount > mesa.capacity) {
    throw new Error(
      `Mesa comporta no máximo ${mesa.capacity} ${mesa.capacity === 1 ? 'pessoa' : 'pessoas'}`,
    )
  }

  // Colisão: mesma mesa/data, horários sobrepostos [start, end).
  // Considera apenas status que ocupam a mesa (exclui cancelada e nao_compareceu).
  // Sobreposição ⇔ start_existente < end_nova E end_existente > start_nova.
  let query = supabase
    .from('reservations')
    .select('id')
    .eq('casa', casa)
    .eq('table_id', tableId)
    .eq('reservation_date', input.reservationDate)
    .in('status', [...STATUS_OCUPA_MESA])
    .lt('start_time', input.endTime)
    .gt('end_time', input.startTime)

  if (excluirId) {
    query = query.neq('id', excluirId)
  }

  const { data: conflitos } = await query
  if (conflitos && conflitos.length > 0) {
    throw new Error('Já existe uma reserva para esta mesa no horário selecionado')
  }
}

export async function criarReserva(input: CriarReservaInput) {
  const { supabase, userId, casa } = await requireUser()

  const { customerName, guestCount, phone, notes, tableId } = normalizarInput(input)

  if (tableId) {
    await validarMesa(supabase, casa, tableId, guestCount, input)
  }

  // Buscar o nome do perfil para registrar created_by_name.
  // NÃO gravar created_by (FK aponta para team_members, não para usuários do app).
  const { data: perfil } = await supabase
    .from('perfis')
    .select('nome')
    .eq('id', userId)
    .single()

  const createdByName = perfil?.nome?.trim() || 'Equipe'

  const { error } = await supabase.from('reservations').insert({
    casa,
    customer_name: customerName,
    customer_phone: phone,
    reservation_date: input.reservationDate,
    start_time: input.startTime,
    end_time: input.endTime,
    guest_count: guestCount,
    table_id: tableId,
    notes,
    created_by_name: createdByName,
  })

  if (error) {
    throw new Error(`Erro ao criar reserva: ${error.message}`)
  }

  revalidatePath('/reservas')
}

export async function editarReserva(input: EditarReservaInput) {
  const { supabase, casa } = await requireUser()

  const { customerName, guestCount, phone, notes, tableId } = normalizarInput(input)

  const { data: atual, error: fetchError } = await supabase
    .from('reservations')
    .select('status')
    .eq('id', input.id)
    .eq('casa', casa)
    .single()

  if (fetchError || !atual) {
    throw new Error('Reserva não encontrada')
  }
  if (!STATUS_EDITAVEL.has(atual.status)) {
    throw new Error('Esta reserva não pode mais ser editada')
  }

  if (tableId) {
    await validarMesa(supabase, casa, tableId, guestCount, input, input.id)
  }

  const { error } = await supabase
    .from('reservations')
    .update({
      customer_name: customerName,
      customer_phone: phone,
      reservation_date: input.reservationDate,
      start_time: input.startTime,
      end_time: input.endTime,
      guest_count: guestCount,
      table_id: tableId,
      notes,
    })
    .eq('id', input.id)
    .eq('casa', casa)

  if (error) {
    throw new Error(`Erro ao editar reserva: ${error.message}`)
  }

  revalidatePath('/reservas')
}

export async function atualizarStatusReserva(id: string, novoStatus: Status) {
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

  if (!reservaFsm.podeTransicionar(atual.status, novoStatus)) {
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
