import * as React from "react"

import { cn } from "@/lib/utils"

function Card({
  className,
  size = "default",
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & {
  size?: "default" | "sm"
  /**
   * default     — superfície com gradiente sutil + sombra dark + hairline.
   * interactive — adiciona hover lift + glow âmbar (use em cards clicáveis).
   * flat        — sem gradiente/sombra (legado / cards aninhados).
   */
  variant?: "default" | "interactive" | "flat"
}) {
  return (
    <div
      data-slot="card"
      data-size={size}
      data-variant={variant}
      className={cn(
        // v3: profundidade real — gradiente ink2→ink3, sombra dark densa, ring + hairline interno.
        "group/card flex flex-col gap-4 overflow-hidden rounded-xl text-sm text-card-foreground transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
        "py-4 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0",
        // default + interactive compartilham a base com profundidade
        "data-[variant=default]:bg-card data-[variant=default]:bg-gradient-surface data-[variant=default]:shadow-md data-[variant=default]:shadow-inner-hairline data-[variant=default]:ring-1 data-[variant=default]:ring-foreground/10",
        "data-[variant=interactive]:bg-card data-[variant=interactive]:bg-gradient-surface data-[variant=interactive]:shadow-md data-[variant=interactive]:ring-1 data-[variant=interactive]:ring-foreground/10 data-[variant=interactive]:cursor-pointer [@media(hover:hover)]:data-[variant=interactive]:hover:-translate-y-0.5 [@media(hover:hover)]:data-[variant=interactive]:hover:shadow-glow-brand-sm [@media(hover:hover)]:data-[variant=interactive]:hover:ring-primary/30 motion-reduce:data-[variant=interactive]:hover:translate-y-0",
        // flat = comportamento legado (sem gradiente/sombra)
        "data-[variant=flat]:bg-card data-[variant=flat]:ring-1 data-[variant=flat]:ring-foreground/10",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-4 group-data-[size=sm]/card:px-3 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-4 group-data-[size=sm]/card:px-3", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-b-xl border-t bg-muted/50 p-4 group-data-[size=sm]/card:p-3",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
