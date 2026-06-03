-- 0007 — Tarefas (distribuição via Kanban)
-- Tarefas atribuíveis a membros da equipe, com status estilo Kanban
-- (a_fazer → fazendo → concluida). Isolamento por casa na aplicação.
--
-- Idempotente.

create table if not exists tarefas (
  id uuid primary key default gen_random_uuid(),
  casa text not null,
  titulo text not null,
  descricao text,
  perfil_id uuid references perfis(id) on delete set null,
  status text not null default 'a_fazer',
  prioridade text not null default 'media',
  prazo date,
  created_by uuid references perfis(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists tarefas_casa_status_idx on tarefas(casa, status);
create index if not exists tarefas_perfil_idx on tarefas(perfil_id);
