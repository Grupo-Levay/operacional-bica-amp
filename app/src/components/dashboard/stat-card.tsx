import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Card } from "@/components/ui/card"
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
  className?: string
}

const valueClasses: Record<Accent, string> = {
  primary: "text-primary",
  danger: "text-danger",
  warning: "text-warning",
  success: "text-success",
}

const chipClasses: Record<Accent, string> = {
  primary: "bg-primary/12 text-primary",
  danger: "bg-danger-bg text-danger",
  warning: "bg-warning-bg text-warning",
  success: "bg-success-bg text-success",
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
  className,
}: StatCardProps) {
  const valueClass = accent ? valueClasses[accent] : ""
  const chipClass = accent ? chipClasses[accent] : "bg-muted text-muted-foreground"
  const barClass = accent ? barClasses[accent] : "bg-muted-foreground"

  const inner = (
    <Card
      size="sm"
      className={cn(
        "relative h-full justify-between gap-2 px-4 py-3.5",
        href &&
          "transition-all duration-200 group-hover/stat:-translate-y-0.5 group-hover/stat:ring-primary/30",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        {icon && (
          <span
            className={cn(
              "grid size-8 shrink-0 place-items-center rounded-lg [&_svg]:size-4",
              chipClass
            )}
          >
            {icon}
          </span>
        )}
      </div>

      <div>
        <p
          className={cn(
            "font-mono text-3xl font-medium leading-none tabular-nums",
            valueClass
          )}
        >
          {value}
        </p>
        {sub && <p className="mt-1.5 text-xs text-muted-foreground">{sub}</p>}
      </div>

      {typeof progress === "number" && (
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-ink4">
          <div
            className={cn("h-full rounded-full transition-all", barClass)}
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}

      {href && (
        <ArrowUpRight className="absolute bottom-3.5 right-4 size-4 text-muted-foreground/50 opacity-0 transition-opacity group-hover/stat:opacity-100" />
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
