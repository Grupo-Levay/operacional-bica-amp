import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  accent?: "primary" | "danger" | "warning" | "success"
  icon?: React.ReactNode
}

const accentStyles: Record<NonNullable<StatCardProps["accent"]>, React.CSSProperties> = {
  primary: { color: "var(--color-bica)" },
  danger: { color: "var(--color-amp)" },
  warning: { color: "#d97706" },
  success: { color: "#16a34a" },
}

export function StatCard({ label, value, sub, accent, icon }: StatCardProps) {
  const valueStyle = accent ? accentStyles[accent] : undefined

  return (
    <Card size="sm" className="min-h-[96px]">
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {icon && <span className="shrink-0 [&_svg]:size-3.5">{icon}</span>}
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-1">
        <p
          className="text-3xl font-bold leading-none tabular-nums"
          style={valueStyle}
        >
          {value}
        </p>
        {sub && (
          <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
        )}
      </CardContent>
    </Card>
  )
}
