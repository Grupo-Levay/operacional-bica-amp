'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  CheckSquare, 
  Package, 
  RefreshCw, 
  Users, 
  AlertTriangle, 
  ChevronRight, 
  Calendar, 
  ChefHat,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { StatCard } from './stat-card';
import { ProgressRing } from '@/components/ui/progress-ring';
import { LevelBar } from '@/components/ui/level-bar';
import { cn } from '@/lib/utils';

interface CriticalItem {
  nome: string;
  atual: number;
  minimo: number;
  unidade: string;
}

interface ScaleMember {
  confirmado: boolean;
  turno: string;
  nome: string;
  funcao: string;
}

interface DashboardContentProps {
  initialData: {
    totalChecklists: number;
    concluidosHoje: number;
    rodadasCount: number;
    equipeCount: number;
    criticalList: CriticalItem[];
    scaleList: ScaleMember[];
  };
  dataHoje: string;
}

export function DashboardContent({ initialData, dataHoje }: DashboardContentProps) {
  const [brand, setBrand] = useState<'bica' | 'amp'>('bica');
  
  useEffect(() => {
    const updateBrand = () => {
      const savedBrand = localStorage.getItem('bica-brand') as 'bica' | 'amp';
      if (savedBrand) {
        setBrand(savedBrand);
      }
    };

    updateBrand();
    window.addEventListener('brandchange', updateBrand);
    return () => window.removeEventListener('brandchange', updateBrand);
  }, []);

  const pendentes = Math.max(0, initialData.totalChecklists - initialData.concluidosHoje);
  const checklistPercentage = initialData.totalChecklists 
    ? Math.round((initialData.concluidosHoje / initialData.totalChecklists) * 100) 
    : 100;
  
  const criticosCount = initialData.criticalList.length;

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
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Conexão Supabase OK
          </div>
        </div>

        {/* Grid de Estatísticas */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard
            label="Checklists Diários"
            value={`${initialData.concluidosHoje}/${initialData.totalChecklists}`}
            sub={pendentes === 0 ? "Todos concluídos" : `${pendentes} pendente${pendentes !== 1 ? 's' : ''} hoje`}
            accent={pendentes > 0 ? "warning" : "success"}
            icon={<CheckSquare />}
            visualIndicator={
              <ProgressRing
                value={checklistPercentage}
                accent={pendentes > 0 ? "warning" : "success"}
              />
            }
          />
          
          <StatCard
            label="Itens Críticos de Estoque"
            value={criticosCount}
            sub={criticosCount === 0 ? "Estoque completo" : "Abaixo do nível mínimo"}
            accent={criticosCount > 0 ? "danger" : "success"}
            icon={<Package />}
            visualIndicator={
              criticosCount > 0 ? (
                <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center text-danger border border-danger/20 pulse-glow-primary">
                  <AlertTriangle className="size-5" />
                </div>
              ) : null
            }
          />

          <StatCard
            label="Rodadas de Compras"
            value={initialData.rodadasCount > 0 ? initialData.rodadasCount : "—"}
            sub={initialData.rodadasCount > 0 ? "Rodada ativa em andamento" : "Nenhuma rodada aberta"}
            accent={initialData.rodadasCount > 0 ? "primary" : undefined}
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

        {/* Painel de Ações Rápidas (Grid de POS Admin) */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Painel de Ações Rápidas</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            
            <Link
              href="/checklists"
              className="group relative flex flex-col justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all hover:scale-[1.02] hover:-translate-y-0.5 active:scale-95 duration-200"
            >
              <div className="flex justify-between items-start">
                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                  <CheckSquare className="size-5" />
                </div>
                <ChevronRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-foreground">Checklists</h3>
                <p className="text-[11px] text-muted-foreground">Preencher vistorias de turno</p>
              </div>
            </Link>

            <Link
              href="/compras"
              className="group relative flex flex-col justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all hover:scale-[1.02] hover:-translate-y-0.5 active:scale-95 duration-200"
            >
              <div className="flex justify-between items-start">
                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                  <RefreshCw className="size-5" />
                </div>
                <ChevronRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-foreground">Compras</h3>
                <p className="text-[11px] text-muted-foreground">Ver e criar rodadas ativas</p>
              </div>
            </Link>

            <Link
              href="/estoque"
              className="group relative flex flex-col justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all hover:scale-[1.02] hover:-translate-y-0.5 active:scale-95 duration-200"
            >
              <div className="flex justify-between items-start">
                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                  <Package className="size-5" />
                </div>
                <ChevronRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-foreground">Estoque</h3>
                <p className="text-[11px] text-muted-foreground">Fazer contagem de garrafas</p>
              </div>
            </Link>

            <Link
              href="/escala"
              className="group relative flex flex-col justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all hover:scale-[1.02] hover:-translate-y-0.5 active:scale-95 duration-200"
            >
              <div className="flex justify-between items-start">
                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                  <Calendar className="size-5" />
                </div>
                <ChevronRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-foreground">Escala Diária</h3>
                <p className="text-[11px] text-muted-foreground">Confirmar equipe e turnos</p>
              </div>
            </Link>

            <Link
              href="/fichas"
              className="group relative flex flex-col justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all hover:scale-[1.02] hover:-translate-y-0.5 active:scale-95 duration-200"
            >
              <div className="flex justify-between items-start">
                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                  <ChefHat className="size-5" />
                </div>
                <ChevronRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-foreground">Fichas Técnicas</h3>
                <p className="text-[11px] text-muted-foreground">Verificar receitas e CMV</p>
              </div>
            </Link>
            
            <div className="relative flex flex-col justify-between p-4 rounded-xl border border-white/5 bg-black/10">
              <div className="flex justify-between items-start">
                <div className="p-2 rounded-lg bg-white/5 text-muted-foreground">
                  <TrendingUp className="size-5" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-muted-foreground">Metas & CMV</h3>
                <p className="text-[11px] text-muted-foreground/60">Análise em breve</p>
              </div>
            </div>

          </div>
        </section>
      </div>

      {/* Coluna Direita: Painel POS de Detalhes do Sistema (3 colunas no desktop) */}
      <div className="xl:col-span-3 space-y-6">
        
        {/* Painel lateral de Status e Monitoramento */}
        <aside className="glass-card border border-white/5 rounded-2xl p-4 space-y-5 h-full">
          <div>
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Feed do Gerente</h2>
            <p className="text-[10px] text-muted-foreground/80 mt-0.5">Alertas críticos do estabelecimento</p>
          </div>
          
          {/* Status de Alerta de Estoque */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Package size={14} className="text-primary" />
              Rupturas de Estoque ({criticosCount})
            </h3>
            
            {criticosCount > 0 ? (
              <ul className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {initialData.criticalList.slice(0, 5).map((item, idx) => (
                  <li key={idx} className="p-2 rounded-lg bg-danger-bg border border-danger/10 text-xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-foreground truncate max-w-[120px]">{item.nome}</span>
                      <span className="text-danger font-mono font-bold text-[11px]">
                        {item.atual} <span className="text-muted-foreground font-normal">/ {item.minimo} {item.unidade}</span>
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
              <div className="p-3 text-center rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-[11px] text-emerald-500 font-medium">
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
            
            {initialData.scaleList.length > 0 ? (
              <ul className="space-y-2">
                {initialData.scaleList.map((membro, idx) => (
                  <li key={idx} className="flex justify-between items-center p-2 rounded-lg bg-white/[0.02] border border-white/5 text-xs">
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground">{membro.nome}</span>
                      <span className="text-[10px] text-muted-foreground">{membro.funcao}</span>
                    </div>
                    <span className={cn(
                      "text-[9px] font-bold px-2 py-0.5 rounded-full",
                      membro.confirmado ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                    )}>
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

          {/* Resumo Financeiro Curto (Simulado para Visual de POS) */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <DollarSign size={14} className="text-primary" />
              Metas de CMV (Fichas)
            </h3>
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Média CMV Geral</span>
                <span className="font-bold text-emerald-400">28.4%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <p className="text-[10px] text-muted-foreground/60 leading-tight">CMV dentro da meta estipulada de 30%.</p>
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
}
