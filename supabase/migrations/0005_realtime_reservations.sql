-- 0005 — Realtime nas reservas
-- Habilita Supabase Realtime (Postgres Changes) na tabela reservations,
-- permitindo que o painel operacional atualize ao vivo entre dispositivos
-- (check-in/no-show refletem em todos os clientes sem refresh manual).
--
-- O isolamento multi-tenant é aplicado na subscription do cliente
-- (filter `casa=eq.<casa>`), coerente com a estratégia de isolamento na aplicação.
--
-- Idempotente: só adiciona a tabela à publication se ainda não estiver presente.

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and tablename = 'reservations'
  ) then
    alter publication supabase_realtime add table reservations;
  end if;
end $$;
