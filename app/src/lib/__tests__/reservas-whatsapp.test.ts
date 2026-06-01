import { describe, it, expect } from 'vitest'
import {
  normalizarTelefoneBR,
  montarMensagemWhatsApp,
  montarLinkWhatsApp,
} from '../reservas-whatsapp'

// ---------------------------------------------------------------------------
// Fixture base
// ---------------------------------------------------------------------------
const reservaBase = {
  customer_name: 'Ana Lima',
  customer_phone: '11999998888',
  reservation_date: '2025-12-31',
  start_time: '19:30:00',
  guest_count: 3,
}

const NOME_CASA = 'BiCA'

// ---------------------------------------------------------------------------
// normalizarTelefoneBR
// ---------------------------------------------------------------------------
describe('normalizarTelefoneBR', () => {
  it('retorna null para string vazia', () => {
    expect(normalizarTelefoneBR('')).toBeNull()
  })

  it('retorna null para null', () => {
    expect(normalizarTelefoneBR(null)).toBeNull()
  })

  it('retorna null para string com apenas caracteres não-numéricos', () => {
    expect(normalizarTelefoneBR('---')).toBeNull()
  })

  it('prefixa 55 em número com 11 dígitos (DDD + 9 dígitos)', () => {
    expect(normalizarTelefoneBR('11999998888')).toBe('5511999998888')
  })

  it('prefixa 55 em número com 10 dígitos (DDD + 8 dígitos)', () => {
    expect(normalizarTelefoneBR('1133334444')).toBe('551133334444')
  })

  it('mantém número que já começa com 55 e tem 13 dígitos', () => {
    expect(normalizarTelefoneBR('5511999998888')).toBe('5511999998888')
  })

  it('mantém número que já começa com 55 e tem 12 dígitos', () => {
    expect(normalizarTelefoneBR('551133334444')).toBe('551133334444')
  })

  it('remove máscara "(11) 99999-9999" e prefixa 55', () => {
    expect(normalizarTelefoneBR('(11) 99999-9999')).toBe('5511999999999')
  })

  it('remove máscara "(11) 3333-4444" (10 dígitos) e prefixa 55', () => {
    expect(normalizarTelefoneBR('(11) 3333-4444')).toBe('551133334444')
  })
})

// ---------------------------------------------------------------------------
// montarMensagemWhatsApp
// ---------------------------------------------------------------------------
describe('montarMensagemWhatsApp', () => {
  it('contém o nome do cliente', () => {
    const msg = montarMensagemWhatsApp(reservaBase, NOME_CASA)
    expect(msg).toContain('Ana Lima')
  })

  it('contém o nome da casa', () => {
    const msg = montarMensagemWhatsApp(reservaBase, NOME_CASA)
    expect(msg).toContain('BiCA')
  })

  it('formata a data no padrão DD/MM', () => {
    const msg = montarMensagemWhatsApp(reservaBase, NOME_CASA)
    expect(msg).toContain('31/12')
  })

  it('formata a hora no padrão HH:MM (sem segundos)', () => {
    const msg = montarMensagemWhatsApp(reservaBase, NOME_CASA)
    expect(msg).toContain('19:30')
    expect(msg).not.toContain('19:30:00')
  })

  it('usa plural "pessoas" para guest_count > 1', () => {
    const msg = montarMensagemWhatsApp(reservaBase, NOME_CASA)
    expect(msg).toContain('3 pessoas')
  })

  it('usa singular "pessoa" para guest_count = 1', () => {
    const msg = montarMensagemWhatsApp({ ...reservaBase, guest_count: 1 }, NOME_CASA)
    expect(msg).toContain('1 pessoa')
    expect(msg).not.toContain('pessoas')
  })
})

// ---------------------------------------------------------------------------
// montarLinkWhatsApp
// ---------------------------------------------------------------------------
describe('montarLinkWhatsApp', () => {
  it('retorna null quando customer_phone é null', () => {
    const reservaSemFone = { ...reservaBase, customer_phone: null }
    expect(montarLinkWhatsApp(reservaSemFone, NOME_CASA)).toBeNull()
  })

  it('retorna null quando customer_phone está vazio', () => {
    const reservaSemFone = { ...reservaBase, customer_phone: '' }
    expect(montarLinkWhatsApp(reservaSemFone, NOME_CASA)).toBeNull()
  })

  it('retorna URL wa.me com o número normalizado', () => {
    const link = montarLinkWhatsApp(reservaBase, NOME_CASA)
    expect(link).not.toBeNull()
    expect(link).toMatch(/^https:\/\/wa\.me\/5511999998888/)
  })

  it('inclui o texto da mensagem encodado na URL', () => {
    const link = montarLinkWhatsApp(reservaBase, NOME_CASA)!
    expect(link).toContain('?text=')
    // O texto deve conter o nome encodado
    expect(decodeURIComponent(link.split('?text=')[1])).toContain('Ana Lima')
  })

  it('texto encodado contém a data e hora da reserva', () => {
    const link = montarLinkWhatsApp(reservaBase, NOME_CASA)!
    const texto = decodeURIComponent(link.split('?text=')[1])
    expect(texto).toContain('31/12')
    expect(texto).toContain('19:30')
  })
})
