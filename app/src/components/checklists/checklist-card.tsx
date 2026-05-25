'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

type ChecklistCardProps = {
  id: string
  nome: string
  turno: string
  totalItens: number
  itensConcluidos: number
}

export function ChecklistCard({
  id,
  nome,
  turno,
  totalItens,
  itensConcluidos,
}: ChecklistCardProps) {
  const percent = totalItens > 0 ? Math.round((itensConcluidos / totalItens) * 100) : 0
  const isAbertura = turno.toLowerCase() === 'abertura'
  const borderClass = isAbertura ? 'border-l-4 border-l-bica' : 'border-l-4 border-l-amp'
  const badgeClass = isAbertura ? 'border-bica text-bica' : 'border-amp text-amp'

  return (
    <Card className={cn('rounded-lg border shadow-sm', borderClass)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-semibold leading-tight">{nome}</CardTitle>
          <Badge
            variant="outline"
            className={cn('shrink-0 text-xs capitalize', badgeClass)}
          >
            {turno}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{itensConcluidos} de {totalItens} itens</span>
            <span>{percent}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                isAbertura ? 'bg-bica' : 'bg-amp',
              )}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          render={<Link href={`/checklists/${id}`} />}
        >
          Abrir →
        </Button>
      </CardContent>
    </Card>
  )
}
