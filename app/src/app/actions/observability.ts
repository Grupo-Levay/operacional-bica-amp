'use server'

import { trackEvent } from '@/lib/analytics'

export interface WebVitalInput {
  name: string // 'LCP' | 'CLS' | 'INP' | 'FCP' | 'TTFB'
  value: number
  rating?: string // 'good' | 'needs-improvement' | 'poor'
  id?: string
  navigationType?: string
}

/**
 * Recebe uma métrica Web Vital do cliente e persiste em analytics_events.
 * Action leve e fire-and-forget no cliente — falha aqui nunca afeta a UX.
 */
export async function registrarWebVital(metric: WebVitalInput): Promise<void> {
  if (!metric?.name || typeof metric.value !== 'number' || !Number.isFinite(metric.value)) {
    return
  }
  await trackEvent(`web_vital.${metric.name}`, {
    value: metric.value,
    metadata: {
      rating: metric.rating ?? null,
      id: metric.id ?? null,
      navigation_type: metric.navigationType ?? null,
    },
  })
}
