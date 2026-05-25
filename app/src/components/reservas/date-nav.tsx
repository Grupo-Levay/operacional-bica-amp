'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface DateNavProps {
  currentDate: string
}

/** Soma `dias` a uma data 'YYYY-MM-DD' e retorna no mesmo formato. */
function shiftDate(date: string, dias: number): string {
  const [ano, mes, dia] = date.split('-').map(Number)
  const d = new Date(ano, mes - 1, dia)
  d.setDate(d.getDate() + dias)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

function hojeStr(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

function formatarLabel(date: string): string {
  const [ano, mes, dia] = date.split('-').map(Number)
  const d = new Date(ano, mes - 1, dia)
  const texto = d.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  })
  // Remove pontos abreviativos (ex: "seg., 25 de mai.") deixando "seg, 25 mai".
  return texto.replace(/\./g, '').replace(/ de /g, ' ')
}

export function DateNav({ currentDate }: DateNavProps) {
  const router = useRouter()

  function navegar(date: string) {
    router.push(`/reservas?data=${date}`)
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <button
        type="button"
        aria-label="Dia anterior"
        onClick={() => navegar(shiftDate(currentDate, -1))}
        className="flex items-center justify-center rounded-lg border border-border bg-background transition-colors hover:bg-muted min-w-[52px] min-h-[52px]"
      >
        <ChevronLeft size={20} aria-hidden="true" />
      </button>

      <div className="flex flex-1 flex-col items-center">
        <span
          className="text-sm font-medium capitalize text-b2"
        >
          {formatarLabel(currentDate)}
        </span>
        <button
          type="button"
          onClick={() => navegar(hojeStr())}
          className="text-xs underline underline-offset-2 text-primary"
        >
          Hoje
        </button>
      </div>

      <button
        type="button"
        aria-label="Próximo dia"
        onClick={() => navegar(shiftDate(currentDate, 1))}
        className="flex items-center justify-center rounded-lg border border-border bg-background transition-colors hover:bg-muted min-w-[52px] min-h-[52px]"
      >
        <ChevronRight size={20} aria-hidden="true" />
      </button>
    </div>
  )
}
