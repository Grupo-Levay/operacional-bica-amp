import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentCasa } from '@/lib/tenant'
import { PageHeader } from '@/components/shared/page-header'
import { NovaMetaForm } from '@/components/metas/nova-meta-form'
import { MetasList } from '@/components/metas/metas-list'
import { periodoRefAtual } from '@/lib/metas-utils'

export default async function AdminMetasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: meu } = await supabase
    .from('perfis')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!meu || !['super_admin', 'admin'].includes(meu.role)) redirect('/dashboard')

  const casa = await getCurrentCasa()
  const periodoRef = periodoRefAtual('mensal')

  const { data: metas } = await supabase
    .from('metas')
    .select('*, atribuido:perfis!metas_perfil_id_fkey(nome)')
    .eq('casa', casa)
    .eq('ativa', true)
    .order('created_at', { ascending: false })

  const { data: equipe } = await supabase
    .from('equipe')
    .select('id, nome, perfil_id')
    .eq('casa', casa)
    .eq('ativo', true)
    .order('nome')

  const perfilIds = (equipe ?? []).map((m) => m.perfil_id).filter(Boolean) as string[]
  const { data: perfisEquipe } = perfilIds.length
    ? await supabase.from('perfis').select('id, nome').in('id', perfilIds)
    : { data: [] }

  return (
    <main className="p-4 space-y-4 pb-24">
      <PageHeader
        title="Metas"
        subtitle="Defina e acompanhe metas individuais e de equipe"
      />

      <NovaMetaForm perfis={perfisEquipe ?? []} periodoRefDefault={periodoRef} />

      <MetasList metas={metas ?? []} isAdmin />
    </main>
  )
}
