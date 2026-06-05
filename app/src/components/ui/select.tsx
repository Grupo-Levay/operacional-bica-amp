"use client"

// Select: dropdown rico (Base UI) que substitui o <select> nativo.
import * as React from "react"
import { Select as BaseSelect } from "@base-ui/react/select"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

// Raiz — repassa value/onValueChange/items/defaultValue/disabled etc.
function Select<Value, Multiple extends boolean | undefined = false>(
  props: BaseSelect.Root.Props<Value, Multiple>,
) {
  return <BaseSelect.Root {...props} />
}

// Trigger — usa a string de controle base + ícone ChevronsUpDown.
function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseSelect.Trigger>) {
  return (
    <BaseSelect.Trigger
      data-slot="select-trigger"
      className={cn(
        "flex h-9 w-full items-center justify-between gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground transition-[color,box-shadow,border-color] outline-none hover:border-foreground/20 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 disabled:cursor-not-allowed data-[invalid]:border-destructive data-[invalid]:ring-3 data-[invalid]:ring-destructive/20 data-[popup-open]:border-ring motion-reduce:transition-none [&>span]:line-clamp-1 [&>span]:text-left",
        className,
      )}
      {...props}
    >
      {children}
      <BaseSelect.Icon className="shrink-0">
        <ChevronsUpDown className="size-4 text-muted-foreground" />
      </BaseSelect.Icon>
    </BaseSelect.Trigger>
  )
}

// Valor selecionado (com placeholder).
function SelectValue({
  className,
  ...props
}: React.ComponentProps<typeof BaseSelect.Value>) {
  return (
    <BaseSelect.Value
      data-slot="select-value"
      className={cn("truncate", className)}
      {...props}
    />
  )
}

// Conteúdo do popup — Portal + Positioner + Popup.
function SelectContent({
  className,
  children,
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof BaseSelect.Popup> & {
  sideOffset?: number
}) {
  return (
    <BaseSelect.Portal>
      <BaseSelect.Positioner sideOffset={sideOffset} className="z-[160]">
        <BaseSelect.ScrollUpArrow className="flex h-6 items-center justify-center text-muted-foreground" />
        <BaseSelect.Popup
          data-slot="select-content"
          className={cn(
            "bg-popover bg-gradient-surface-raised rounded-lg border border-border shadow-lg ring-1 ring-foreground/10 p-1 origin-[var(--transform-origin)] transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] data-[starting-style]:opacity-0 data-[starting-style]:scale-95 data-[ending-style]:opacity-0 data-[ending-style]:scale-95 motion-reduce:transition-none max-h-[var(--available-height)] min-w-[var(--anchor-width)] overflow-y-auto",
            className,
          )}
          {...props}
        >
          {children}
        </BaseSelect.Popup>
        <BaseSelect.ScrollDownArrow className="flex h-6 items-center justify-center text-muted-foreground" />
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  )
}

// Item da lista — texto + indicador Check à direita.
function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseSelect.Item>) {
  return (
    <BaseSelect.Item
      data-slot="select-item"
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-md px-2 py-2 pr-8 text-sm outline-none data-[highlighted]:bg-muted data-[highlighted]:text-foreground data-[disabled]:opacity-40 data-[disabled]:pointer-events-none min-h-[40px]",
        className,
      )}
      {...props}
    >
      <BaseSelect.ItemText className="flex-1 truncate">
        {children}
      </BaseSelect.ItemText>
      <BaseSelect.ItemIndicator className="absolute right-2 flex items-center justify-center">
        <Check className="size-4" />
      </BaseSelect.ItemIndicator>
    </BaseSelect.Item>
  )
}

// Grupo de itens com rótulo.
function SelectGroup({
  className,
  ...props
}: React.ComponentProps<typeof BaseSelect.Group>) {
  return (
    <BaseSelect.Group
      data-slot="select-group"
      className={className}
      {...props}
    />
  )
}

function SelectGroupLabel({
  className,
  ...props
}: React.ComponentProps<typeof BaseSelect.GroupLabel>) {
  return (
    <BaseSelect.GroupLabel
      data-slot="select-group-label"
      className={cn("px-2 py-1.5 text-xs font-medium text-muted-foreground", className)}
      {...props}
    />
  )
}

// Separador entre grupos.
function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof BaseSelect.Separator>) {
  return (
    <BaseSelect.Separator
      data-slot="select-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectGroupLabel,
  SelectSeparator,
}
