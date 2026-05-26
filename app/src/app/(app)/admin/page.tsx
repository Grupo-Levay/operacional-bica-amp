import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
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

  const { data: perfis } = await supabase
    .from("perfis")
    .select("id, nome, role, created_at")
    .order("created_at")

  return { user, perfis: perfis ?? [] }
}

export default async function AdminPage() {
  const { user, perfis } = await getAdminData()
  const total = perfis.length

  return (
    <main className="p-4 space-y-4">
      <PageHeader
        title="Usuários"
        subtitle="Gestão de usuários e roles"
        badge={`${total} ${total === 1 ? 'usuário' : 'usuários'}`}
      />

      <UsuariosTable perfis={perfis} currentUserId={user.id} />
    </main>
  )
}
