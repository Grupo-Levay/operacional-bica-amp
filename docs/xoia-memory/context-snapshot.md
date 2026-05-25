# Context Snapshot — Bica Operacional

_Atualizado: 2026-05-25 | Branch: main (PR#23 mergeado)_

## Projeto
App: Painel operacional do bar BiCA/AMP — checklists, estoque, escala, compras, fichas técnicas e reservas
Stack: Next.js 16 (App Router) + TypeScript + Supabase (Auth + DB) + Tailwind + Vercel
Ambiente: Container remoto Claude Code; deploy automático Vercel (projeto `bica-bar-system`)

## Arquivos críticos
`src/proxy.ts`                              → proteção de rotas (Next.js 16 — não middleware.ts)
`src/lib/tenant.ts`                         → getCurrentCasa() — resolve bica/amp via subdomínio + cookie
`src/lib/auth-guard.ts`                     → requireUser() — auth + casa para Server Actions
`src/lib/supabase/server.ts`                → createClient() para Server Components e Actions
`src/lib/roles.ts`                          → type Role + rotasPermitidas(role)
`src/app/actions/auth.ts`                   → signIn, signOut, resetPassword, setCasaAction
`src/app/(app)/reservas/page.tsx`           → módulo reservas completo com DateNav + form
`src/components/reservas/`                  → date-nav, nova-reserva-form, reserva-card
`src/types/database.types.ts`              → tipos Supabase com coluna `casa` em todas as tabelas
`supabase/migrations/`                      → 0001 multi_tenant SQL | 0002 relaxa RLS

## Estado atual
✅ Auth — login, proteção de rotas por role, onboarding, recuperação de senha
✅ Multi-tenant — isolamento por `casa` (bica/amp) via getCurrentCasa() + requireUser()
✅ Layout — CasaSwitcher, LogoutBtn, AbastecimentoSubnav, sidebar + bottom-nav
✅ Reservas — CRUD completo, DateNav, status badges, confirmar/cancelar/concluir
✅ Escala — grid 7 dias, edição inline por admin
✅ Checklists, Compras, Estoque, Fichas — filtrados por casa, CRUD funcional
✅ Dashboard — checklists pendentes + estoque crítico por casa
✅ RLS relaxada (isolamento na aplicação) — migration 0002 aplicada
⬜ Mesas no Supabase (bar_tables) — criar via dashboard para habilitar seletor no form reservas
⬜ Ícones PWA (public/icon-192.png, public/icon-512.png)
⬜ Testes de integração para Server Actions

## Decisões técnicas ativas
- `proxy.ts` (não `middleware.ts`): Next.js 16 renomeou o arquivo de interceptação
- `requireUser()` em actions: ponto único de auth+casa, lança Error se não autenticado
- Isolamento multi-tenant na aplicação: filter `.eq('casa', casa)` em toda query — não no RLS
- `getUser()` (não `getSession()`): única chamada segura para auth decisions no server
- PKCE flow via `/auth/callback`: `exchangeCodeForSession(code)` antes de redirecionar
- Supabase MCP (`ducbzdfxzaifzqefolhy`): usa `execute_sql` para migrações remotas

## Últimos ships
1. feat: isolamento multi-tenant + hardening + módulo Reservas — PR#23 (2026-05-25)
2. feat: multi-tenant + Tier 2 — escala editável, admin panel, alertas estoque (2026-05-25)
3. feat: Tier 1 UX — limelight nav, filtro estoque, search fichas (2026-05-25)
4. feat: recuperação de senha + PKCE flow (2026-05-22)
5. feat: design system BiCA v2 + autenticação + onboarding guiado (2026-05-22)

## Gaps conhecidos
- `bar_tables` pode estar vazia — criar mesas via Supabase dashboard para form de reservas funcionar
- Migration 0001 multi_tenant.sql versionada; já aplicada via PR#6 histórico (idempotente)
- Sem testes unitários — `npm test` passa por não ter specs
