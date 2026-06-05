"use client"

// Input: controle de texto base com variantes de tamanho (cva).
import * as React from "react"
import { Input as BaseInput } from "@base-ui/react/input"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// String de controle base compartilhada (form primitives).
const inputVariants = cva(
  "w-full rounded-md border border-border bg-background px-3 py-2 text-foreground transition-[color,box-shadow,border-color] outline-none placeholder:text-muted-foreground hover:border-foreground/20 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 disabled:cursor-not-allowed data-[invalid]:border-destructive data-[invalid]:ring-3 data-[invalid]:ring-destructive/20 motion-reduce:transition-none",
  {
    variants: {
      size: {
        sm: "h-8 text-xs",
        default: "h-9 text-sm",
        lg: "min-h-[52px] text-base", // alvo de toque confortável no mobile
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
)

// Aceita `type` nativo (text/tel/date/time/email/number etc).
function Input({
  className,
  size,
  ...props
}: Omit<React.ComponentProps<typeof BaseInput>, "size"> &
  VariantProps<typeof inputVariants>) {
  return (
    <BaseInput
      data-slot="input"
      className={cn(inputVariants({ size }), className)}
      {...props}
    />
  )
}

export { Input, inputVariants }
