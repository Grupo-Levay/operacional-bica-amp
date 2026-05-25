import * as React from "react"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  subtitle?: string
  badge?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

export function PageHeader({ title, subtitle, badge, action, className }: PageHeaderProps) {
  const hasRight = badge || action

  return (
    <div className={cn("flex items-start justify-between gap-3", className)}>
      <div>
        <h1 className="font-display text-2xl text-primary">{title}</h1>
        {subtitle && (
          <p className="text-xs text-muted-foreground capitalize">{subtitle}</p>
        )}
      </div>
      {hasRight && (
        <div className="flex shrink-0 items-center gap-2 mt-1">
          {badge}
          {action}
        </div>
      )}
    </div>
  )
}
