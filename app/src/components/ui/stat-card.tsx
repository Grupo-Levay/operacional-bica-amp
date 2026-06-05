import * as React from "react"
import { ArrowDown, ArrowUp, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

// StatCard — KPI presentational composto sobre Card. Apresenta label, valor
// grande, delta (variação) com cor/seta semântica e slot opcional (children)
// para mini-gráfico/ring. Sem estado → não precisa de 'use client'.

type StatAccent = "primary" | "success" | "warning" | "danger"

interface StatDelta {
  /** Variação numérica. Positivo = alta (success), negativo = queda (danger), zero = neutro. */
  value: number
  /** Rótulo auxiliar (ex.: "vs. mês anterior"). */
  label?: React.ReactNode
}

// Mapas estáticos de classes por accent (Tailwind precisa de classes literais).
const accentChip: Record<StatAccent, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success-bg text-success",
  warning: "bg-warning-bg text-warning",
  danger: "bg-danger-bg text-danger",
}

interface StatCardProps extends React.ComponentProps<typeof Card> {
  label: string
  value: React.ReactNode
  icon?: LucideIcon | React.ReactNode
  delta?: StatDelta
  hint?: React.ReactNode
  accent?: StatAccent
}

function StatCard({
  label,
  value,
  icon,
  delta,
  hint,
  accent = "primary",
  className,
  children,
  ...props
}: StatCardProps) {
  // Aceita tanto um componente Lucide quanto um ReactNode já renderizado.
  const renderedIcon =
    typeof icon === "function"
      ? React.createElement(icon as LucideIcon, { className: "size-4" })
      : icon

  // Direção do delta define cor e ícone de tendência.
  const deltaDirection =
    delta == null ? "zero" : delta.value > 0 ? "up" : delta.value < 0 ? "down" : "zero"
  const deltaTone =
    deltaDirection === "up"
      ? "text-success"
      : deltaDirection === "down"
        ? "text-danger"
        : "text-muted-foreground"
  const DeltaIcon =
    deltaDirection === "up" ? ArrowUp : deltaDirection === "down" ? ArrowDown : null

  return (
    <Card
      data-slot="stat-card"
      className={cn("gap-3", className)}
      {...props}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
        <span className="text-label font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </span>
        {renderedIcon != null && (
          <span
            data-slot="stat-card-icon"
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-lg",
              accentChip[accent]
            )}
          >
            {renderedIcon}
          </span>
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-1.5">
        <span className="text-h2 font-bold tabular-nums">{value}</span>

        {delta != null && (
          <span
            data-slot="stat-card-delta"
            className="inline-flex items-center gap-1 text-caption"
          >
            <span className={cn("inline-flex items-center gap-0.5 font-medium", deltaTone)}>
              {DeltaIcon != null && <DeltaIcon className="size-3" />}
              <span className="tabular-nums">{Math.abs(delta.value)}%</span>
            </span>
            {delta.label != null && (
              <span className="text-muted-foreground">{delta.label}</span>
            )}
          </span>
        )}

        {hint != null && (
          <span className="text-caption text-muted-foreground">{hint}</span>
        )}

        {children}
      </CardContent>
    </Card>
  )
}

export { StatCard }
export type { StatCardProps, StatAccent, StatDelta }
