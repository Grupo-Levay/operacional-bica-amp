"use client"

import { useTransition } from "react"
import { LogOut } from "lucide-react"
import { signOut } from "@/app/actions/auth"

export function LogoutBtn() {
  const [isPending, startTransition] = useTransition()

  function handleLogout() {
    startTransition(async () => {
      await signOut()
    })
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isPending}
      title="Sair"
      className="flex items-center justify-center size-8 rounded-full transition-colors disabled:opacity-50"
      style={{
        border: "1px solid var(--border)",
        color: "var(--color-b4)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "var(--muted)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent"
      }}
    >
      <LogOut size={15} strokeWidth={1.8} aria-hidden="true" />
    </button>
  )
}
