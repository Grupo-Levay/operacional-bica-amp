'use client'

import { useReportWebVitals } from 'next/web-vitals'
import { registrarWebVital } from '@/app/actions/observability'

/**
 * Coleta Web Vitals (LCP, CLS, INP, FCP, TTFB) com a métrica de usuário real
 * e envia para o backend self-hosted (analytics_events) via Server Action.
 *
 * Confina o client boundary a este componente — montado uma vez no layout
 * autenticado. Envio é fire-and-forget: erros de telemetria não afetam a UX.
 */
export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    void registrarWebVital({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
      navigationType: metric.navigationType,
    })
  })

  return null
}
