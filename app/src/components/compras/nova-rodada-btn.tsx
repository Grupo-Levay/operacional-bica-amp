'use client'

import { useState, useTransition } from 'react'
import { Plus } from 'lucide-react'
import { criarRodada } from '@/app/actions/compras'

export function NovaRodadaBtn() {
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleConfirm() {
    setError(null)
    startTransition(async () => {
      const result = await criarRodada()
      if (result?.error) {
        setError(result.error)
        setConfirming(false)
      } else {
        setConfirming(false)
      }
    })
  }

  if (confirming) {
    return (
      <div className="flex flex-col items-end gap-1.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => { setConfirming(false); setError(null) }}
            disabled={isPending}
            className="px-3 py-1.5 text-xs rounded-lg border hover:bg-muted disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            className="px-3 py-1.5 text-xs rounded-lg text-white font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: 'var(--color-bica)' }}
          >
            {isPending ? 'Criando…' : 'Criar Rodada'}
          </button>
        </div>
        {error && (
          <p className="text-xs text-destructive text-right max-w-[200px]">{error}</p>
        )}
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg text-white font-semibold transition-opacity hover:opacity-90 active:opacity-80"
      style={{ backgroundColor: 'var(--color-bica)' }}
    >
      <Plus size={14} />
      Nova Rodada
    </button>
  )
}
