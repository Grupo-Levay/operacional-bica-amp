"use client"

import { useEffect } from "react"
import { TriangleAlert } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AppError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error("[app] segment error:", error)
  }, [error])

  return (
    <main className="grid min-h-[60vh] place-items-center p-4">
      <div className="flex max-w-sm flex-col items-center gap-4 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-danger-bg text-danger">
          <TriangleAlert className="size-7" />
        </span>
        <div className="space-y-1">
          <h2 className="font-display text-xl text-primary">Algo deu errado</h2>
          <p className="text-sm text-muted-foreground">
            Não foi possível carregar esta seção. Tente novamente.
          </p>
        </div>
        <Button variant="brand" size="cta" onClick={() => unstable_retry()}>
          Tentar de novo
        </Button>
      </div>
    </main>
  )
}
