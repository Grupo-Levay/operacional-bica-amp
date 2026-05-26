import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BottomNav } from '@/components/layout/bottom-nav'
import { Sidebar } from '@/components/layout/sidebar'
import { OnboardingModal } from '@/components/onboarding/onboarding-modal'
import { Toaster } from '@/components/ui/toast'
import { rotasPermitidas, type Role } from '@/lib/roles'
import { getOnboardingConfig } from '@/lib/onboarding'
import { getCurrentCasa, CASAS, type Casa } from '@/lib/tenant'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [{ data: perfil }, currentCasa] = await Promise.all([
    supabase
      .from('perfis')
      .select('role, nome, onboarding_completo, casas')
      .eq('id', user.id)
      .single(),
    getCurrentCasa(),
  ])

  const role = (perfil?.role ?? 'operacional') as Role
  const rotas = rotasPermitidas(role)
  const onboardingPendente = perfil?.onboarding_completo === false

  // casas disponíveis para o usuário (null/vazio → ambas as casas para admin, só a atual para demais)
  const rawCasas = perfil?.casas as Casa[] | null
  const availableCasas: Casa[] =
    rawCasas && rawCasas.length > 0 ? rawCasas : Array.from(CASAS)

  return (
    <div className="flex min-h-screen">
      {/* Sidebar — desktop only */}
      <Sidebar role={role} currentCasa={currentCasa} availableCasas={availableCasas} />

      {/* Conteúdo principal */}
      <div className="flex flex-col flex-1 md:pl-56">
        <main className="flex-1 pb-20 md:pb-8">{children}</main>
        {/* Bottom nav — mobile only */}
        <BottomNav role={role} />
      </div>

      {/* Onboarding — exibido apenas no primeiro acesso */}
      {onboardingPendente && (
        <OnboardingModal
          config={getOnboardingConfig(role, rotas)}
          nomeUsuario={perfil?.nome}
        />
      )}

      <Toaster />
    </div>
  )
}
