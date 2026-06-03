# Context Snapshot — Bica Operacional

_Atualizado: 2026-06-03 | S7 SHIPPED — main branch pronto para produção_

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
`src/components/ui/confirm-dialog.tsx`       → diálogo de confirmação reutilizável (ações destrutivas)
`src/hooks/use-realtime-table.ts`            → hook Realtime: assina postgres_changes por casa → router.refresh()
`src/lib/dashboard-metrics.ts`               → mediaCmv(fichas) — CMV médio real das fichas ativas
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

## Estado atual — S7 SHIPPED ✅

### Core Features (Completo)
✅ Auth — login, proteção de rotas por role, onboarding, recuperação de senha
✅ Multi-tenant — isolamento por `casa` (bica/amp) via getCurrentCasa() + requireUser()
✅ Layout — CasaSwitcher, LogoutBtn, AbastecimentoSubnav, sidebar + bottom-nav
✅ Reservas — CRUD completo, DateNav, status badges, validação capacidade/colisão
✅ Reservas v2 (S4.1) — check-in/no-show (enum 0004), disponibilidade de mesa no form, best-fit, editar reserva
✅ Reservas v3 (UX upgrade) — painel KPIs ao vivo, timeline de mesas, busca+filtro, confirmação WhatsApp — PR#33
✅ Viz primitives — ProgressRing + LevelBar (SVG/CSS puro, zero dep) + viz.ts testado; dashboard usa ring reutilizável e barras de ruptura
✅ Operação ao Vivo — Realtime nas reservas (publication supabase_realtime + filter por casa); CMV real no dashboard; drift de tokens migrado; ConfirmDialog + guards P0 (escala/rodada/ficha)
✅ Escala — grid 7 dias, edição inline por admin, scroll-snap mobile
✅ Checklists, Compras, Estoque, Fichas — filtrados por casa, CRUD funcional
✅ bar_tables — tabela criada no Supabase; seletor de mesas habilitado no form reservas
✅ Ícones PWA — icon-192.png e icon-512.png em public/

### Design System v3 (Completo — S7) ✅
✅ **Phase 1: Technical Debt Cleanup**
  - Logger estruturado (winston-compatible, contexto por módulo)
  - Máquina de estados centralizada em `lib/state-machine.ts`
  - Validações de casa em `lib/auth-guard.ts` (validarCasaDoUsuario)
  - Testes expandidos: fichas, escala, estoque, compras (290 passando)

✅ **Phase 2: Design System v3**
  - Audit visual completo (`docs/AUDIT-VISUAL.md`)
  - Tokens semânticos: tipografia (h1-h3, body-lg/sm, label, caption), cores (primary/success/warning/danger), sombras, gradientes
  - Componentes base redesenhados: Button (gradient), Card (interactive), Badge (status), ProgressRing (auto-glow), LevelBar (gradient)
  - DESIGN-v3.md — guia oficial com princípios, padrões, a11y
  - Zero hardcoded colors verificado (grep coverage completa)

✅ **Phase 3: UI Evolution Pages (5 páginas)**
  - Dashboard: Bento grid 4 KPI cards, responsive (1→2→4 cols), typography tokens
  - Reservas: seções organizadas (Status/Nova/Dia), counters modernizados, hover effects
  - Escala: min-h-screen layout, CardTitle text-h3, section headers text-label
  - Fichas: grid responsivo métricas (1→2→3 cols), "Métricas" + "Fichas Técnicas" sections
  - Estoque: alert section para críticos, visual hierarchy, section organization

### Quality (Completo) ✅
✅ npm lint — GREEN
✅ npm typecheck — GREEN (full type safety)
✅ npm test — GREEN (290 tests, 21 files)
✅ npm build — SUCCESS (production ready)
✅ CI/CD — GitHub Actions (lint+typecheck+test)
✅ PR #43 — MERGED to main (13 commits, 1.167 adds, 455 deletes, 24 files)

### Legacy Completions ✅
✅ RLS relaxada (isolamento na aplicação) — migration 0002 aplicada
✅ testes vitest — auth, checklist, reservas, fichas, escala, estoque, compras (290 passing)
✅ perfis.casas — coluna criada (migration 0003)
✅ Route guard de role no servidor — P1 completo
✅ Isolamento multi-tenant — aplicação-layer (requireUser() + casa filter)
✅ Zod em auth + site-url helper — P2 completo
✅ Loading states + a11y — P3 completo
✅ Toasts + edição inline — PR#29 completo

### Follow-ups Documentados (Não Escopo S7)
⏳ Alerta de estoque persistente — P3 (lógica existe, notificação push é follow-up)
⏳ Endurecer RLS no banco — P1 (defesa em profundidade, isolamento app-layer OK)
⏳ E2E Playwright — Pronto para Phase 4 se necessário
⏳ PRs #2 #3 (Vercel bots) — Podem ser fechados sem impacto

---

## Próximos Epics

### S6.0 — Equipe: Perfis, Gestão e Distribuição de Tarefas
**Status:** doing (Fase 1 ✅, Fases 2-3 ⬜)

**Fase 1 — Perfil & Gestão de Equipe** ✅ SHIPPED
- ✅ Migration 0006: `equipe.perfil_id` (FK perfis)
- ✅ `/perfil` — self profile com responsabilidades, módulos, próximos turnos
- ✅ `/admin` — vincular conta ↔ membro da equipe
- ✅ Nav: `/perfil` no sidebar e bottom-nav
- ✅ Testes de permissão + validação

**Fase 2 — Tarefas & Kanban** (PRÓXIMO)
- [ ] Migration: tabela `tarefas` (titulo, descricao, perfil_id, status, prioridade, prazo, casa)
- [ ] Actions: criar/atribuir/mover/concluir (máquina a_fazer → fazendo → concluida)
- [ ] Kanban board admin (distribuição) + "minhas tarefas" no perfil
- [ ] Testes de máquina de estados

**Fase 3 — Metas & Evolução**
- [ ] Migration: tabela `metas` (escopo individual/equipe, perfil_id, alvo, atual, periodo)
- [ ] Actions: definir meta, atualizar progresso
- [ ] UI: metas no perfil (individual + equipe) + evolução
- [ ] Painel de metas da equipe no admin

**Arquivo:** `docs/stories/S6.0-equipe-perfis-tarefas.md`

---

### S8 — Performance & Analytics (Planejado)
**Status:** planned

**Escopo Potencial:**
- **Performance Audit** — LCP/CLS/INP (Lighthouse), bundle size analysis, image optimization
- **Analytics Integration** — Eventos de user behavior (check-in, compra, ficha criada), funnels
- **Monitoring & Alertas** — Health checks, error tracking (Sentry), uptime monitoring
- **Observability** — Request tracing, slow query identification, API latency baseline

**Não Escopo S8:**
- Refactoring de performance (cacheamento, virtualization) — defer até dados mostrem gargalos
- Analytics no produto (dashboard de métricas) — só instrumentação; dashboard é S9+

**Dependências:** S7 ✅ concluído, S6 Fase 2+ pronto

---

### Roadmap Visual
```
S6.0 Fase 1 ✅
  ↓
S7 (completo) ✅
  ↓
S6.0 Fases 2-3 ← PRÓXIMO (Kanban + Metas)
  ↓
S8 Performance & Analytics ← Post-Fase2
  ↓
S9+ (produto features: dashboards, reports, integrações)
```

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
1. **✅ S7 UI Evolution COMPLETE** — Phase 1 (tech debt cleanup) + Phase 2 (design v3) + Phase 3 (5 pages redesigned) → PR#44 READY FOR MERGE (2026-06-03, 290 tests passing, lint clean, build OK)
2. feat: reservas UX upgrade — painel ao vivo, timeline, busca/filtro, WhatsApp — PR#33 (2026-06-01)
3. feat: auditoria geral + correções P0→P3 — PR#30 (2026-06-01)
4. feat: dashboard Bento, toasts, edição de fichas/estoque e testes — PR#29 (2026-05-26)
5. feat: screen evolution v1 — checklist, reservas, fichas, admin, estoque (2026-05-26)
6. feat: bar_tables + PWA + testes vitest + inline styles — PR#26 (2026-05-25)

## Gaps conhecidos (Post-S7)
- **Resolvido (S7)** ✅ Testes vitest expandidos: agora cobrem auth/checklist/reservas/fichas/escala/estoque/compras (290 total)
- **Resolvido (S7)** ✅ UI modernização: 5 páginas críticas redesenhadas com design v3
- **Resolvido (S7)** ✅ Tech debt: logger estruturado, máquina de estados centralizada, validações padronizadas

### Follow-ups de Baixa Prioridade
- Alerta de estoque persistente: lógica existe no dashboard — notificação push/banner fixo é follow-up P3
- Endurecer RLS no banco (defesa em profundidade): isolamento app-layer está OK, defensiva no DB é follow-up P1
- E2E Playwright automation: setup iniciado, ready para Phase 4 se necessário
- PRs #2 e #3 (Vercel bots): ainda abertas, podem ser fechadas sem impacto
