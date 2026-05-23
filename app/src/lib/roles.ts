export type Role = 'super_admin' | 'admin' | 'operacional' | 'estoque' | 'cmv' | 'bar'

const ROUTE_PERMISSIONS: Record<string, Role[]> = {
  '/dashboard':  ['super_admin', 'admin', 'operacional', 'estoque', 'cmv', 'bar'],
  '/checklists': ['super_admin', 'admin', 'operacional', 'bar'],
  '/compras':    ['super_admin', 'admin', 'estoque'],
  '/estoque':    ['super_admin', 'admin', 'estoque', 'operacional', 'cmv'],
  '/escala':     ['super_admin', 'admin', 'operacional'],
  '/fichas':     ['super_admin', 'admin', 'cmv', 'operacional'],
  '/admin':      ['super_admin', 'admin'],
}

export function rotasPermitidas(role: Role): string[] {
  return Object.entries(ROUTE_PERMISSIONS)
    .filter(([, roles]) => roles.includes(role))
    .map(([href]) => href)
}
