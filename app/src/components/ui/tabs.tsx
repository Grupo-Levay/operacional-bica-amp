"use client"

import * as React from "react"
import { Tabs as BaseTabs } from "@base-ui/react/tabs"

import { cn } from "@/lib/utils"

// Tabs sobre Base UI. Indicador deslizante usa as CSS vars expostas pelo
// TabsIndicator: --active-tab-left / --active-tab-width / --active-tab-height.
// Estado ativo do Tab é exposto como data-active (NÃO data-selected).

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof BaseTabs.Root>) {
  return (
    <BaseTabs.Root
      data-slot="tabs"
      className={cn("flex flex-col", className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof BaseTabs.List>) {
  return (
    <BaseTabs.List
      data-slot="tabs-list"
      className={cn(
        "relative inline-flex items-center gap-1 rounded-lg bg-muted/60 p-1",
        className
      )}
      {...props}
    />
  )
}

// Pílula deslizante posicionada via CSS vars do Base UI.
function TabsIndicator({
  className,
  ...props
}: React.ComponentProps<typeof BaseTabs.Indicator>) {
  return (
    <BaseTabs.Indicator
      data-slot="tabs-indicator"
      className={cn(
        "absolute top-1/2 left-[var(--active-tab-left)] h-[calc(var(--active-tab-height)-0.5rem)] w-[var(--active-tab-width)] -translate-y-1/2 rounded-md bg-card shadow-sm ring-1 ring-foreground/10 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  )
}

function TabsTab({
  className,
  ...props
}: React.ComponentProps<typeof BaseTabs.Tab>) {
  return (
    <BaseTabs.Tab
      data-slot="tabs-tab"
      className={cn(
        "relative z-10 inline-flex min-h-[40px] cursor-pointer items-center justify-center rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors data-[active]:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  )
}

function TabsPanel({
  className,
  ...props
}: React.ComponentProps<typeof BaseTabs.Panel>) {
  return (
    <BaseTabs.Panel
      data-slot="tabs-panel"
      className={cn("mt-4 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsIndicator, TabsTab, TabsPanel }
