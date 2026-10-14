-- 0010_fix_perfis_rls_recursion
-- Corrige recursão infinita (Postgres 42P17) na RLS de `perfis`.
--
-- As políticas `perfil_admin_read`/`perfil_admin_update` consultavam `perfis`
-- de dentro de uma política da própria `perfis` (subquery `EXISTS (SELECT 1
-- FROM perfis ...)`), causando recursão infinita. Resultado: TODA leitura
-- autenticada de `perfis` falhava → o layout não conseguia ler o role do
-- usuário → o app caía no fallback `'operacional'` para todos, escondendo
-- Admin/Compras inclusive de super_admin/admin (rota /admin inacessível).
--
-- Fix: função SECURITY DEFINER `is_admin()` que lê o role do caller sem
-- disparar RLS sobre `perfis`. As políticas passam a chamá-la (sem recursão).
-- A política `perfil_self_read` (auth.uid() = id) permanece e cobre a leitura
-- do próprio perfil para qualquer usuário.

create or replace function public.is_admin()
  returns boolean
  language sql
  security definer
  stable
  set search_path = public
as $$
  select exists (
    select 1 from public.perfis
    where id = auth.uid() and role in ('super_admin','admin')
  );
$$;

drop policy if exists perfil_admin_read on public.perfis;
create policy perfil_admin_read on public.perfis
  for select using (public.is_admin());

drop policy if exists perfil_admin_update on public.perfis;
create policy perfil_admin_update on public.perfis
  for update using (public.is_admin());
