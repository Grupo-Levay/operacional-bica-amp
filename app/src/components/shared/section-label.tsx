import * as React from "react"
import { cn } from "@/lib/utils"

interface SectionLabelProps {
  children: React.ReactNode
  className?: string
}

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <h2
      className={cn(
        "text-sm font-medium text-muted-foreground uppercase tracking-wide",
        className
      )}
    >
      {children}
    </h2>
  )
}
