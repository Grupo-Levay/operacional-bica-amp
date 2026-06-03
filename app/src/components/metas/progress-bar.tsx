import { pctProgresso, bgProgresso } from '@/lib/metas-utils'

interface Props {
  atual: number
  alvo: number
  unidade: string
}

export function MetaProgressBar({ atual, alvo, unidade }: Props) {
  const pct = pctProgresso(atual, alvo)

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          {atual} / {alvo} {unidade}
        </span>
        <span className={pct >= 100 ? 'text-success font-semibold' : pct >= 60 ? 'text-warning' : 'text-danger'}>
          {pct}%
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all ${bgProgresso(pct)}`}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  )
}
