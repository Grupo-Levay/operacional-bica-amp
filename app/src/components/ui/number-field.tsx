"use client"

// NumberField: entrada numérica com steppers (Base UI). Locale pt-BR por padrão.
import * as React from "react"
import { NumberField as BaseNumberField } from "@base-ui/react/number-field"
import { Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

// String de controle base compartilhada deste arquivo.
const controlBase =
  "border-y border-border bg-background text-center text-sm text-foreground transition-[color,box-shadow,border-color] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:relative focus-visible:z-10 disabled:opacity-50 disabled:cursor-not-allowed data-[invalid]:border-destructive motion-reduce:transition-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"

// Botões −/+ — alvo de toque mínimo 40px, ring âmbar (ring-ring) no foco.
const stepperBase =
  "grid place-items-center size-9 min-h-[40px] min-w-[40px] shrink-0 border border-border bg-background text-foreground transition-colors hover:bg-muted focus-visible:relative focus-visible:z-10 focus-visible:ring-3 focus-visible:ring-ring/50 outline-none disabled:opacity-50 disabled:cursor-not-allowed motion-reduce:transition-none"

// Raiz — repassa value/onValueChange/min/max/step/disabled. locale pt-BR default.
function NumberField({
  locale = "pt-BR",
  ...props
}: React.ComponentProps<typeof BaseNumberField.Root>) {
  return (
    <BaseNumberField.Root data-slot="number-field" locale={locale} {...props} />
  )
}

// Composto pronto: Decrement | Input | Increment.
function NumberFieldGroup({
  className,
  ...props
}: React.ComponentProps<typeof BaseNumberField.Group>) {
  return (
    <BaseNumberField.Group
      data-slot="number-field-group"
      className={cn("inline-flex items-stretch", className)}
      {...props}
    >
      <BaseNumberField.Decrement
        className={cn(stepperBase, "rounded-l-md")}
        aria-label="Diminuir"
      >
        <Minus className="size-4" />
      </BaseNumberField.Decrement>
      <BaseNumberField.Input className={cn(controlBase, "h-9 w-16 px-2")} />
      <BaseNumberField.Increment
        className={cn(stepperBase, "rounded-r-md")}
        aria-label="Aumentar"
      >
        <Plus className="size-4" />
      </BaseNumberField.Increment>
    </BaseNumberField.Group>
  )
}

// Partes cruas para composição custom.
const NumberFieldInput = BaseNumberField.Input
const NumberFieldIncrement = BaseNumberField.Increment
const NumberFieldDecrement = BaseNumberField.Decrement
const NumberFieldScrubArea = BaseNumberField.ScrubArea
const NumberFieldScrubAreaCursor = BaseNumberField.ScrubAreaCursor

export {
  NumberField,
  NumberFieldGroup,
  NumberFieldInput,
  NumberFieldIncrement,
  NumberFieldDecrement,
  NumberFieldScrubArea,
  NumberFieldScrubAreaCursor,
}
