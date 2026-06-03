'use client'

import { CheckSquare, Package, RefreshCw, Users, AlertTriangle } from 'lucide-react'
import { StatCard } from './stat-card'
import { QuickActions } from './quick-actions'
import { ManagerFeed, type CriticalItem, type ScaleMember } from './manager-feed'
import { ProgressRing } from '@/components/ui/progress-ring'
import { useBrand } from '@/hooks/use-brand'
import { META_CMV, cmvSeveridade } from '@/lib/dashboard-metrics'

interface DashboardContentProps {
  initialData: {
    totalChecklists: number
    concluidosHoje: number
    rodadasCount: number
    equipeCount: number
    criticalList: CriticalItem[]
    scaleList: ScaleMember[]
    mediaCmv: number | null
  }
  dataHoje: string
}

export function DashboardContent({ initialData, dataHoje }: DashboardContentProps) {
  const brand = useBrand()

  const pendentes = Math.max(0, initialData.totalChecklists - initialData.concluidosHoje)
  const checklistPercentage = initialData.totalChecklists
    ? Math.round((initialData.concluidosHoje / initialData.totalChecklists) * 100)
    : 100

  const criticosCount = initialData.criticalList.length

  const cmv = initialData.mediaCmv
  const cmvSev = cmvSeveridade(cmv)
  const cmvLabel = cmv !== null ? `${cmv.toFixed(1)}%` : '—'
  const cmvBarWidth = cmv !== null ? Math.min(100, (cmv / 50) * 100) : 0
  const cmvCaption =
    cmv === null
      ? 'Sem fichas com CMV calculável ainda.'
      : cmv <= META_CMV
        ? `Dentro da meta de ${META_CMV}%.`
        : `Acima da meta de ${META_CMV}%.`

  return (
    <div className="grid grid-cols-1 xl:grid-cols-10 gap-6 p-4 md:p-6 pb-24 md:pb-6">
      {/* Coluna Esquerda: Estatísticas e Ações (7 colunas no desktop) */}
      <div className="xl:col-span-7 space-y-6">
        {/* Header com Switcher Contextual de Visualização */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
              {brand === 'bica' ? 'Bica Bar' : 'AMP 213'}
              <span className="ml-2 text-xs font-semibold text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                Operacional
              </span>
            </h1>
            <p className="text-xs font-medium text-muted-foreground capitalize">{dataHoje}</p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-white/5 border border-white/5 px-3 py-1.5 rounded-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            Conexão Supabase OK
          </div>
        </div>

        {/* Grid de Estatísticas */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard
            label="Checklists Diários"
            value={`${initialData.concluidosHoje}/${initialData.totalChecklists}`}
            sub={
              pendentes === 0
                ? 'Todos concluídos'
                : `${pendentes} pendente${pendentes !== 1 ? 's' : ''} hoje`
            }
            accent={pendentes > 0 ? 'warning' : 'success'}
            icon={<CheckSquare />}
            visualIndicator={
              <ProgressRing
                value={checklistPercentage}
                accent={pendentes > 0 ? 'warning' : 'success'}
              />
            }
          />

          <StatCard
            label="Itens Críticos de Estoque"
            value={criticosCount}
            sub={criticosCount === 0 ? 'Estoque completo' : 'Abaixo do nível mínimo'}
            accent={criticosCount > 0 ? 'danger' : 'success'}
            icon={<Package />}
            visualIndicator={
              criticosCount > 0 ? (
                <div className="h-10 w-10 rounded-full bg-danger/10 flex items-center justify-center text-danger border border-danger/20 pulse-glow-primary">
                  <AlertTriangle className="size-5" />
                </div>
              ) : null
            }
          />

          <StatCard
            label="Rodadas de Compras"
            value={initialData.rodadasCount > 0 ? initialData.rodadasCount : '—'}
            sub={
              initialData.rodadasCount > 0
                ? 'Rodada ativa em andamento'
                : 'Nenhuma rodada aberta'
            }
            accent={initialData.rodadasCount > 0 ? 'primary' : undefined}
            icon={<RefreshCw />}
            visualIndicator={
              initialData.rodadasCount > 0 ? (
                <div className="animate-spin duration-3000 text-primary">
                  <RefreshCw className="size-5" />
                </div>
              ) : null
            }
          />

          <StatCard
            label="Equipe Ativa"
            value={initialData.equipeCount}
            sub="Membros em serviço"
            icon={<Users />}
            visualIndicator={
              <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground border border-white/5">
                <Users className="size-5" />
              </div>
            }
          />
        </section>

        <QuickActions cmvSev={cmvSev} cmvLabel={cmvLabel} cmvCaption={cmvCaption} />
      </div>

      {/* Coluna Direita: Feed do Gerente (3 colunas no desktop) */}
      <div className="xl:col-span-3 space-y-6">
        <ManagerFeed
          criticalList={initialData.criticalList}
          scaleList={initialData.scaleList}
          cmvSev={cmvSev}
          cmvLabel={cmvLabel}
          cmvCaption={cmvCaption}
          cmvBarWidth={cmvBarWidth}
        />
      </div>
    </div>
  )
}
