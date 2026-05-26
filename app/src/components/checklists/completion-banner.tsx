import { CheckCircle2, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CompletionBannerProps {
  nome: string
  onReabrir: () => void
  isPending: boolean
}

export function CompletionBanner({ nome, onReabrir, isPending }: CompletionBannerProps) {
  return (
    <div className="rounded-xl bg-success-bg border border-success/20 px-4 py-5 flex flex-col items-center gap-3 text-center">
      <CheckCircle2 className="size-10 text-success" strokeWidth={1.5} />
      <div>
        <p className="text-sm font-semibold text-success">Checklist concluído!</p>
        <p className="text-xs text-b3 mt-0.5">{nome}</p>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onReabrir}
        disabled={isPending}
        className="border-success/30 text-success hover:bg-success/10"
      >
        <RotateCcw className="size-3.5 mr-1.5" />
        Reabrir
      </Button>
    </div>
  )
}
