import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  accent?: "primary" | "danger" | "warning" | "success"
  icon?: ReactNode
}

const accentClasses: Record<NonNullable<StatCardProps["accent"]>, string> = {
  primary: "text-primary",
  danger:  "text-danger",
  warning: "text-warning",
  success: "text-success",
}

export function StatCard({ label, value, sub, accent, icon }: StatCardProps) {
  const accentClass = accent ? accentClasses[accent] : ""

  return (
    <Card size="sm" className="min-h-[96px]">
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {icon && <span className="shrink-0 [&_svg]:size-3.5">{icon}</span>}
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-1">
        <p className={cn("text-3xl font-mono font-medium leading-none tabular-nums", accentClass)}>
          {value}
        </p>
        {sub && (
          <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
        )}
      </CardContent>
    </Card>
  )
}
