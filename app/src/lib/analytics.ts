import { requireUser } from "@/lib/auth-guard"
import { logger } from "@/lib/logger"
import type { Json } from "@/types/database.types"

const log = logger.child({ module: "analytics" })

export type EventStatus = "success" | "error"

export interface TrackEventOptions {
  status?: EventStatus
  duration_ms?: number
  value?: number
  error_message?: string
  metadata?: Record<string, unknown>
}

/**
 * Registra um evento de observabilidade em `analytics_events` (self-hosted).
 *
 * Resolve casa/usuário via requireUser(). É fire-and-forget e *nunca* lança:
 * telemetria não pode derrubar a ação de negócio que a chamou. Em qualquer
 * falha (não autenticado, insert recusado), apenas loga em nível debug.
 */
export async function trackEvent(action: string, opts: TrackEventOptions = {}): Promise<void> {
  try {
    const { supabase, userId, casa } = await requireUser()
    const { error } = await supabase.from("analytics_events").insert({
      casa,
      user_id: userId,
      action,
      status: opts.status ?? "success",
      duration_ms: opts.duration_ms ?? null,
      value: opts.value ?? null,
      error_message: opts.error_message ?? null,
      metadata: (opts.metadata ?? {}) as Json,
    })
    if (error) log.debug("falha ao gravar evento", { action, error: error.message })
  } catch (e) {
    log.debug("trackEvent ignorado", { action, error: e instanceof Error ? e.message : String(e) })
  }
}
