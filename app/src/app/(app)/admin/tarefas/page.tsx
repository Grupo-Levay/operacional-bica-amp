import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentCasa } from '@/lib/tenant'
import { PageHeader } from '@/components/shared/page-header'
import { KanbanBoard } from '@/components/tarefas/kanban-board'
import { NovaTarefaForm } from '@/components/tarefas/nova-tarefa-form'

export default async function AdminTarefasPage() {
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

  const { data: tarefas } = await supabase
    .from('tarefas')
    .select('*, atribuido:perfis!tarefas_perfil_id_fkey(nome)')
    .eq('casa', casa)
    .order('created_at', { ascending: false })

  const { data: equipe } = await supabase
    .from('equipe')
    .select('id, nome, funcao, perfil_id')
    .eq('casa', casa)
    .eq('ativo', true)
    .order('nome')

  // Perfis vinculados a membros da equipe para atribuição
  const perfilIds = (equipe ?? []).map((m) => m.perfil_id).filter(Boolean) as string[]
  const { data: perfisEquipe } = perfilIds.length
    ? await supabase.from('perfis').select('id, nome').in('id', perfilIds)
    : { data: [] }

  return (
    <main className="p-4 space-y-4 pb-24">
      <PageHeader
        title="Tarefas"
        subtitle="Distribua e acompanhe tarefas da equipe"
      />

      <NovaTarefaForm perfis={perfisEquipe ?? []} />

      <KanbanBoard tarefas={tarefas ?? []} perfis={perfisEquipe ?? []} />
    </main>
  )
}
