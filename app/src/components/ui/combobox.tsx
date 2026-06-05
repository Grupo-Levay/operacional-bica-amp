"use client"

// Combobox: busca/autocomplete (Base UI) com filtragem e teclado nativos.
// Uso típico: ingredientes, mesas, categorias.
import * as React from "react"
import { Combobox as BaseCombobox } from "@base-ui/react/combobox"
import { Check, Search } from "lucide-react"
import { cn } from "@/lib/utils"

// Raiz — genérica em Value/Multiple, igual ao Select (repassa items/value/etc).
function Combobox<Value, Multiple extends boolean | undefined = false>(
  props: BaseCombobox.Root.Props<Value, Multiple>,
) {
  return <BaseCombobox.Root {...props} />
}

// Input de busca — estilo controle base + ícone Search opcional à esquerda.
function ComboboxInput({
  className,
  showIcon = true,
  ...props
}: React.ComponentProps<typeof BaseCombobox.Input> & {
  showIcon?: boolean
}) {
  return (
    <div data-slot="combobox-input-wrapper" className="relative w-full">
      {showIcon ? (
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      ) : null}
      <BaseCombobox.Input
        data-slot="combobox-input"
        className={cn(
          "h-9 w-full rounded-md border border-border bg-background py-2 text-sm text-foreground transition-[color,box-shadow,border-color] outline-none placeholder:text-muted-foreground hover:border-foreground/20 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 disabled:cursor-not-allowed data-[invalid]:border-destructive data-[invalid]:ring-3 data-[invalid]:ring-destructive/20 motion-reduce:transition-none",
          showIcon ? "pl-9 pr-3" : "px-3",
          className,
        )}
        {...props}
      />
    </div>
  )
}

// Conteúdo do popup — Portal + Positioner + Popup + List.
function ComboboxContent({
  className,
  children,
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof BaseCombobox.Popup> & {
  sideOffset?: number
}) {
  return (
    <BaseCombobox.Portal>
      <BaseCombobox.Positioner sideOffset={sideOffset} className="z-50">
        <BaseCombobox.Popup
          data-slot="combobox-content"
          className={cn(
            "bg-popover bg-gradient-surface-raised rounded-lg border border-border shadow-lg ring-1 ring-foreground/10 p-1 origin-[var(--transform-origin)] transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] data-[starting-style]:opacity-0 data-[starting-style]:scale-95 data-[ending-style]:opacity-0 data-[ending-style]:scale-95 motion-reduce:transition-none max-h-[min(var(--available-height),20rem)] min-w-[var(--anchor-width)] overflow-y-auto",
            className,
          )}
          {...props}
        >
          <BaseCombobox.List>{children}</BaseCombobox.List>
        </BaseCombobox.Popup>
      </BaseCombobox.Positioner>
    </BaseCombobox.Portal>
  )
}

// Item da lista — texto + indicador Check à direita.
function ComboboxItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseCombobox.Item>) {
  return (
    <BaseCombobox.Item
      data-slot="combobox-item"
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-md px-2 py-2 pr-8 text-sm outline-none data-[highlighted]:bg-muted data-[highlighted]:text-foreground data-[disabled]:opacity-40 data-[disabled]:pointer-events-none min-h-[40px]",
        className,
      )}
      {...props}
    >
      <span className="flex-1 truncate">{children}</span>
      <BaseCombobox.ItemIndicator className="absolute right-2 flex items-center justify-center">
        <Check className="size-4" />
      </BaseCombobox.ItemIndicator>
    </BaseCombobox.Item>
  )
}

// Mensagem quando nenhum item bate com a busca.
function ComboboxEmpty({
  className,
  children = "Nenhum resultado",
  ...props
}: React.ComponentProps<typeof BaseCombobox.Empty>) {
  return (
    <BaseCombobox.Empty
      data-slot="combobox-empty"
      className={cn("px-2 py-3 text-center text-sm text-muted-foreground", className)}
      {...props}
    >
      {children}
    </BaseCombobox.Empty>
  )
}

// Grupo de itens com rótulo.
function ComboboxGroup({
  className,
  ...props
}: React.ComponentProps<typeof BaseCombobox.Group>) {
  return (
    <BaseCombobox.Group
      data-slot="combobox-group"
      className={className}
      {...props}
    />
  )
}

function ComboboxGroupLabel({
  className,
  ...props
}: React.ComponentProps<typeof BaseCombobox.GroupLabel>) {
  return (
    <BaseCombobox.GroupLabel
      data-slot="combobox-group-label"
      className={cn("px-2 py-1.5 text-xs font-medium text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
}
