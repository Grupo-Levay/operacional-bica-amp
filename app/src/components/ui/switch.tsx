"use client"

// Switch: toggle on/off (Base UI). Track + thumb deslizante.
import * as React from "react"
import { Switch as BaseSwitch } from "@base-ui/react/switch"
import { cn } from "@/lib/utils"

// Raiz — trilho que muda de cor quando ativo.
function Switch({
  className,
  ...props
}: React.ComponentProps<typeof BaseSwitch.Root>) {
  return (
    <BaseSwitch.Root
      data-slot="switch"
      className={cn(
        "inline-flex h-6 w-11 shrink-0 items-center rounded-full bg-input p-0.5 transition-colors data-[checked]:bg-primary focus-visible:ring-3 focus-visible:ring-ring/50 outline-none disabled:opacity-50 disabled:cursor-not-allowed motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      {/* Botão deslizante. */}
      <BaseSwitch.Thumb className="size-5 rounded-full bg-background shadow-sm transition-transform data-[checked]:translate-x-5 motion-reduce:transition-none" />
    </BaseSwitch.Root>
  )
}

export { Switch }
