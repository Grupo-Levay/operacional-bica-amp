import Link from "next/link"
import { redirect } from "next/navigation"
import { KanbanSquare, Target } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getCurrentCasa } from "@/lib/tenant"
import { UsuariosTable } from "@/components/admin/usuarios-table"
import { PageHeader } from "@/components/shared/page-header"

async function getAdminData() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: meu } = await supabase
    .from("perfis")
    .select("role")
    .eq("id", user.id)
    .single()

  if (!meu || !["super_admin", "admin"].includes(meu.role)) {
    redirect("/dashboard")
  }

  // Isolamento multi-tenant: admin vê apenas usuários da casa atual;
  // super_admin enxerga todos.
  let query = supabase
    .from("perfis")
    .select("id, nome, role, casas, created_at")
    .order("created_at")

  if (meu.role !== "super_admin") {
    const casa = await getCurrentCasa()
    query = query.overlaps("casas", [casa])
  }

  const { data: perfis } = await query

  // Membros da equipe da casa atual, para vincular a contas.
  const casaAtual = await getCurrentCasa()
  const { data: equipe } = await supabase
    .from('equipe')
    .select('id, nome, funcao, perfil_id')
    .eq('casa', casaAtual)
    .eq('ativo', true)
    .order('nome')

  return { user, perfis: perfis ?? [], equipe: equipe ?? [] }
}

export default async function AdminPage() {
  const { user, perfis, equipe } = await getAdminData()
  const total = perfis.length

  return (
    <main className="p-4 space-y-4">
      <PageHeader
        title="Usuários"
        subtitle="Gestão de usuários, permissões e equipe"
        badge={`${total} ${total === 1 ? 'usuário' : 'usuários'}`}
      />

      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/admin/tarefas"
          className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          <KanbanSquare size={16} className="text-primary" aria-hidden="true" />
          Tarefas (Kanban)
        </Link>
        <Link
          href="/admin/metas"
          className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          <Target size={16} className="text-primary" aria-hidden="true" />
          Metas & evolução
        </Link>
      </div>

      <UsuariosTable perfis={perfis} equipe={equipe} currentUserId={user.id} />
    </main>
  )
}
