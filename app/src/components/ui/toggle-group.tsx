"use client"

import * as React from "react"
import { ToggleGroup as BaseToggleGroup } from "@base-ui/react/toggle-group"
import { Toggle as BaseToggle } from "@base-ui/react/toggle"

import { cn } from "@/lib/utils"

// Segmented control sobre Base UI (filtros / troca de visão).
// ToggleGroup controla o valor (array) via value/onValueChange; o flag de
// múltipla seleção é `multiple` (NÃO toggleMultiple). Cada item é um Toggle,
// cujo estado ativo é exposto como data-pressed.

function ToggleGroup<Value extends string>({
  className,
  ...props
}: BaseToggleGroup.Props<Value>) {
  return (
    <BaseToggleGroup
      data-slot="toggle-group"
      className={cn(
        "inline-flex gap-1 rounded-lg bg-muted/60 p-1",
        className
      )}
      {...props}
    />
  )
}

function ToggleGroupItem<Value extends string>({
  className,
  ...props
}: BaseToggle.Props<Value>) {
  return (
    <BaseToggle
      data-slot="toggle-group-item"
      className={cn(
        "inline-flex min-h-[40px] cursor-pointer items-center justify-center gap-1.5 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[pressed]:bg-card data-[pressed]:text-foreground data-[pressed]:shadow-sm data-[pressed]:ring-1 data-[pressed]:ring-foreground/10 focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  )
}

export { ToggleGroup, ToggleGroupItem }
