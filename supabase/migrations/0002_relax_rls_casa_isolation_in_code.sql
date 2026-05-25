-- 0002_relax_rls_casa_isolation_in_code.sql
-- Aplicada via Supabase MCP em 2026-05-25 (projeto ducbzdfxzaifzqefolhy).
--
-- Contexto: o isolamento entre casas (bica/amp) passa a ser garantido na
-- aplicação — filtro `.eq('casa', casa)` em toda query/action + proteção de
-- rota por role. As policies baseadas em `team_members` (sistema Grupo Levay)
-- bloqueavam escrita para usuários do app que não são team_members e impediam
-- gravar em casa='amp'. Alinhamos reservations/bar_tables ao modelo aberto já
-- usado pelas tabelas do app.

-- reservations: abrir todo o CRUD
ALTER POLICY reservations_select ON reservations USING (true);
ALTER POLICY reservations_insert ON reservations WITH CHECK (true);
ALTER POLICY reservations_update ON reservations USING (true) WITH CHECK (true);
ALTER POLICY reservations_delete ON reservations USING (true);

-- bar_tables: abrir todo o CRUD
ALTER POLICY bar_tables_select ON bar_tables USING (true);
ALTER POLICY bar_tables_insert ON bar_tables WITH CHECK (true);
ALTER POLICY bar_tables_update ON bar_tables USING (true) WITH CHECK (true);
ALTER POLICY bar_tables_delete ON bar_tables USING (true);

-- INSERTs das tabelas do app: relaxar de team_member-check para true
ALTER POLICY escala_insert ON escala WITH CHECK (true);
ALTER POLICY estoque_contagens_insert ON estoque_contagens WITH CHECK (true);
ALTER POLICY checklist_registros_insert ON checklist_registros WITH CHECK (true);
ALTER POLICY rodadas_insert ON rodadas WITH CHECK (true);
ALTER POLICY rodada_itens_insert ON rodada_itens WITH CHECK (true);
ALTER POLICY compras_itens_insert ON compras_itens WITH CHECK (true);
