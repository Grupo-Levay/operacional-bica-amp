'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface UseRealtimeTableOptions {
  /** Nome da tabela Postgres a observar (deve estar na publication supabase_realtime). */
  table: string
  /** Casa do tenant — filtra os eventos no servidor (`casa=eq.<casa>`). */
  casa: string
  /** Habilita/desabilita a subscription (ex.: só ligar na data de hoje). Padrão: true. */
  enabled?: boolean
}

/**
 * Assina mudanças (insert/update/delete) de uma tabela via Supabase Realtime,
 * filtradas pela casa do tenant, e revalida a rota a cada evento.
 *
 * Mantém o painel operacional vivo entre dispositivos sem refresh manual.
 */
export function useRealtimeTable({ table, casa, enabled = true }: UseRealtimeTableOptions) {
  const router = useRouter()

  useEffect(() => {
    if (!enabled || !casa) return

    const supabase = createClient()
    const channel = supabase
      .channel(`realtime:${table}:${casa}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table, filter: `casa=eq.${casa}` },
        () => router.refresh(),
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [table, casa, enabled, router])
}
