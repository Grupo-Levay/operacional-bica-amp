# XOIA — Aprendizados Persistentes

Formato de entrada:
```
## [YYYY-MM-DD] — <título>
**Contexto:** o que estava sendo feito
**Aprendizado:** o que foi descoberto — específico e acionável
**Aplicar quando:** em quais situações futuras isso é relevante
---
```

<!-- Aprendizados serão adicionados aqui via append durante os ciclos -->

## [2026-05-20] — Supabase RLS multi-tenant bloqueia leitura anon em app interno
**Contexto:** App operacional bica-amp com dados no DB mas todas as pages retornando vazio
**Aprendizado:** O projeto Supabase (`ducbzdfxzaifzqefolhy`) é compartilhado com sistema multi-tenant (Grupo Levay). As políticas SELECT usam `is_active_team_member() AND (is_admin() OR member_has_casa(casa))` — funções que checam `auth.uid()` na tabela `team_members`. App Next.js usa anon key sem JWT → `auth.uid()` = null → tudo retorna vazio SEM erro. Fix: `CREATE POLICY ... FOR SELECT USING (true)` nas tabelas do app.
**Aplicar quando:** App com Supabase mostra empty state sem erros → suspeitar RLS antes de checar env vars. Verificar via `/api/health` personalizado + `pg_policies`.
---

## [2026-05-23] — PR #6 órfão: merge no GitHub não garante presença em main
**Contexto:** Retomada do projeto descobriu que PR #6 (multi-tenant + reservas + toast + escala admin) aparece como "merged" no GitHub mas o commit `ee6834b` nunca chegou em `main` — foi mergeado numa branch intermediária `claude/resume-session-CVQU9` que depois divergiu.
**Aprendizado:** Antes de assumir que uma feature está em prod só por estar marcada como merged no GitHub, validar `git branch --contains <sha>` e `git log main..pr-branch`. PRs com base em branches efêmeras (não-main) podem virar órfãos. Migrations SQL aplicadas via MCP `execute_sql` sem versionar no repo causam descompasso entre `database.types.ts` e schema real.
**Aplicar quando:** Resume de projeto com histórico de PRs paralelos / múltiplas branches "claude/*" / migrations Supabase. Sempre versionar SQL em `supabase/migrations/` mesmo após aplicar via MCP.
---

## [2026-05-23] — Estratégia de recuperação de PR órfão grande: cherry-pick em camadas
**Contexto:** PR #6 órfão tem 15 commits, 43 arquivos, +3406/-506 linhas. Rebase direto teria ~10 conflitos moderados em pages + components, todos exigindo reconciliação semântica.
**Aprendizado:** Para PRs órfãos arquiteturalmente sólidos mas grandes, NÃO rebase direto. Cherry-pick por camadas: (1) foundation/infra → (2) auth/layout → (3) features por módulo → (4) features novas → (5) UX. Cada camada vira PR draft separado, validado antes de ir pra próxima. Reduz risco e permite parar/replanejar entre camadas.
**Aplicar quando:** Recuperação de feature branch grande (>10 commits) com conflitos esperados.
---

## [2026-06-01] — Deriva schema↔types rebaixa role silenciosamente
**Contexto:** Auditoria geral; `layout.tsx` fazia `.select(...,casas)` mas a coluna `casas` não existia em `perfis` (só em database.types.ts). PostgREST erro 42703 → perfil null → role caía no fallback 'operacional' para TODOS, inclusive super_admin.
**Aprendizado:** Tipos gerados podem divergir do banco real. Ao depender de coluna nova, verificar no banco (list_tables/execute_sql), não confiar só em database.types.ts. Fallback de role mascara o bug — falha vira "downgrade silencioso", não erro visível.
**Aplicar quando:** Selecionar colunas recém-adicionadas; debugar permissões/role inesperadas.
---

## [2026-06-01] — Follow-up: alerta de estoque persistente (não implementado)
**Contexto:** Auditoria P3. Alerta de estoque crítico (atual<minimo) hoje só existe no frontend. Persistir corretamente exige tabela `estoque_alertas` + geração/resolução server-side + UI de gestão = ciclo próprio.
**Aprendizado:** Evitar meia-feature ilusória. Regra documentada como follow-up: criar tabela + check em atualizarQuantidade() + tela de alertas, ou centralizar a regra num helper server-side `getItensCriticos(casa)` como single source of truth.
**Aplicar quando:** Retomar P3 / pedido de notificações de estoque.
---

## [2026-06-01] — Enum Postgres ADD VALUE é seguro em migração isolada
**Contexto:** Adicionar estados `presente`/`nao_compareceu` ao enum reservation_status (check-in/no-show em Reservas).
**Aprendizado:** `ALTER TYPE ... ADD VALUE IF NOT EXISTS 'x' AFTER 'y'` aplica via apply_migration sem custo; o valor novo não pode ser USADO na mesma transação, mas migração que só declara (sem usar) é segura. Sincronizar manualmente os 2 pontos do enum em database.types.ts (union type + Constants array).
**Aplicar quando:** ampliar enums de status/máquina de estados no Supabase remoto.
---

## [2026-06-01] — Lógica de disponibilidade como helper puro evita duplicação client/server
**Contexto:** Reservas precisava calcular mesas ocupadas + best-fit no form (client) e validar colisão (server action).
**Aprendizado:** Extrair `src/lib/reservas-availability.ts` (horariosColidem, mesasOcupadas, sugerirMesa) como funções puras tornou a mesma regra testável isoladamente (vitest, sem mock de DB) e reutilizável nos dois lados. ReservaSlot é subset de Tables<'reservations'> → passa direto por structural typing.
**Aplicar quando:** regra de negócio precisa rodar no client (UX otimista) e no server (validação autoritativa).
---

## [2026-06-03] — S7: Padrão de redesign page modular reduz drift visual
**Contexto:** 5 pages (Dashboard, Reservas, Escala, Fichas, Estoque) precisavam evoluir de visual antigo para v3 moderno mantendo funcionalidade intacta.
**Aprendizado:** Aplicar padrão atômico a TODAS as pages antes de merge evita duplicação de esforço:
1. Layout wrapper: `min-h-screen bg-background p-4 md:p-6 space-y-6 pb-24`
2. Section headers: `text-label font-semibold text-muted-foreground uppercase tracking-wide`
3. Microinterações: `[@media(hover:hover)]:hover:-translate-y-0.5` + shadow transitions (não hover:shadow senão quebra mobile)
4. Responsive spacing: sempre `space-y-6` (nunca varia), padding ajusta em `md:`
5. Accent colors: mapear status a semântica (primary/success/warning/danger) via constantes, não inline
Resultado: 0 hardcoded colors detectável via grep, visual hierarchy 100% consistente, pages são refatorações PURAS (sem lógica quebrada).
**Aplicar quando:** Redesign UI de múltiplas pages. Validar pattern na 1ª page, replicate atomicamente nas restantes, merge tudo junto (não page por page — drift garante).
---

## [2026-06-03] — Check obrigatório pré-merge: lint + typecheck + test em paralelo
**Contexto:** S7 Phase 3 completou 5 pages. QA verificação: `npm run lint && npm test && npm run typecheck` — todos em <10s total.
**Aprendizado:** Desses 3, `npm run typecheck` é o mais custoso (~3s) mas critica (catches refactor breaks). Rodar em paralelo (3 bash calls) reduz feedback latency. Se algum falhar, marcar e parar ANTES de commit/push — regressions mascaradas por "ainda builds" são caras.
**Aplicar quando:** Final de qualquer feature. Não confiar em "pareceu funcionar" sem rodar todos os 3. Pipeline CI não substitui — é verificação extra.
---

## [2026-06-03] — Snapshot pode estar stale: verificar git+DB antes de reimplementar fase "próxima"
**Contexto:** Retomada da S6 — snapshot dizia "Fase 2 = PRÓXIMO", mas git mostrava commits `feat(S6.0-fase2/fase3)` já em HEAD; `origin/main == HEAD` (0 diff); tabelas `tarefas`/`metas` existiam em produção. Reimplementar teria duplicado tudo.
**Aprendizado:** Antes de "construir" uma fase marcada como próxima no snapshot, validar a realidade: `git rev-list origin/main..HEAD`, `git merge-base --is-ancestor <sha> origin/main`, e `list_tables`/`execute_sql` no DB. O snapshot é estado declarado, não verdade — confirmar com fontes autoritativas (git, GitHub, banco). Reconciliar registros (story→done, snapshot, sessions) é a retomada correta, não reimplementar.
**Aplicar quando:** Resume de projeto onde snapshot e estado git/DB podem divergir.
---

## [2026-06-03] — Supabase GitHub integration ignora migrations fora de `app/supabase`
**Contexto:** PR da S6 fase2/3 — bot Supabase comentou "ignored because no changes detected in `app/supabase` directory". Migrations do repo ficam em `supabase/migrations/` (raiz), não em `app/supabase`.
**Aprendizado:** A integração Supabase↔GitHub só dispara branching/aplicação quando há mudança no diretório configurado (`app/supabase`). Migrations versionadas na raiz NÃO são aplicadas automaticamente em preview/prod — precisam ser aplicadas manualmente via MCP `execute_sql`/`apply_migration`. Por isso verificar `list_tables` no DB é obrigatório após merge de migration.
**Aplicar quando:** Adicionar migration ao repo; validar se schema de produção reflete o SQL versionado.
---

## [2026-06-03] — withAnalytics só marca erro em throw, não em `return {error}`
**Contexto:** S8 Fase 3 — instrumentar tarefas/metas/estoque/compras/escala. Metade das actions retorna `{error: '...'}` (validação) em vez de lançar; a outra metade lança `throw new Error()`.
**Aprendizado:** `withAnalytics(action, fn)` captura `status='error'` apenas no caminho `catch` (throws). Actions que retornam `{error}` para falhas de negócio são gravadas como `success` — o que é correto: foram invocações válidas que retornaram mensagem de validação, não falhas de sistema. Para o painel `/admin/saude`, `status='error'` = erro inesperado real (throw). Não tentar "normalizar" tudo para throw só pela telemetria.
**Aplicar quando:** instrumentar Server Actions; interpretar taxa de erro no painel de saúde (erro = exceção, não rejeição de validação).
---

## [2026-06-03] — Story stale reincide: Fase shipada marcada ⬜ (verificar git antes de "construir")
**Contexto:** "Go" para S8 — story dizia Fase 2 `⬜` mas commit `c301e1d` já a entregara (web-vitals-reporter, next.config, lighthouse). Mesmo padrão da S6.
**Aprendizado:** Reincidência confirma sistemicidade: marcadores de story/snapshot atrasam atrás dos commits. Ao retomar, SEMPRE `git log --oneline` + `ls` dos arquivos esperados ANTES de implementar — arquivos untracked (ex.: `analytics-queries.ts`) sinalizam WIP da fase atual. Reconciliar marcadores faz parte do ship, não é overhead.
**Aplicar quando:** qualquer retomada com "Go"/"continue" — auditar realidade (git+arquivos+DB) antes de codar.
---
