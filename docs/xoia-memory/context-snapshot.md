# Context Snapshot — Bica Operacional

_Atualizado: 2026-06-01 | Branch: claude/quirky-cray-ZMAkU (sessão ativa)_

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
`supabase/migrations/`                      → 0001 multi_tenant | 0002 relaxa RLS | 0003 perfis.casas | 0004 reserva presente/nao_compareceu
`src/lib/reservas-availability.ts`           → helper puro: horariosColidem, mesasOcupadas, sugerirMesa (best-fit)
`src/lib/viz.ts`                             → helpers puros de viz: clampPct, ringGeometry, nivelEstoquePct, severidadeEstoque
`src/components/ui/progress-ring.tsx`        → anel de progresso SVG (zero dep) accent-aware
`src/components/ui/level-bar.tsx`            → barra de nível atual/mínimo colorida por severidade
`src/components/reservas/reserva-form.tsx`   → form genérico criar/editar com disponibilidade + best-fit
`src/lib/site-url.ts`                        → getSiteUrl() — resolve URL base via env/host (sem fallback hardcoded)
`src/lib/schemas/auth.ts`                    → schemas Zod (padrão de validação — adoção incremental)
`.github/workflows/ci.yml`                   → CI: lint+typecheck+test em PR/push main
`DESIGN.md`                                 → fonte de verdade do design system (v2.0 — LER antes de UI)
`src/tokens/tokens.yaml`                    → paleta completa: brand, parchment b0–b4, ink2–ink4, status
`src/app/globals.css`                       → @theme inline com todos os tokens → classes Tailwind válidas
`src/components/shared/`                    → PageHeader, EmptyState, SectionLabel — usar em pages
`src/components/ui/brand-link.tsx`          → Link CTA full-width estilo primary 52px
`src/components/ui/button.tsx`              → variantes: default, brand (bg-bica), cta (52px w-full)
`src/app/actions/__tests__/`               → testes vitest para auth, checklist e reservas
`vitest.config.ts`                          → configuração vitest
`public/icon-192.png`                       → ícone PWA 192px
`public/icon-512.png`                       → ícone PWA 512px

## Estado atual
✅ Auth — login, proteção de rotas por role, onboarding, recuperação de senha
✅ Multi-tenant — isolamento por `casa` (bica/amp) via getCurrentCasa() + requireUser()
✅ Layout — CasaSwitcher, LogoutBtn, AbastecimentoSubnav, sidebar + bottom-nav
✅ Reservas — CRUD completo, DateNav, status badges, validação capacidade/colisão
✅ Reservas v2 (S4.1) — check-in/no-show (enum 0004), disponibilidade de mesa no form, best-fit, editar reserva
✅ Reservas v3 (UX upgrade) — painel KPIs ao vivo, timeline de mesas, busca+filtro, confirmação WhatsApp — PR#33
✅ Viz primitives — ProgressRing + LevelBar (SVG/CSS puro, zero dep) + viz.ts testado; dashboard usa ring reutilizável e barras de ruptura
✅ Escala — grid 7 dias, edição inline por admin, scroll-snap mobile
✅ Checklists, Compras, Estoque, Fichas — filtrados por casa, CRUD funcional
✅ Dashboard — checklists pendentes + estoque crítico por casa, grid 4-col desktop, Bento layout
✅ RLS relaxada (isolamento na aplicação) — migration 0002 aplicada
✅ Design System v2 — tokens sincronizados, PageHeader/EmptyState/SectionLabel, BrandLink, Button brand
✅ Inline styles — sidebar, bottom-nav, login, onboarding migrados para tokens
✅ bar_tables — tabela criada no Supabase; seletor de mesas habilitado no form reservas
✅ Ícones PWA — icon-192.png e icon-512.png em public/
✅ Testes vitest — auth, checklist e reservas cobertos
✅ perfis.casas — coluna criada (migration 0003); role não rebaixa mais (P0 corrigido)
✅ Route guard de role no servidor (layout + x-pathname via proxy) — P1
✅ Isolamento multi-tenant de usuários no /admin (overlaps casas) — P1
✅ CI GitHub Actions (lint+typecheck+test) — P2
✅ Zod em auth + site-url helper (sem fallback hardcoded) — P2
✅ Loading states em todas as páginas + a11y bottom-nav + testes de componente (jsdom) — P3
✅ Toasts de feedback + edição inline de fichas/estoque — PR#29
✅ Auditoria geral P0→P3 — correções de bugs, a11y, tipos, edge cases — PR#30
⬜ Alerta de estoque persistente (follow-up documentado em learnings) — P3 pendente
⬜ Endurecer RLS no banco (defesa em profundidade) — follow-up P1
⬜ Expandir testes vitest para compras/estoque/escala/fichas
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
1. feat: reservas UX upgrade — painel ao vivo, timeline, busca/filtro, WhatsApp — PR#33 (2026-06-01)
2. feat: auditoria geral + correções P0→P3 — PR#30 (2026-06-01)
2. feat: dashboard Bento, toasts, edição de fichas/estoque e testes — PR#29 (2026-05-26)
3. feat: screen evolution v1 — checklist, reservas, fichas, admin, estoque (2026-05-26)
4. feat: bar_tables + PWA + testes vitest + inline styles — PR#26 (2026-05-25)
5. feat: design system lift — token sync + shared components + feature refactor — PR#25 (2026-05-25)

## Gaps conhecidos
- Testes vitest criados para auth/checklist/reservas — expandir para compras/estoque/escala/fichas
- Migration 0001 multi_tenant.sql versionada; já aplicada via PR#6 histórico (idempotente)
- PRs #2 e #3 (Vercel bots) ainda abertos como draft — podem ser fechados sem impacto
- Alerta de estoque persistente: lógica existe no dashboard mas sem notificação push/banner fixo
