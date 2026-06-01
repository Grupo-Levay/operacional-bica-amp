-- 0003_add_casas_to_perfis.sql
-- Aplicada via Supabase MCP em 2026-06-01 (projeto ducbzdfxzaifzqefolhy).
--
-- Contexto: `database.types.ts` e `app/(app)/layout.tsx` já referenciam
-- `perfis.casas` (lista de casas que cada usuário pode acessar — alimenta o
-- CasaSwitcher), mas a coluna nunca foi criada no banco. A query
-- `.select('role, nome, onboarding_completo, casas')` falhava com
-- `42703: column "casas" does not exist`, retornando perfil null e rebaixando
-- TODOS os usuários (inclusive super_admin/admin) ao fallback role='operacional'.
--
-- Esta migration alinha o schema aos tipos: cada usuário tem uma lista de casas.
-- Default = ambas as casas (bica, amp); constraint garante valores válidos.

ALTER TABLE perfis
  ADD COLUMN IF NOT EXISTS casas text[]
    NOT NULL
    DEFAULT '{bica,amp}'::text[]
    CHECK (casas <@ ARRAY['bica'::text, 'amp'::text]);

-- Backfill explícito de perfis pré-existentes (idempotente): garante acesso a
-- ambas as casas para quem foi criado antes da coluna existir.
UPDATE perfis
SET casas = '{bica,amp}'::text[]
WHERE casas IS NULL OR cardinality(casas) = 0;
