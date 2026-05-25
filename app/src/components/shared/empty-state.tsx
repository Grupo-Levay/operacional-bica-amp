import * as React from "react"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: React.ReactNode
  message: string
  className?: string
}

export function EmptyState({ icon, message, className }: EmptyStateProps) {
  if (!icon) {
    return (
      <p className={cn("text-sm text-muted-foreground italic", className)}>
        {message}
      </p>
    )
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-16 text-center",
        className
      )}
    >
      <span className="text-muted-foreground/40 [&_svg]:size-12">{icon}</span>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
