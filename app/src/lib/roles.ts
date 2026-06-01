export type Role = 'super_admin' | 'admin' | 'operacional' | 'estoque' | 'cmv' | 'bar'

/** Rótulo legível da função/role para exibição. */
export const ROLE_LABEL: Record<Role, string> = {
  super_admin: 'Super Admin',
  admin: 'Administrador',
  operacional: 'Operacional',
  estoque: 'Estoque',
  cmv: 'CMV / Fichas',
  bar: 'Bar',
}

/** Responsabilidades associadas a cada função, para a tela de perfil. */
export const ROLE_RESPONSABILIDADES: Record<Role, string[]> = {
  super_admin: [
    'Gestão geral de todas as casas',
    'Usuários, permissões e equipe',
    'Acesso a todos os módulos',
  ],
  admin: [
    'Gestão da casa',
    'Usuários e escala da equipe',
    'Acesso a todos os módulos operacionais',
  ],
  operacional: ['Checklists de turno', 'Escala e reservas', 'Estoque e fichas'],
  estoque: ['Contagem de estoque', 'Rodadas de compras'],
  cmv: ['Fichas técnicas e CMV', 'Acompanhamento de estoque'],
  bar: ['Checklists do bar', 'Atendimento de reservas'],
}

/** Resolve o rótulo da função; tolera roles fora do enum. */
export function rotuloRole(role: string): string {
  return ROLE_LABEL[role as Role] ?? 'Funcionário'
}

/** Resolve as responsabilidades da função; vazio para roles desconhecidos. */
export function responsabilidadesRole(role: string): string[] {
  return ROLE_RESPONSABILIDADES[role as Role] ?? []
}

const ROUTE_PERMISSIONS: Record<string, Role[]> = {
  '/dashboard':  ['super_admin', 'admin', 'operacional', 'estoque', 'cmv', 'bar'],
  '/perfil':     ['super_admin', 'admin', 'operacional', 'estoque', 'cmv', 'bar'],
  '/checklists': ['super_admin', 'admin', 'operacional', 'bar'],
  '/compras':    ['super_admin', 'admin', 'estoque'],
  '/estoque':    ['super_admin', 'admin', 'estoque', 'operacional', 'cmv'],
  '/escala':     ['super_admin', 'admin', 'operacional'],
  '/reservas':   ['super_admin', 'admin', 'operacional', 'bar'],
  '/fichas':     ['super_admin', 'admin', 'cmv', 'operacional'],
  '/admin':      ['super_admin', 'admin'],
}

export function rotasPermitidas(role: Role): string[] {
  return Object.entries(ROUTE_PERMISSIONS)
    .filter(([, roles]) => roles.includes(role))
    .map(([href]) => href)
}

/**
 * Valida se um role pode acessar a rota correspondente ao pathname.
 * Resolve o segmento base (ex: "/escala/123" → "/escala"). Rotas não mapeadas
 * em ROUTE_PERMISSIONS são liberadas (não são áreas restritas por role).
 */
export function podeAcessarRota(role: Role, pathname: string): boolean {
  const base = '/' + (pathname.split('/').filter(Boolean)[0] ?? '')
  const permitidos = ROUTE_PERMISSIONS[base]
  if (!permitidos) return true
  return permitidos.includes(role)
}
