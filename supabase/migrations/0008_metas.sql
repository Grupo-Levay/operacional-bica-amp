-- 0008 — Metas individuais e de equipe
-- Metas numéricas definidas por admins para membros ou para a equipe como um todo.
-- escopo: 'individual' (tem perfil_id) | 'equipe' (perfil_id null)
-- periodo: 'semanal' | 'mensal' | 'trimestral'
-- Idempotente.

create table if not exists metas (
  id uuid primary key default gen_random_uuid(),
  casa text not null,
  titulo text not null,
  descricao text,
  escopo text not null default 'individual',  -- 'individual' | 'equipe'
  perfil_id uuid references perfis(id) on delete set null,
  alvo numeric not null,
  atual numeric not null default 0,
  unidade text not null default 'un',         -- ex: 'un', '%', 'R$', 'pts'
  periodo text not null default 'mensal',      -- 'semanal' | 'mensal' | 'trimestral'
  periodo_ref text not null,                   -- ex: '2026-06' para mensal, '2026-W22' para semanal
  ativa boolean not null default true,
  created_by uuid references perfis(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists metas_casa_periodo_idx on metas(casa, periodo_ref);
create index if not exists metas_perfil_idx on metas(perfil_id);
create index if not exists metas_escopo_idx on metas(casa, escopo, ativa);
