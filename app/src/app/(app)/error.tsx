'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 py-20 text-center">
      <AlertTriangle className="size-10 text-destructive opacity-80" />
      <div>
        <p className="font-semibold text-sm">Algo deu errado</p>
        <p className="text-xs text-muted-foreground mt-1">
          {error.digest ? `Código: ${error.digest}` : 'Tente novamente em instantes.'}
        </p>
      </div>
      <button
        onClick={reset}
        className="px-4 py-2 rounded-lg border text-sm hover:bg-muted transition-colors"
      >
        Tentar novamente
      </button>
    </div>
  )
}
