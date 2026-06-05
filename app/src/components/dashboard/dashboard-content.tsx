'use client'

import { CheckSquare, Package, RefreshCw, Users } from 'lucide-react'
import { BentoGrid } from './bento-grid'
import { QuickActions } from './quick-actions'
import { ManagerFeed, type CriticalItem, type ScaleMember } from './manager-feed'
import { StatCard } from '@/components/ui/stat-card'
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
    <main className="min-h-screen bg-background">
      <div className="p-4 md:p-6 space-y-8 pb-24 md:pb-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <h1 className="text-h1 font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
              {brand === 'bica' ? 'Bica Bar' : 'AMP 213'}
              <span className="ml-2 text-xs font-semibold text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                Operacional
              </span>
            </h1>
            <p className="text-caption font-medium text-muted-foreground capitalize">{dataHoje}</p>
          </div>

          <div className="flex items-center gap-2 text-caption font-medium text-muted-foreground bg-white/5 border border-white/5 px-3 py-1.5 rounded-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            Conexão OK
          </div>
        </div>

        {/* KPI Bento Grid */}
        <section className="space-y-2">
          <h2 className="text-label font-semibold text-muted-foreground uppercase tracking-wide">Métricas</h2>
          <BentoGrid>
            {/* Checklists — mantém o ProgressRing existente como mini-viz (children) */}
            <StatCard
              label="Checklists Diários"
              value={`${initialData.concluidosHoje}/${initialData.totalChecklists}`}
              icon={CheckSquare}
              accent={pendentes > 0 ? 'warning' : 'success'}
              hint={
                pendentes === 0
                  ? 'Todos concluídos'
                  : `${pendentes} pendente${pendentes !== 1 ? 's' : ''}`
              }
            >
              <ProgressRing
                value={checklistPercentage}
                size={48}
                accent={pendentes > 0 ? 'warning' : 'success'}
              />
            </StatCard>

            {/* Estoque crítico → danger quando há itens abaixo do mínimo, senão success */}
            <StatCard
              label="Estoque Crítico"
              value={criticosCount}
              icon={Package}
              accent={criticosCount > 0 ? 'danger' : 'success'}
              hint={criticosCount === 0 ? 'Níveis OK' : 'Abaixo do mínimo'}
            />

            <StatCard
              label="Compras Ativas"
              value={initialData.rodadasCount > 0 ? initialData.rodadasCount : '—'}
              icon={RefreshCw}
              accent="primary"
              hint={initialData.rodadasCount > 0 ? 'Rodada em andamento' : 'Nenhuma aberta'}
            />

            <StatCard
              label="Equipe em Serviço"
              value={initialData.equipeCount}
              icon={Users}
              accent="primary"
              hint="Membros ativos"
            />
          </BentoGrid>
        </section>

        {/* Quick Actions & Manager Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <QuickActions cmvSev={cmvSev} cmvLabel={cmvLabel} cmvCaption={cmvCaption} />
          </div>

          <div className="lg:col-span-2">
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
      </div>
    </main>
  )
}
