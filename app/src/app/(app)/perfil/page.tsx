import { redirect } from 'next/navigation'
import { ShieldCheck, CalendarDays, Target } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getCurrentCasa } from '@/lib/tenant'
import { PageHeader } from '@/components/shared/page-header'
import { Badge } from '@/components/ui/badge'
import { rotuloRole, responsabilidadesRole, rotasPermitidas, type Role } from '@/lib/roles'
import { MinhasTarefas } from '@/components/tarefas/minhas-tarefas'
import { MetasList } from '@/components/metas/metas-list'

const TURNO_LABEL: Record<string, string> = {
  AB: 'Abertura',
  FE: 'Fechamento',
}

const NAV_LABEL: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/checklists': 'Checklists',
  '/compras': 'Compras',
  '/estoque': 'Estoque',
  '/escala': 'Escala',
  '/reservas': 'Reservas',
  '/fichas': 'Fichas',
  '/admin': 'Admin',
  '/perfil': 'Perfil',
}

interface TurnoEscala {
  data: string
  turno: string
  confirmado: boolean | null
}

function formatarData(iso: string): string {
  const [ano, mes, dia] = iso.split('-').map(Number)
  const d = new Date(ano, mes - 1, dia)
  return d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })
}

export default async function PerfilPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const casa = await getCurrentCasa()

  const { data: perfil } = await supabase
    .from('perfis')
    .select('nome, role')
    .eq('id', user.id)
    .single()

  const role = (perfil?.role ?? 'bar') as Role
  const nome = perfil?.nome?.trim() || user.email?.split('@')[0] || 'Usuário'

  // Vínculo com a equipe desta casa (se houver)
  const { data: membro } = await supabase
    .from('equipe')
    .select('id, funcao')
    .eq('perfil_id', user.id)
    .eq('casa', casa)
    .maybeSingle()

  // Próximos turnos (a partir de hoje), se vinculado à equipe
  let proximosTurnos: TurnoEscala[] = []
  if (membro?.id) {
    const hoje = new Date().toISOString().split('T')[0]
    const { data } = await supabase
      .from('escala')
      .select('data, turno, confirmado')
      .eq('membro_id', membro.id)
      .eq('casa', casa)
      .gte('data', hoje)
      .order('data')
      .limit(7)
    proximosTurnos = (data as TurnoEscala[]) ?? []
  }

  // Tarefas atribuídas ao perfil do usuário nesta casa
  const { data: tarefas } = perfil
    ? await supabase
        .from('tarefas')
        .select('id, titulo, descricao, status, prioridade, prazo')
        .eq('casa', casa)
        .eq('perfil_id', user.id)
        .neq('status', 'concluida')
        .order('created_at', { ascending: false })
        .limit(20)
    : { data: [] }

  // Metas individuais ativas atribuídas ao usuário + metas de equipe desta casa
  const { data: metas } = await supabase
    .from('metas')
    .select('id, titulo, descricao, escopo, alvo, atual, unidade, periodo, periodo_ref')
    .eq('casa', casa)
    .eq('ativa', true)
    .or(`perfil_id.eq.${user.id},escopo.eq.equipe`)
    .order('created_at', { ascending: false })

  const responsabilidades = responsabilidadesRole(role)
  const modulos = rotasPermitidas(role).filter((r) => r !== '/perfil')

  return (
    <main className="p-4 space-y-5 pb-24">
      <PageHeader title="Meu perfil" />

      {/* Cabeçalho do perfil */}
      <section className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xl font-bold text-primary">
          {nome.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-foreground">{nome}</h2>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <Badge variant="default" className="gap-1">
              <ShieldCheck size={12} aria-hidden="true" />
              {membro?.funcao || rotuloRole(role)}
            </Badge>
            {membro?.funcao && (
              <span className="text-xs text-muted-foreground">{rotuloRole(role)}</span>
            )}
          </div>
        </div>
      </section>

      {/* Responsabilidades */}
      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Responsabilidades</h3>
        {responsabilidades.length > 0 ? (
          <ul className="space-y-1.5">
            {responsabilidades.map((r) => (
              <li key={r} className="flex items-start gap-2 text-sm text-b2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                {r}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Função sem responsabilidades definidas.</p>
        )}
      </section>

      {/* Módulos com acesso */}
      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Módulos com acesso</h3>
        <div className="flex flex-wrap gap-1.5">
          {modulos.map((m) => (
            <Badge key={m} variant="secondary">
              {NAV_LABEL[m] ?? m}
            </Badge>
          ))}
        </div>
      </section>

      {/* Minha escala */}
      <section className="space-y-2">
        <h3 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <CalendarDays size={15} className="text-primary" aria-hidden="true" />
          Meus próximos turnos
        </h3>
        {!membro ? (
          <p className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
            Sua conta ainda não está vinculada a um membro da equipe. Peça a um admin para vincular
            no painel de Usuários.
          </p>
        ) : proximosTurnos.length === 0 ? (
          <p className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
            Nenhum turno agendado a partir de hoje.
          </p>
        ) : (
          <ul className="divide-y divide-border rounded-lg border border-border">
            {proximosTurnos.map((t) => (
              <li key={`${t.data}-${t.turno}`} className="flex items-center justify-between p-3 text-sm">
                <span className="capitalize text-foreground">{formatarData(t.data)}</span>
                <span className="flex items-center gap-2">
                  <span className="text-b2">{TURNO_LABEL[t.turno] ?? t.turno}</span>
                  <Badge variant={t.confirmado ? 'success' : 'secondary'} className="text-[10px]">
                    {t.confirmado ? 'Confirmado' : 'Pendente'}
                  </Badge>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Minhas tarefas */}
      <MinhasTarefas tarefas={tarefas ?? []} />

      {/* Metas & evolução */}
      <section className="space-y-2">
        <h3 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <Target size={15} className="text-primary" aria-hidden="true" />
          Metas & evolução
        </h3>
        <MetasList metas={metas ?? []} />
      </section>
    </main>
  )
}
