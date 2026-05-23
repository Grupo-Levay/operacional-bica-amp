import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { UsuariosTable } from "@/components/admin/usuarios-table"
import { Users } from "lucide-react"

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

  return (
    <main className="p-4 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1
            className="font-display text-2xl"
            style={{ color: "var(--color-bica)" }}
          >
            Admin
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Gestão de usuários e roles
          </p>
        </div>
        <div
          className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 shrink-0"
        >
          <Users size={13} />
          <span>{perfis.length} {perfis.length === 1 ? "usuário" : "usuários"}</span>
        </div>
      </div>

      <UsuariosTable perfis={perfis} currentUserId={user.id} />
    </main>
  )
}
