'use client'

import { useTransition } from 'react'
import { LogOut } from 'lucide-react'
import { logout } from '@/app/actions/auth'

export function LogoutBtn() {
  const [isPending, startTransition] = useTransition()

  function handleLogout() {
    startTransition(async () => {
      await logout()
    })
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isPending}
      title="Sair"
      className="flex items-center justify-center size-8 rounded-full border transition-colors hover:bg-accent disabled:opacity-50"
    >
      <LogOut size={15} />
    </button>
  )
}
