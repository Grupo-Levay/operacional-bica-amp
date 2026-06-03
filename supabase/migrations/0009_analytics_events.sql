-- 0009 — Observability self-hosted: tabela única de eventos
-- Cobre eventos de uso, erros e timings de performance (web vitals) numa só tabela.
--   status  = 'success' | 'error'        → distingue evento normal de erro
--   duration_ms                          → timing de Server Action (via withAnalytics)
--   value                                → valor numérico de métrica (ex: web vitals)
--   error_message                        → mensagem do erro capturado
-- Isolamento por casa garantido na aplicação (RLS relaxada, padrão migration 0002).
-- Idempotente. Aplicar via Supabase MCP (root supabase/ não é auto-aplicado).

create table if not exists public.analytics_events (
  id            uuid primary key default gen_random_uuid(),
  casa          text not null,
  user_id       uuid,                              -- nullable: web vitals podem ser anon
  action        text not null,                     -- 'reserva.criar', 'web_vital.LCP', ...
  status        text not null default 'success'
                  check (status in ('success','error')),
  duration_ms   integer,
  value         numeric,
  error_message text,
  metadata      jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now()
);

create index if not exists analytics_events_casa_action_idx
  on public.analytics_events(casa, action);
create index if not exists analytics_events_created_at_idx
  on public.analytics_events(created_at desc);
create index if not exists analytics_events_errors_idx
  on public.analytics_events(casa, created_at desc) where status = 'error';

-- RLS relaxada: isolamento na aplicação (padrão migration 0002).
alter table public.analytics_events enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'analytics_events'
      and policyname = 'analytics_events_select'
  ) then
    create policy analytics_events_select on public.analytics_events for select using (true);
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'analytics_events'
      and policyname = 'analytics_events_insert'
  ) then
    create policy analytics_events_insert on public.analytics_events for insert with check (true);
  end if;
end $$;
