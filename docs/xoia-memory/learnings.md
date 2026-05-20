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
