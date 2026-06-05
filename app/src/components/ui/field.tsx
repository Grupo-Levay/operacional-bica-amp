"use client"

// Field: agrupa label/control/description/error com associação automática (Base UI).
import * as React from "react"
import { Field as BaseField } from "@base-ui/react/field"
import { cn } from "@/lib/utils"

// Raiz do campo — empilha as partes com espaçamento vertical.
function Field({
  className,
  ...props
}: React.ComponentProps<typeof BaseField.Root>) {
  return (
    <BaseField.Root
      data-slot="field"
      className={cn("space-y-1.5", className)}
      {...props}
    />
  )
}

// Label — associado ao control automaticamente. `required` mostra asterisco.
function FieldLabel({
  className,
  required,
  children,
  ...props
}: React.ComponentProps<typeof BaseField.Label> & { required?: boolean }) {
  return (
    <BaseField.Label
      data-slot="field-label"
      className={cn("text-xs font-medium text-muted-foreground", className)}
      {...props}
    >
      {children}
      {required ? (
        <span aria-hidden className="ml-0.5 text-danger">
          *
        </span>
      ) : null}
    </BaseField.Label>
  )
}

// Control bruto — para casos custom (re-export estilizável pelo consumidor).
function FieldControl({
  className,
  ...props
}: React.ComponentProps<typeof BaseField.Control>) {
  return (
    <BaseField.Control
      data-slot="field-control"
      className={className}
      {...props}
    />
  )
}

// Descrição auxiliar do campo.
function FieldDescription({
  className,
  ...props
}: React.ComponentProps<typeof BaseField.Description>) {
  return (
    <BaseField.Description
      data-slot="field-description"
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

// Mensagem de erro — só aparece quando o campo está inválido.
function FieldError({
  className,
  ...props
}: React.ComponentProps<typeof BaseField.Error>) {
  return (
    <BaseField.Error
      data-slot="field-error"
      className={cn("text-xs text-danger", className)}
      {...props}
    />
  )
}

export { Field, FieldLabel, FieldControl, FieldDescription, FieldError }
