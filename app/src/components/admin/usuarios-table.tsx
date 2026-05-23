"use client"

import { useTransition } from "react"
import { atualizarRole } from "@/app/actions/admin"
import type { Role } from "@/lib/roles"

const ROLES: Role[] = ["super_admin", "admin", "operacional", "estoque", "cmv", "bar"]

const ROLE_LABEL: Record<Role, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  operacional: "Operacional",
  estoque: "Estoque",
  cmv: "CMV",
  bar: "Bar",
}

type Perfil = {
  id: string
  nome: string | null
  role: string
  created_at: string | null
}

type Props = {
  perfis: Perfil[]
  currentUserId: string
}

export function UsuariosTable({ perfis, currentUserId }: Props) {
  const [isPending, startTransition] = useTransition()

  function handleRoleChange(userId: string, novoRole: Role) {
    startTransition(async () => {
      await atualizarRole(userId, novoRole)
    })
  }

  return (
    <div className="divide-y divide-border rounded-lg border border-border overflow-hidden">
      {perfis.map((perfil) => {
        const isSelf = perfil.id === currentUserId
        return (
          <div
            key={perfil.id}
            className="flex items-center justify-between gap-3 px-4 py-3"
            style={{ backgroundColor: "var(--color-ink2)" }}
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-tight truncate">
                {perfil.nome ?? "Sem nome"}
                {isSelf && (
                  <span
                    className="ml-2 text-[10px] font-semibold px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: "var(--color-bica-light)",
                      color: "var(--color-bica)",
                    }}
                  >
                    você
                  </span>
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 font-mono truncate">
                {perfil.id.slice(0, 8)}…
              </p>
            </div>

            <select
              disabled={isPending || isSelf}
              value={perfil.role}
              onChange={(e) => handleRoleChange(perfil.id, e.target.value as Role)}
              className="text-xs rounded border border-border bg-background px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[var(--color-bica)] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ color: "var(--color-b2)" }}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABEL[r]}
                </option>
              ))}
            </select>
          </div>
        )
      })}
    </div>
  )
}
