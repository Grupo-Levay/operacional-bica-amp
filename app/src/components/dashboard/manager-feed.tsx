import { Package, Users, DollarSign } from 'lucide-react'
import { LevelBar } from '@/components/ui/level-bar'
import { cn } from '@/lib/utils'
import type { CmvSeveridade } from '@/lib/dashboard-metrics'

export interface CriticalItem {
  nome: string
  atual: number
  minimo: number
  unidade: string
}

export interface ScaleMember {
  confirmado: boolean
  turno: string
  nome: string
  funcao: string
}

const cmvText: Record<CmvSeveridade, string> = {
  ok: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
  muted: 'text-muted-foreground',
}

const cmvBar: Record<CmvSeveridade, string> = {
  ok: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  muted: 'bg-muted-foreground',
}

interface ManagerFeedProps {
  criticalList: CriticalItem[]
  scaleList: ScaleMember[]
  cmvSev: CmvSeveridade
  cmvLabel: string
  cmvCaption: string
  cmvBarWidth: number
}

export function ManagerFeed({
  criticalList,
  scaleList,
  cmvSev,
  cmvLabel,
  cmvCaption,
  cmvBarWidth,
}: ManagerFeedProps) {
  const criticosCount = criticalList.length

  return (
    <aside className="glass-card border border-white/5 rounded-2xl p-4 space-y-5 h-full">
      <div>
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
          Feed do Gerente
        </h2>
        <p className="text-[10px] text-muted-foreground/80 mt-0.5">
          Alertas críticos do estabelecimento
        </p>
      </div>

      {/* Rupturas de Estoque */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <Package size={14} className="text-primary" />
          Rupturas de Estoque ({criticosCount})
        </h3>

        {criticosCount > 0 ? (
          <ul className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {criticalList.slice(0, 5).map((item, idx) => (
              <li
                key={idx}
                className="p-2 rounded-lg bg-danger-bg border border-danger/10 text-xs space-y-1.5"
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground truncate max-w-[120px]">
                    {item.nome}
                  </span>
                  <span className="text-danger font-mono font-bold text-[11px]">
                    {item.atual}{' '}
                    <span className="text-muted-foreground font-normal">
                      / {item.minimo} {item.unidade}
                    </span>
                  </span>
                </div>
                <LevelBar atual={item.atual} minimo={item.minimo} />
              </li>
            ))}
            {criticosCount > 5 && (
              <li className="text-center text-[10px] text-muted-foreground">
                e mais {criticosCount - 5} itens abaixo do mínimo.
              </li>
            )}
          </ul>
        ) : (
          <div className="p-3 text-center rounded-lg bg-success-bg border border-success/10 text-[11px] text-success font-medium">
            Tudo OK. Sem rupturas no estoque!
          </div>
        )}
      </div>

      <hr className="border-white/5" />

      {/* Equipe Escalada Hoje */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <Users size={14} className="text-primary" />
          Equipe Escalada Hoje
        </h3>

        {scaleList.length > 0 ? (
          <ul className="space-y-2">
            {scaleList.map((membro, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center p-2 rounded-lg bg-white/[0.02] border border-white/5 text-xs"
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-foreground">{membro.nome}</span>
                  <span className="text-[10px] text-muted-foreground">{membro.funcao}</span>
                </div>
                <span
                  className={cn(
                    'text-[9px] font-bold px-2 py-0.5 rounded-full',
                    membro.confirmado
                      ? 'bg-success-bg text-success border border-success/20'
                      : 'bg-warning-bg text-warning border border-warning/20',
                  )}
                >
                  {membro.confirmado ? 'Confirmado' : 'Pendente'}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center p-3 text-muted-foreground text-xs">
            Nenhum membro escalado para hoje.
          </div>
        )}
      </div>

      <hr className="border-white/5" />

      {/* Resumo Financeiro — CMV real das fichas ativas */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <DollarSign size={14} className="text-primary" />
          Metas de CMV (Fichas)
        </h3>
        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Média CMV Geral</span>
            <span className={cn('font-bold tabular-nums', cmvText[cmvSev])}>{cmvLabel}</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div
              className={cn('h-full rounded-full transition-all', cmvBar[cmvSev])}
              style={{ width: `${cmvBarWidth}%` }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground/60 leading-tight">{cmvCaption}</p>
        </div>
      </div>
    </aside>
  )
}
