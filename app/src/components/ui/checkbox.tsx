"use client"

// Checkbox: caixa de seleção (Base UI). Suporta estado indeterminado.
import * as React from "react"
import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox"
import { Check, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

// Raiz — `indeterminate` mostra ícone Minus no lugar do Check.
function Checkbox({
  className,
  indeterminate,
  ...props
}: React.ComponentProps<typeof BaseCheckbox.Root>) {
  return (
    <BaseCheckbox.Root
      data-slot="checkbox"
      indeterminate={indeterminate}
      className={cn(
        "size-5 shrink-0 rounded-[6px] border border-border bg-background transition-colors data-[checked]:bg-primary data-[checked]:border-primary data-[indeterminate]:bg-primary data-[indeterminate]:border-primary focus-visible:ring-3 focus-visible:ring-ring/50 outline-none disabled:opacity-50 disabled:cursor-not-allowed grid place-items-center motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      {/* Indicator renderiza quando checked OU indeterminate. */}
      <BaseCheckbox.Indicator className="flex items-center justify-center text-primary-foreground">
        {indeterminate ? (
          <Minus className="size-3.5" />
        ) : (
          <Check className="size-3.5" />
        )}
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  )
}

export { Checkbox }
