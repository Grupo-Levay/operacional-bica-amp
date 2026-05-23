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
