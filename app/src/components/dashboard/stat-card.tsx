import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type Accent = "primary" | "danger" | "warning" | "success"

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  accent?: Accent
  icon?: ReactNode
  href?: string
  progress?: number
  visualIndicator?: ReactNode
  className?: string
}

const accentColors: Record<Accent, string> = {
  primary: "text-primary",
  danger: "text-danger",
  warning: "text-warning",
  success: "text-success",
}

const glowEffects: Record<Accent, string> = {
  primary: "glow-primary border-primary/20",
  danger: "glow-danger border-danger/20",
  warning: "border-warning/20",
  success: "glow-success border-success/20",
}

const chipClasses: Record<Accent, string> = {
  primary: "bg-primary/12 text-primary",
  danger: "bg-danger/10 text-danger",
  warning: "bg-warning/10 text-warning",
  success: "bg-success/10 text-success",
}

const barClasses: Record<Accent, string> = {
  primary: "bg-primary",
  danger: "bg-danger",
  warning: "bg-warning",
  success: "bg-success",
}

export function StatCard({
  label,
  value,
  sub,
  accent,
  icon,
  href,
  progress,
  visualIndicator,
  className,
}: StatCardProps) {
  const accentColor = accent ? accentColors[accent] : "text-foreground"
  const glowEffect = accent ? glowEffects[accent] : "border-white/5"
  const chipClass = accent ? chipClasses[accent] : "bg-muted text-muted-foreground"
  const barClass = accent ? barClasses[accent] : "bg-muted-foreground"

  const inner = (
    <Card
      size="sm"
      className={cn(
        "glass-card min-h-[110px] relative overflow-hidden transition-all duration-300 border hover:border-white/10 flex flex-col justify-between",
        glowEffect,
        href && "group-hover/stat:-translate-y-0.5 group-hover/stat:ring-primary/30 [@media(hover:hover)]:group-hover/stat:shadow-glow-brand-sm",
        className
      )}
    >
      <div className="flex justify-between items-start h-full">
        <div className="space-y-1 flex-1">
          <CardHeader className="pb-0 p-3">
            <CardTitle className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/80 uppercase tracking-wider">
              {icon && (
                <span className={cn("shrink-0 [&_svg]:size-3.5", chipClass)}>
                  {icon}
                </span>
              )}
              {label}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-1 px-3 pb-3">
            <p className={cn("text-3xl font-extrabold leading-none tabular-nums tracking-tight", accentColor)}>
              {value}
            </p>
            {sub && (
              <p className="mt-1 text-[11px] font-medium text-muted-foreground/75 leading-tight">{sub}</p>
            )}
          </CardContent>
        </div>

        {visualIndicator && (
          <div className="p-3 pr-4 flex items-center justify-center self-center shrink-0">
            {visualIndicator}
          </div>
        )}
      </div>

      {typeof progress === "number" && (
        <div className="px-3 pb-3">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink4">
            <div
              className={cn("h-full rounded-full transition-all", barClass)}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}

      {href && (
        <ArrowUpRight className="absolute bottom-3 right-3 size-4 text-muted-foreground/50 opacity-0 transition-opacity group-hover/stat:opacity-100" />
      )}
    </Card>
  )

  if (href) {
    return (
      <Link href={href} className="group/stat block h-full">
        {inner}
      </Link>
    )
  }

  return inner
}
