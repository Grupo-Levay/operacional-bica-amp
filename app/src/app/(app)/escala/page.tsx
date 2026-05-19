import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EscalaGrid } from '@/components/escala/escala-grid'
import { getCurrentCasa } from '@/lib/tenant'
import { getTodayISO } from '@/lib/utils'

async function getEscalaData(casa: string, inicioStr: string, fimStr: string) {
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    const [{ data: membros }, { data: escala }, { data: member }] = await Promise.all([
      supabase.from('equipe').select('*').eq('casa', casa).eq('ativo', true).order('nome'),
      supabase
        .from('escala')
        .select('*, equipe(nome, funcao)')
        .eq('casa', casa)
        .gte('data', inicioStr)
        .lte('data', fimStr),
      user
        ? supabase.from('team_members').select('role').eq('id', user.id).maybeSingle()
        : Promise.resolve({ data: null }),
    ])

    return {
      membros: membros ?? [],
      escala: escala ?? [],
      isAdmin: member?.role === 'admin',
    }
  } catch {
    return { membros: [], escala: [], isAdmin: false }
  }
}

// constrói datas sem usar new Date() em timezone local — evita skew de 1 dia
function addDays(isoDate: string, days: number): string {
  const [y, m, d] = isoDate.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d + days))
  return dt.toISOString().split('T')[0]
}

function buildSemana(inicioStr: string): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const iso = addDays(inicioStr, i)
    const [y, m, d] = iso.split('-').map(Number)
    return new Date(Date.UTC(y, m - 1, d))
  })
}

function formatRange(inicioStr: string, fimStr: string): string {
  const fmt = (iso: string) => {
    const [y, m, d] = iso.split('-').map(Number)
    return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short',
      timeZone: 'UTC',
    })
  }
  return `${fmt(inicioStr)} – ${fmt(fimStr)}`
}

type Props = { searchParams: Promise<{ semana?: string }> }

export default async function EscalaPage({ searchParams }: Props) {
  const [casa, { semana }] = await Promise.all([getCurrentCasa(), searchParams])

  const hoje = getTodayISO()
  const inicioStr = semana ?? hoje
  const fimStr = addDays(inicioStr, 6)

  const semanaAnterior = addDays(inicioStr, -7)
  const proximaSemana = addDays(inicioStr, 7)

  const { membros, escala, isAdmin } = await getEscalaData(casa, inicioStr, fimStr)
  const casaColor = casa === 'bica' ? 'var(--color-bica)' : 'var(--color-amp)'
  const dias = buildSemana(inicioStr)

  const isHojeSemana = inicioStr === hoje

  return (
    <main className="p-4 space-y-4 pb-24">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold" style={{ color: casaColor }}>
            Escala
          </h1>
          <p className="text-sm text-muted-foreground capitalize">
            {formatRange(inicioStr, fimStr)}
          </p>
        </div>

        {/* Navegação semanal */}
        <div className="flex items-center gap-1">
          <a
            href={`/escala?semana=${semanaAnterior}`}
            className="flex items-center justify-center size-8 rounded-full border hover:bg-muted"
            aria-label="Semana anterior"
          >
            <ChevronLeft size={16} />
          </a>
          {!isHojeSemana && (
            <a
              href="/escala"
              className="text-xs px-2 py-1 rounded border hover:bg-muted"
            >
              Hoje
            </a>
          )}
          <a
            href={`/escala?semana=${proximaSemana}`}
            className="flex items-center justify-center size-8 rounded-full border hover:bg-muted"
            aria-label="Próxima semana"
          >
            <ChevronRight size={16} />
          </a>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {membros.length} membro{membros.length !== 1 ? 's' : ''} ativo{membros.length !== 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EscalaGrid membros={membros} escala={escala} dias={dias} isAdmin={isAdmin} />
        </CardContent>
      </Card>
    </main>
  )
}
