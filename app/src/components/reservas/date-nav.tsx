'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

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

function formatarDiaSemana(date: string): string {
  const [ano, mes, dia] = date.split('-').map(Number)
  const d = new Date(ano, mes - 1, dia)
  return d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')
}

function formatarDataLonga(date: string): string {
  const [ano, mes, dia] = date.split('-').map(Number)
  const d = new Date(ano, mes - 1, dia)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })
}

export function DateNav({ currentDate }: DateNavProps) {
  const router = useRouter()
  const hoje = hojeStr()
  const isHoje = currentDate === hoje

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

      <div className="flex flex-1 flex-col items-center gap-0.5">
        <span className="text-xs text-b3 capitalize">{formatarDiaSemana(currentDate)}</span>
        <span className="text-sm font-semibold text-b1">{formatarDataLonga(currentDate)}</span>
        {isHoje ? (
          <span className="text-xs font-semibold text-primary">Hoje</span>
        ) : (
          <button
            type="button"
            onClick={() => navegar(hoje)}
            className={cn('text-xs underline underline-offset-2 text-primary')}
          >
            Hoje
          </button>
        )}
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
