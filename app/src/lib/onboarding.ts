import type { Role } from './roles'

export type OnboardingFeature = {
  icon: string
  label: string
  descricao: string
}

export type OnboardingConfig = {
  titulo: string
  subtitulo: string
  features: OnboardingFeature[]
}

const FEATURES_BY_ROUTE: Record<string, OnboardingFeature> = {
  '/dashboard': {
    icon: '🏠',
    label: 'Dashboard',
    descricao: 'Visão geral do dia: checklists, estoque e atividade recente.',
  },
  '/checklists': {
    icon: '✅',
    label: 'Checklists',
    descricao: 'Abertura, fechamento e rotinas do bar — tudo registrado.',
  },
  '/compras': {
    icon: '🛒',
    label: 'Compras',
    descricao: 'Lista de itens a comprar e controle de fornecedores.',
  },
  '/estoque': {
    icon: '📦',
    label: 'Estoque',
    descricao: 'Contagem de insumos, alertas de nível crítico e histórico.',
  },
  '/escala': {
    icon: '📅',
    label: 'Escala',
    descricao: 'Programação de turnos e gestão da equipe.',
  },
  '/fichas': {
    icon: '🍹',
    label: 'Fichas Técnicas',
    descricao: 'CMV, receitas e custos de cada item do cardápio.',
  },
}

const SAUDACOES: Record<Role, string> = {
  super_admin: 'Você tem acesso completo ao sistema.',
  admin:       'Você tem acesso completo ao sistema.',
  operacional: 'Seu foco é a operação diária do bar.',
  estoque:     'Seu foco é o controle de insumos e compras.',
  cmv:         'Seu foco é custo, receitas e eficiência.',
  bar:         'Seu foco é a abertura, fechamento e rotinas.',
}

export function getOnboardingConfig(role: Role, rotasPermitidas: string[]): OnboardingConfig {
  const features = rotasPermitidas
    .filter(r => FEATURES_BY_ROUTE[r])
    .map(r => FEATURES_BY_ROUTE[r])

  return {
    titulo: 'Tudo pronto para começar.',
    subtitulo: SAUDACOES[role],
    features,
  }
}
