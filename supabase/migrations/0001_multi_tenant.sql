-- ============================================================
-- 0001 — Multi-tenant foundation (Bica + AMP)
-- ============================================================
-- Adiciona coluna `casa` em todas tabelas operacionais e RLS
-- policies cruzando com helpers já existentes no projeto Supabase
-- compartilhado (ducbzdfxzaifzqefolhy):
--
--   - is_active_team_member()
--   - is_admin()
--   - member_has_casa(casa text)
--
-- Idempotente: usa IF NOT EXISTS / DROP POLICY IF EXISTS para
-- poder ser re-executada sem efeito colateral.
--
-- Ref: docs/architecture/ADR-001-multi-tenant.md
-- ============================================================

-- ------------------------------------------------------------
-- 1. Coluna `casa` nas 12 tabelas operacionais
-- ------------------------------------------------------------
ALTER TABLE checklists           ADD COLUMN IF NOT EXISTS casa text NOT NULL DEFAULT 'bica' CHECK (casa IN ('bica','amp'));
ALTER TABLE checklist_registros  ADD COLUMN IF NOT EXISTS casa text NOT NULL DEFAULT 'bica' CHECK (casa IN ('bica','amp'));
ALTER TABLE equipe               ADD COLUMN IF NOT EXISTS casa text NOT NULL DEFAULT 'bica' CHECK (casa IN ('bica','amp'));
ALTER TABLE escala               ADD COLUMN IF NOT EXISTS casa text NOT NULL DEFAULT 'bica' CHECK (casa IN ('bica','amp'));
ALTER TABLE estoque_categorias   ADD COLUMN IF NOT EXISTS casa text NOT NULL DEFAULT 'bica' CHECK (casa IN ('bica','amp'));
ALTER TABLE estoque_itens        ADD COLUMN IF NOT EXISTS casa text NOT NULL DEFAULT 'bica' CHECK (casa IN ('bica','amp'));
ALTER TABLE estoque_contagens    ADD COLUMN IF NOT EXISTS casa text NOT NULL DEFAULT 'bica' CHECK (casa IN ('bica','amp'));
ALTER TABLE compras_categorias   ADD COLUMN IF NOT EXISTS casa text NOT NULL DEFAULT 'bica' CHECK (casa IN ('bica','amp'));
ALTER TABLE compras_itens        ADD COLUMN IF NOT EXISTS casa text NOT NULL DEFAULT 'bica' CHECK (casa IN ('bica','amp'));
ALTER TABLE rodadas              ADD COLUMN IF NOT EXISTS casa text NOT NULL DEFAULT 'bica' CHECK (casa IN ('bica','amp'));
ALTER TABLE rodada_itens         ADD COLUMN IF NOT EXISTS casa text NOT NULL DEFAULT 'bica' CHECK (casa IN ('bica','amp'));
ALTER TABLE fichas_tecnicas      ADD COLUMN IF NOT EXISTS casa text NOT NULL DEFAULT 'bica' CHECK (casa IN ('bica','amp'));

-- Bica-only originalmente, mas cb135eb (PR #6) adicionou pra fechar
-- tenant isolation breach. Mantém pra simetria de RLS.
ALTER TABLE bar_tables    ADD COLUMN IF NOT EXISTS casa text NOT NULL DEFAULT 'bica' CHECK (casa IN ('bica','amp'));
ALTER TABLE reservations  ADD COLUMN IF NOT EXISTS casa text NOT NULL DEFAULT 'bica' CHECK (casa IN ('bica','amp'));

-- ------------------------------------------------------------
-- 2. Índices por casa (queries sempre filtram)
-- ------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_checklists_casa          ON checklists (casa);
CREATE INDEX IF NOT EXISTS idx_checklist_registros_casa ON checklist_registros (casa);
CREATE INDEX IF NOT EXISTS idx_equipe_casa              ON equipe (casa);
CREATE INDEX IF NOT EXISTS idx_escala_casa              ON escala (casa);
CREATE INDEX IF NOT EXISTS idx_estoque_categorias_casa  ON estoque_categorias (casa);
CREATE INDEX IF NOT EXISTS idx_estoque_itens_casa       ON estoque_itens (casa);
CREATE INDEX IF NOT EXISTS idx_estoque_contagens_casa   ON estoque_contagens (casa);
CREATE INDEX IF NOT EXISTS idx_compras_categorias_casa  ON compras_categorias (casa);
CREATE INDEX IF NOT EXISTS idx_compras_itens_casa       ON compras_itens (casa);
CREATE INDEX IF NOT EXISTS idx_rodadas_casa             ON rodadas (casa);
CREATE INDEX IF NOT EXISTS idx_rodada_itens_casa        ON rodada_itens (casa);
CREATE INDEX IF NOT EXISTS idx_fichas_tecnicas_casa     ON fichas_tecnicas (casa);
CREATE INDEX IF NOT EXISTS idx_bar_tables_casa          ON bar_tables (casa);
CREATE INDEX IF NOT EXISTS idx_reservations_casa        ON reservations (casa);

-- ------------------------------------------------------------
-- 3. RLS — habilitar nas tabelas (se já não estiver)
-- ------------------------------------------------------------
ALTER TABLE checklists           ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_registros  ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipe               ENABLE ROW LEVEL SECURITY;
ALTER TABLE escala               ENABLE ROW LEVEL SECURITY;
ALTER TABLE estoque_categorias   ENABLE ROW LEVEL SECURITY;
ALTER TABLE estoque_itens        ENABLE ROW LEVEL SECURITY;
ALTER TABLE estoque_contagens    ENABLE ROW LEVEL SECURITY;
ALTER TABLE compras_categorias   ENABLE ROW LEVEL SECURITY;
ALTER TABLE compras_itens        ENABLE ROW LEVEL SECURITY;
ALTER TABLE rodadas              ENABLE ROW LEVEL SECURITY;
ALTER TABLE rodada_itens         ENABLE ROW LEVEL SECURITY;
ALTER TABLE fichas_tecnicas      ENABLE ROW LEVEL SECURITY;
ALTER TABLE bar_tables           ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations         ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------
-- 4. Policies — SELECT: member ativo da casa OU admin
-- ------------------------------------------------------------
-- Padrão: a coluna casa precisa cruzar com member_has_casa() e o
-- usuário precisa ser team_member ativo. Admins veem tudo.
-- Helpers (is_active_team_member, is_admin, member_has_casa) já
-- existem no projeto compartilhado — não recriamos aqui.

DO $$
DECLARE
  t text;
  tables text[] := ARRAY[
    'checklists','checklist_registros','equipe','escala',
    'estoque_categorias','estoque_itens','estoque_contagens',
    'compras_categorias','compras_itens','rodadas','rodada_itens',
    'fichas_tecnicas','bar_tables','reservations'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS "%s_select_by_casa" ON %I', t, t);
    EXECUTE format(
      'CREATE POLICY "%s_select_by_casa" ON %I FOR SELECT TO authenticated
         USING (is_active_team_member() AND (is_admin() OR member_has_casa(casa)))',
      t, t
    );

    EXECUTE format('DROP POLICY IF EXISTS "%s_insert_by_casa" ON %I', t, t);
    EXECUTE format(
      'CREATE POLICY "%s_insert_by_casa" ON %I FOR INSERT TO authenticated
         WITH CHECK (is_active_team_member() AND (is_admin() OR member_has_casa(casa)))',
      t, t
    );

    EXECUTE format('DROP POLICY IF EXISTS "%s_update_by_casa" ON %I', t, t);
    EXECUTE format(
      'CREATE POLICY "%s_update_by_casa" ON %I FOR UPDATE TO authenticated
         USING (is_active_team_member() AND (is_admin() OR member_has_casa(casa)))
         WITH CHECK (is_active_team_member() AND (is_admin() OR member_has_casa(casa)))',
      t, t
    );

    EXECUTE format('DROP POLICY IF EXISTS "%s_delete_by_casa" ON %I', t, t);
    EXECUTE format(
      'CREATE POLICY "%s_delete_by_casa" ON %I FOR DELETE TO authenticated
         USING (is_active_team_member() AND (is_admin() OR member_has_casa(casa)))',
      t, t
    );
  END LOOP;
END $$;

-- ------------------------------------------------------------
-- 5. Notas operacionais
-- ------------------------------------------------------------
-- - Esta migration NÃO foi aplicada automaticamente pelo agente.
--   Aplicar via Supabase Dashboard ou `supabase db push` apenas
--   após revisão humana (Erick/Gabriel), pois opera contra o
--   projeto compartilhado ducbzdfxzaifzqefolhy.
-- - As funções is_active_team_member, is_admin, member_has_casa
--   PRECISAM existir no projeto. Foram introduzidas pelo sistema
--   multi-tenant Grupo Levay (ver learnings.md 2026-05-20).
-- - Se a coluna `casa` já estiver no schema (PR #6 a aplicou via
--   MCP em 2026-05-19), o ALTER ... IF NOT EXISTS é no-op.
