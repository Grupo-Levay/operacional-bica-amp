import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // v3: microinteração suave (hover lift sutil, active settle), focus-visible ring âmbar,
  // transição com easing premium. transform-gpu evita jank no lift/scale.
  "group/button relative inline-flex shrink-0 transform-gpu items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap outline-none select-none transition-[transform,box-shadow,background-color,color,opacity] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] [@media(hover:hover)]:hover:-translate-y-px focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-0 active:not-aria-[haspopup]:translate-y-px active:duration-75 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 motion-reduce:transition-none motion-reduce:hover:translate-y-0 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm [@media(hover:hover)]:hover:bg-primary/90 [@media(hover:hover)]:hover:shadow-glow-brand-sm active:bg-primary/95",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground hover:border-foreground/20 aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline [@media(hover:hover)]:hover:-translate-y-0",
        brand:
          "bg-bica text-bica-fg font-semibold shadow-sm [@media(hover:hover)]:hover:bg-bica-dark [@media(hover:hover)]:hover:shadow-glow-bica-sm active:bg-bica-dark active:opacity-95",
        // v3: CTA premium com gradiente de marca + glow âmbar + sheen sutil no topo
        gradient:
          "bg-gradient-brand text-primary-foreground font-semibold shadow-glow-brand-sm before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-sheen before:opacity-70 [@media(hover:hover)]:hover:shadow-glow-brand [@media(hover:hover)]:hover:brightness-105 active:brightness-95",
        success:
          "bg-success/15 text-success hover:bg-success/25 focus-visible:border-success/40 focus-visible:ring-success/20",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        // v3: garante touch target WCAG 2.5.5 (min-h-[52px]) mesmo se conteúdo crescer
        cta: "h-[52px] min-h-[52px] w-full px-4 gap-2 text-base",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
