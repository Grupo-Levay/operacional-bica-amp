import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

interface EstoqueAlertBannerProps {
  count: number
}

export function EstoqueAlertBanner({ count }: EstoqueAlertBannerProps) {
  if (count === 0) return null

  return (
    <div className="bg-danger-bg border-b border-danger/20 px-4 py-2 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-danger text-sm font-medium">
        <AlertTriangle className="size-4 shrink-0" strokeWidth={1.5} />
        <span>
          {count === 1
            ? '1 item do estoque abaixo do mínimo'
            : `${count} itens do estoque abaixo do mínimo`}
        </span>
      </div>
      <Link
        href="/estoque"
        className="text-xs font-semibold text-danger underline-offset-2 hover:underline shrink-0"
      >
        Ver estoque
      </Link>
    </div>
  )
}
