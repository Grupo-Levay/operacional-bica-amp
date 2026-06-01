import type { Tables } from '@/types/database.types'

type Reserva = Pick<
  Tables<'reservations'>,
  'customer_name' | 'customer_phone' | 'reservation_date' | 'start_time' | 'guest_count'
>

/**
 * Normaliza um número de telefone para o formato internacional brasileiro (55XXXXXXXXXXX).
 * - Remove tudo que não é dígito.
 * - Vazio → null.
 * - Já começa com '55' e tem 12-13 dígitos → retorna como está.
 * - 10 ou 11 dígitos (DDD + número) → prefixa '55'.
 * - Demais casos → retorna os dígitos como estão (melhor esforço).
 */
export function normalizarTelefoneBR(phone: string | null): string | null {
  if (!phone) return null

  const digits = phone.replace(/\D/g, '')

  if (!digits) return null

  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) {
    return digits
  }

  if (digits.length === 10 || digits.length === 11) {
    return '55' + digits
  }

  return digits
}

/**
 * Monta a mensagem de confirmação de reserva em pt-BR.
 * Formata a data 'YYYY-MM-DD' → 'DD/MM' e a hora 'HH:MM:SS' → 'HH:MM'.
 */
export function montarMensagemWhatsApp(reserva: Reserva, nomeCasa: string): string {
  const [, mes, dia] = reserva.reservation_date.split('-')
  const dataFormatada = `${dia}/${mes}`
  const horaFormatada = reserva.start_time.slice(0, 5)
  const pessoaLabel = reserva.guest_count === 1 ? 'pessoa' : 'pessoas'

  return (
    `Olá ${reserva.customer_name}! Confirmando sua reserva na ${nomeCasa}: ` +
    `${reserva.guest_count} ${pessoaLabel}, dia ${dataFormatada} às ${horaFormatada}. Até logo! 🍸`
  )
}

/**
 * Monta o link wa.me para envio de mensagem via WhatsApp.
 * Retorna null se o telefone não puder ser normalizado.
 */
export function montarLinkWhatsApp(reserva: Reserva, nomeCasa: string): string | null {
  const tel = normalizarTelefoneBR(reserva.customer_phone ?? null)

  if (!tel) return null

  const mensagem = montarMensagemWhatsApp(reserva, nomeCasa)
  return `https://wa.me/${tel}?text=${encodeURIComponent(mensagem)}`
}
