import { trackEvent } from "@/lib/analytics"

/**
 * Instrumenta uma Server Action: mede duração e registra sucesso/erro em
 * `analytics_events` — sem alterar o comportamento da ação.
 *
 * O tracking é fire-and-forget (`void`): não adiciona latência ao caminho
 * crítico nem propaga falhas de telemetria. Em erro, registra status='error'
 * com a mensagem e **re-lança** o erro original.
 *
 * @example
 *   export async function criarReserva(input: Input) {
 *     return withAnalytics('reserva.criar', () => { ...lógica existente... },
 *       { guest_count: input.guestCount })
 *   }
 */
export async function withAnalytics<T>(
  action: string,
  fn: () => Promise<T>,
  metadata?: Record<string, unknown>,
): Promise<T> {
  const t0 = performance.now()
  try {
    const result = await fn()
    void trackEvent(action, { duration_ms: Math.round(performance.now() - t0), metadata })
    return result
  } catch (err) {
    void trackEvent(action, {
      status: "error",
      duration_ms: Math.round(performance.now() - t0),
      error_message: err instanceof Error ? err.message : String(err),
      metadata,
    })
    throw err
  }
}
