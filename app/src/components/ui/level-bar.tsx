import { cn } from '@/lib/utils'
import { nivelEstoquePct, severidadeEstoque, type Severidade } from '@/lib/viz'

const fillColor: Record<Severidade, string> = {
  critico: 'bg-danger',
  baixo: 'bg-warning',
  ok: 'bg-success',
}

interface LevelBarProps {
  /** Valor atual (ex.: estoque atual). */
  atual: number
  /** Referência/mínimo (ex.: nível mínimo). */
  minimo: number
  className?: string
}

/**
 * Barra horizontal de nível atual vs mínimo, colorida por severidade.
 * Torna a gravidade de uma ruptura de estoque visível de imediato.
 */
export function LevelBar({ atual, minimo, className }: LevelBarProps) {
  const pct = nivelEstoquePct(atual, minimo)
  const sev = severidadeEstoque(atual, minimo)

  return (
    <div
      className={cn('h-1.5 w-full overflow-hidden rounded-full bg-gradient-surface', className)}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Nível de estoque: ${atual} de ${minimo}`}
    >
      <div
        className={cn('h-full rounded-full transition-all', fillColor[sev])}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
