import Link from 'next/link'
import {
  CheckSquare,
  Package,
  RefreshCw,
  Calendar,
  ChefHat,
  TrendingUp,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CmvSeveridade } from '@/lib/dashboard-metrics'
import type { LucideIcon } from 'lucide-react'

const cmvText: Record<CmvSeveridade, string> = {
  ok: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
  muted: 'text-muted-foreground',
}

// v3: profundidade real (gradiente de superfície + sombra dark + hairline + ring)
// com lift e glow âmbar dinâmico no hover; respeita ponteiro fino e reduced-motion.
const cardClass =
  'group relative flex flex-col justify-between p-4 rounded-xl bg-gradient-surface shadow-md shadow-inner-hairline ring-1 ring-foreground/10 transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] [@media(hover:hover)]:hover:-translate-y-0.5 [@media(hover:hover)]:hover:shadow-glow-brand-sm [@media(hover:hover)]:hover:ring-primary/30 active:translate-y-0 motion-reduce:hover:translate-y-0'

interface Acao {
  href: string
  icon: LucideIcon
  titulo: string
  desc: string
}

const acoes: Acao[] = [
  { href: '/checklists', icon: CheckSquare, titulo: 'Checklists', desc: 'Preencher vistorias de turno' },
  { href: '/compras', icon: RefreshCw, titulo: 'Compras', desc: 'Ver e criar rodadas ativas' },
  { href: '/estoque', icon: Package, titulo: 'Estoque', desc: 'Fazer contagem de garrafas' },
  { href: '/escala', icon: Calendar, titulo: 'Escala Diária', desc: 'Confirmar equipe e turnos' },
  { href: '/fichas', icon: ChefHat, titulo: 'Fichas Técnicas', desc: 'Verificar receitas e CMV' },
]

interface QuickActionsProps {
  cmvSev: CmvSeveridade
  cmvLabel: string
  cmvCaption: string
}

export function QuickActions({ cmvSev, cmvLabel, cmvCaption }: QuickActionsProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
        Painel de Ações Rápidas
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {acoes.map(({ href, icon: Icon, titulo, desc }) => (
          <Link key={titulo} href={href} className={cardClass}>
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                <Icon className="size-5" />
              </div>
              <ChevronRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-foreground">{titulo}</h3>
              <p className="text-[11px] text-muted-foreground">{desc}</p>
            </div>
          </Link>
        ))}

        {/* Card especial: Metas & CMV — conteúdo derivado da severidade. */}
        <Link href="/fichas" className={cardClass}>
          <div className="flex justify-between items-start">
            <div className={cn('p-2 rounded-lg bg-primary/10', cmvText[cmvSev])}>
              <TrendingUp className="size-5" />
            </div>
            <ChevronRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-foreground">
              Metas & CMV{' '}
              <span className={cn('font-bold tabular-nums', cmvText[cmvSev])}>{cmvLabel}</span>
            </h3>
            <p className="text-[11px] text-muted-foreground">{cmvCaption}</p>
          </div>
        </Link>
      </div>
    </section>
  )
}
