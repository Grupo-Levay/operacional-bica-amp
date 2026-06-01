-- 0006 — Vínculo equipe ↔ conta de usuário
-- Liga um membro da escala (equipe) a uma conta (perfis), permitindo que o
-- usuário logado veja "a sua" escala/função. Nullable: nem todo membro tem conta.
--
-- Idempotente. ON DELETE SET NULL: remover a conta não apaga o histórico de escala.

alter table equipe
  add column if not exists perfil_id uuid references perfis(id) on delete set null;

create index if not exists equipe_perfil_id_idx on equipe(perfil_id);
