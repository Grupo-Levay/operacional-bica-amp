# Context Snapshot — Bica Operacional

_Atualizado: 2026-05-26 | Branch: claude/eloquent-dirac-HB4GZ (sessão ativa)_

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
`DESIGN.md`                                 → fonte de verdade do design system (v2.0 — LER antes de UI)
`src/tokens/tokens.yaml`                    → paleta completa: brand, parchment b0–b4, ink2–ink4, status
`src/app/globals.css`                       → @theme inline com todos os tokens → classes Tailwind válidas
`src/components/shared/`                    → PageHeader, EmptyState, SectionLabel — usar em pages
`src/components/ui/brand-link.tsx`          → Link CTA full-width estilo primary 52px
`src/components/ui/button.tsx`              → variantes: default, brand (bg-bica), cta (52px w-full)
`app/src/app/actions/__tests__/`            → testes vitest para auth, checklist e reservas
`app/vitest.config.ts`                      → configuração vitest
`app/public/icon-192.png`                   → ícone PWA 192px
`app/public/icon-512.png`                   → ícone PWA 512px

## Estado atual
✅ Auth — login, proteção de rotas por role, onboarding, recuperação de senha
✅ Multi-tenant — isolamento por `casa` (bica/amp) via getCurrentCasa() + requireUser()
✅ Layout — CasaSwitcher, LogoutBtn, AbastecimentoSubnav, sidebar + bottom-nav
✅ Reservas — CRUD completo, DateNav, status badges, confirmar/cancelar/concluir
✅ Escala — grid 7 dias, edição inline por admin, scroll-snap mobile
✅ Checklists, Compras, Estoque, Fichas — filtrados por casa, CRUD funcional
✅ Dashboard — checklists pendentes + estoque crítico por casa, grid 4-col desktop
✅ RLS relaxada (isolamento na aplicação) — migration 0002 aplicada
✅ Design System v2 — tokens sincronizados, PageHeader/EmptyState/SectionLabel, BrandLink, Button brand
✅ Inline styles — sidebar, bottom-nav, login, onboarding migrados para tokens
✅ bar_tables — tabela criada no Supabase; seletor de mesas habilitado no form reservas
✅ Ícones PWA — icon-192.png e icon-512.png em public/
✅ Testes vitest — auth, checklist e reservas cobertos
⬜ Testes de integração para Server Actions (coverage parcial — expandir)
⬜ PRs obsoletos #2 e #3 (Vercel bots) — podem ser fechados

## Decisões técnicas ativas
- `proxy.ts` (não `middleware.ts`): Next.js 16 renomeou o arquivo de interceptação
- `requireUser()` em actions: ponto único de auth+casa, lança Error se não autenticado
- Isolamento multi-tenant na aplicação: filter `.eq('casa', casa)` em toda query — não no RLS
- `getUser()` (não `getSession()`): única chamada segura para auth decisions no server
- PKCE flow via `/auth/callback`: `exchangeCodeForSession(code)` antes de redirecionar
- Supabase MCP (`ducbzdfxzaifzqefolhy`): usa `execute_sql` para migrações remotas
- Design tokens: `text-primary`/`bg-primary` = âmbar Bica; `text-bica`/`text-amp` só quando ambas marcas coexistem
- Touch targets: `min-h-[52px]` (WCAG 2.5.5) — NÃO `44px`
- Pages usam `PageHeader` de `@/components/shared/page-header` — não h1 inline
- CTAs de ação usam `BrandLink` ou `Button variant="brand" size="cta"`

## Últimos ships
1. feat: dashboard Bento, toasts, edição de fichas/estoque e testes — PR#29 (2026-05-26)
2. feat: screen evolution v1 — checklist, reservas, fichas, admin, estoque (2026-05-26)
3. feat: bar_tables + PWA + testes vitest + inline styles — PR#26 (2026-05-25)
4. feat: design system lift — token sync + shared components + feature refactor — PR#25 (2026-05-25)
5. feat: isolamento multi-tenant + hardening + módulo Reservas — PR#23 (2026-05-25)

## Gaps conhecidos
- Testes vitest criados para auth/checklist/reservas — expandir para compras/estoque/escala/fichas
- Migration 0001 multi_tenant.sql versionada; já aplicada via PR#6 histórico (idempotente)
- PRs #2 e #3 (Vercel bots) ainda abertos como draft — podem ser fechados sem impacto
