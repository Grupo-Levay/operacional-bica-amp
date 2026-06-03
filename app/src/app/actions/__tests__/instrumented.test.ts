import { describe, it, expect, vi, beforeEach } from 'vitest'

const trackEvent = vi.fn().mockResolvedValue(undefined)
vi.mock('@/lib/analytics', () => ({ trackEvent: (...args: unknown[]) => trackEvent(...args) }))

import { withAnalytics } from '../instrumented'

describe('withAnalytics', () => {
  beforeEach(() => trackEvent.mockClear())

  it('retorna o resultado e registra sucesso com duração', async () => {
    const result = await withAnalytics('teste.ok', async () => 42, { foo: 'bar' })

    expect(result).toBe(42)
    expect(trackEvent).toHaveBeenCalledTimes(1)
    const [action, opts] = trackEvent.mock.calls[0]
    expect(action).toBe('teste.ok')
    expect(opts.status).toBeUndefined() // sucesso é o default
    expect(typeof opts.duration_ms).toBe('number')
    expect(opts.duration_ms).toBeGreaterThanOrEqual(0)
    expect(opts.metadata).toEqual({ foo: 'bar' })
  })

  it('registra erro com mensagem e re-lança o erro original', async () => {
    const boom = new Error('falhou')
    await expect(
      withAnalytics('teste.erro', async () => {
        throw boom
      }),
    ).rejects.toBe(boom)

    expect(trackEvent).toHaveBeenCalledTimes(1)
    const [action, opts] = trackEvent.mock.calls[0]
    expect(action).toBe('teste.erro')
    expect(opts.status).toBe('error')
    expect(opts.error_message).toBe('falhou')
    expect(typeof opts.duration_ms).toBe('number')
  })

  it('serializa erros não-Error como string', async () => {
    await expect(
      withAnalytics('teste.erro2', async () => {
        throw 'string solta'
      }),
    ).rejects.toBe('string solta')

    expect(trackEvent.mock.calls[0][1].error_message).toBe('string solta')
  })

  it('não deixa falha de telemetria afetar o resultado', async () => {
    trackEvent.mockRejectedValueOnce(new Error('telemetria caiu'))
    // trackEvent é fire-and-forget (void) — não deve impactar o retorno
    const result = await withAnalytics('teste.fireforget', async () => 'ok')
    expect(result).toBe('ok')
  })
})
