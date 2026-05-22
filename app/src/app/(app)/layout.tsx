import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BottomNav } from '@/components/layout/bottom-nav'
import { Sidebar } from '@/components/layout/sidebar'
import type { Role } from '@/lib/roles'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: perfil } = await supabase
    .from('perfis')
    .select('role, nome')
    .eq('id', user.id)
    .single()

  const role = (perfil?.role ?? 'operacional') as Role

  return (
    <div className="flex min-h-screen">
      {/* Sidebar — desktop only */}
      <Sidebar role={role} />

      {/* Conteúdo principal */}
      <div className="flex flex-col flex-1 md:pl-56">
        <main className="flex-1 pb-20 md:pb-8">{children}</main>
        {/* Bottom nav — mobile only */}
        <BottomNav role={role} />
      </div>
    </div>
  )
}
