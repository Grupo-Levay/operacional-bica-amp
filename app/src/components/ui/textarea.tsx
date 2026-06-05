// Textarea: <textarea> nativo estilizado reusando a string de controle base.
import * as React from "react"
import { cn } from "@/lib/utils"

// Const interna compartilhada deste arquivo (string de controle base).
const textareaBase =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground transition-[color,box-shadow,border-color] outline-none placeholder:text-muted-foreground hover:border-foreground/20 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 disabled:cursor-not-allowed data-[invalid]:border-destructive data-[invalid]:ring-3 data-[invalid]:ring-destructive/20 motion-reduce:transition-none"

function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        textareaBase,
        "min-h-[72px] h-auto resize-y leading-normal",
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
