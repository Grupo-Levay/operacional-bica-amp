'use client'

// Dropdown menu sobre o Menu nativo do Base UI (focus, teclado e portal inclusos).
import * as React from 'react'
import { Menu } from '@base-ui/react/menu'
import { cva, type VariantProps } from 'class-variance-authority'
import { Check, MoreVertical } from 'lucide-react'

import { cn } from '@/lib/utils'

// Root — repassa open/onOpenChange/defaultOpen/modal.
function DropdownMenu(props: React.ComponentProps<typeof Menu.Root>) {
  return <Menu.Root data-slot="dropdown-menu" {...props} />
}

// Trigger — sem filhos vira um botão ghost com ícone MoreVertical.
function DropdownMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Menu.Trigger>) {
  return (
    <Menu.Trigger
      data-slot="dropdown-menu-trigger"
      className={cn(
        children
          ? undefined
          : 'inline-flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 aria-expanded:bg-muted aria-expanded:text-foreground motion-reduce:transition-none',
        className,
      )}
      {...props}
    >
      {children ?? <MoreVertical className="size-4" />}
    </Menu.Trigger>
  )
}

// Content — Portal + Positioner (ancorado à direita) + Popup com token de menu.
function DropdownMenuContent({
  className,
  children,
  sideOffset = 6,
  align = 'end',
  ...props
}: React.ComponentProps<typeof Menu.Popup> & {
  sideOffset?: number
  align?: 'start' | 'center' | 'end'
}) {
  return (
    <Menu.Portal>
      <Menu.Positioner sideOffset={sideOffset} align={align} className="z-[150]">
        <Menu.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            'min-w-[10rem] p-1 bg-popover bg-gradient-surface-raised rounded-lg border border-border shadow-lg ring-1 ring-foreground/10 origin-[var(--transform-origin)] transition-[opacity,transform] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] data-[starting-style]:opacity-0 data-[starting-style]:scale-95 data-[ending-style]:opacity-0 data-[ending-style]:scale-95 motion-reduce:transition-none',
            className,
          )}
          {...props}
        >
          {children}
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  )
}

const itemVariants = cva(
  'relative flex cursor-default select-none items-center gap-2 rounded-md px-2 py-2 text-sm min-h-[44px] outline-none data-[highlighted]:bg-muted data-[highlighted]:text-foreground data-[disabled]:opacity-40 data-[disabled]:pointer-events-none motion-reduce:transition-none',
  {
    variants: {
      variant: {
        default: '',
        destructive:
          'text-danger data-[highlighted]:bg-danger-bg data-[highlighted]:text-danger',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

interface DropdownMenuItemProps
  extends React.ComponentProps<typeof Menu.Item>,
    VariantProps<typeof itemVariants> {}

function DropdownMenuItem({ className, variant = 'default', ...props }: DropdownMenuItemProps) {
  return (
    <Menu.Item
      data-slot="dropdown-menu-item"
      className={cn(itemVariants({ variant }), className)}
      {...props}
    />
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Menu.Separator>) {
  return (
    <Menu.Separator
      data-slot="dropdown-menu-separator"
      className={cn('my-1 h-px bg-border', className)}
      {...props}
    />
  )
}

function DropdownMenuGroup(props: React.ComponentProps<typeof Menu.Group>) {
  return <Menu.Group data-slot="dropdown-menu-group" {...props} />
}

function DropdownMenuGroupLabel({
  className,
  ...props
}: React.ComponentProps<typeof Menu.GroupLabel>) {
  return (
    <Menu.GroupLabel
      data-slot="dropdown-menu-group-label"
      className={cn('px-2 py-1.5 text-xs text-muted-foreground', className)}
      {...props}
    />
  )
}

// Item com checkbox — indicador Check à esquerda.
function DropdownMenuCheckboxItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Menu.CheckboxItem>) {
  return (
    <Menu.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(itemVariants({ variant: 'default' }), 'pl-8', className)}
      {...props}
    >
      <Menu.CheckboxItemIndicator className="absolute left-2 flex items-center justify-center">
        <Check className="size-4" />
      </Menu.CheckboxItemIndicator>
      {children}
    </Menu.CheckboxItem>
  )
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuGroupLabel,
  DropdownMenuCheckboxItem,
}
