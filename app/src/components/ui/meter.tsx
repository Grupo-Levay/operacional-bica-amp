// Meter — medidor de nível (ex.: estoque) a11y-correto sobre Base UI.
// Composição: Root agrupa e provê aria-valuenow; Label/Value para header;
// Track (trilho) + Indicator (preenchimento). Sem estado próprio → server-safe.
// Severidade ('ok' | 'warning' | 'danger') deriva da razão value/max quando
// não informada explicitamente (<0.25 danger, <0.5 warning, senão ok).
import * as React from "react"
import { Meter as BaseMeter } from "@base-ui/react/meter"

import { cn } from "@/lib/utils"

type MeterSeverity = "ok" | "warning" | "danger"

// Cor do indicador por severidade.
const indicatorTone: Record<MeterSeverity, string> = {
  ok: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
}

interface MeterProps
  extends Omit<React.ComponentProps<typeof BaseMeter.Root>, "max"> {
  value: number
  min?: number
  max: number
  /** Rótulo acessível (também exibido no header). */
  label?: React.ReactNode
  /** Formata o texto exibido no MeterValue (recebe valor formatado + bruto). */
  getValueLabel?: (formattedValue: string, value: number) => React.ReactNode
  /** Severidade explícita; se omitida, deriva da razão value/max. */
  severity?: MeterSeverity
}

// Deriva severidade a partir da razão preenchida.
function deriveSeverity(value: number, min: number, max: number): MeterSeverity {
  const range = max - min
  const ratio = range > 0 ? (value - min) / range : 0
  if (ratio < 0.25) return "danger"
  if (ratio < 0.5) return "warning"
  return "ok"
}

function Meter({
  value,
  min = 0,
  max,
  label,
  getValueLabel,
  severity,
  className,
  ...props
}: MeterProps) {
  const tone = severity ?? deriveSeverity(value, min, max)

  return (
    <BaseMeter.Root
      data-slot="meter"
      value={value}
      min={min}
      max={max}
      className={cn("flex flex-col gap-1", className)}
      {...props}
    >
      {(label != null || getValueLabel != null) && (
        <div className="flex items-center justify-between gap-2">
          {label != null && (
            <BaseMeter.Label
              data-slot="meter-label"
              className="text-caption text-muted-foreground"
            >
              {label}
            </BaseMeter.Label>
          )}
          <BaseMeter.Value
            data-slot="meter-value"
            className="text-caption tabular-nums text-muted-foreground"
          >
            {getValueLabel != null
              ? (formatted, raw) => getValueLabel(formatted, raw)
              : null}
          </BaseMeter.Value>
        </div>
      )}

      <BaseMeter.Track
        data-slot="meter-track"
        className="h-2 w-full overflow-hidden rounded-full bg-muted"
      >
        <BaseMeter.Indicator
          data-slot="meter-indicator"
          data-severity={tone}
          className={cn(
            "h-full rounded-full transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
            indicatorTone[tone]
          )}
        />
      </BaseMeter.Track>
    </BaseMeter.Root>
  )
}

export { Meter }
export type { MeterProps, MeterSeverity }
