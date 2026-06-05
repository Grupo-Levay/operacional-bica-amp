"use client"

import { useTransition } from "react"
import { atualizarRole, vincularPerfilEquipe } from "@/app/actions/admin"
import { toast } from "@/components/ui/toast"
import {
  TableContainer,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
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

const ROLE_BADGE: Record<Role, string> = {
  super_admin: "bg-amp-light text-amp border border-amp/20",
  admin: "bg-primary/10 text-primary border border-primary/20",
  operacional: "bg-ink4 text-b2 border border-b3/20",
  estoque: "bg-ink4 text-b3 border border-b3/20",
  cmv: "bg-ink4 text-b3 border border-b3/20",
  bar: "bg-ink4 text-b3 border border-b3/20",
}

function getInitials(nome: string | null): string {
  if (!nome) return '?'
  const partes = nome.trim().split(/\s+/)
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase()
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
}

type Perfil = {
  id: string
  nome: string | null
  role: string
  created_at: string | null
}

type EquipeMembro = {
  id: string
  nome: string
  funcao: string
  perfil_id: string | null
}

type Props = {
  perfis: Perfil[]
  equipe: EquipeMembro[]
  currentUserId: string
}

export function UsuariosTable({ perfis, equipe, currentUserId }: Props) {
  const [isPending, startTransition] = useTransition()

  function handleRoleChange(userId: string, novoRole: Role) {
    startTransition(async () => {
      try {
        await atualizarRole(userId, novoRole)
        toast.success("Permissão atualizada")
      } catch {
        toast.error("Não foi possível atualizar a permissão")
      }
    })
  }

  function handleVincular(userId: string, equipeId: string) {
    startTransition(async () => {
      try {
        await vincularPerfilEquipe(userId, equipeId || null)
        toast.success(equipeId ? "Conta vinculada à equipe" : "Vínculo removido")
      } catch {
        toast.error("Não foi possível vincular à equipe")
      }
    })
  }

  return (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuário</TableHead>
            <TableHead>Permissão</TableHead>
            <TableHead>Vínculo de equipe</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {perfis.map((perfil) => {
            const isSelf = perfil.id === currentUserId
            const role = perfil.role as Role
            return (
              <TableRow key={perfil.id}>
                {/* Usuário: avatar + nome + badge de role + id */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-ink4 flex items-center justify-center text-xs font-semibold text-b2 select-none">
                      {getInitials(perfil.nome)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium leading-tight truncate">
                          {perfil.nome ?? "Sem nome"}
                        </p>
                        {isSelf && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-bica-light text-bica shrink-0">
                            você
                          </span>
                        )}
                        <span
                          className={cn(
                            "text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0",
                            ROLE_BADGE[role] ?? "bg-ink4 text-b3 border border-b3/20"
                          )}
                        >
                          {ROLE_LABEL[role] ?? role}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 font-mono truncate">
                        {perfil.id.slice(0, 8)}…
                      </p>
                    </div>
                  </div>
                </TableCell>

                {/* Permissão: select de role */}
                <TableCell>
                  <select
                    disabled={isPending || isSelf}
                    value={perfil.role}
                    onChange={(e) => handleRoleChange(perfil.id, e.target.value as Role)}
                    className="text-xs rounded border border-border bg-background px-2 py-1.5 text-b2 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={`Permissão de ${perfil.nome ?? 'usuário'}`}
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {ROLE_LABEL[r]}
                      </option>
                    ))}
                  </select>
                </TableCell>

                {/* Vínculo de equipe: select de membro */}
                <TableCell>
                  <select
                    disabled={isPending}
                    value={equipe.find((m) => m.perfil_id === perfil.id)?.id ?? ""}
                    onChange={(e) => handleVincular(perfil.id, e.target.value)}
                    className="text-xs rounded border border-border bg-background px-2 py-1.5 text-b2 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={`Vincular ${perfil.nome ?? 'usuário'} à equipe`}
                  >
                    <option value="">Sem vínculo de equipe</option>
                    {equipe.map((m) => {
                      const ocupadoPorOutro = m.perfil_id != null && m.perfil_id !== perfil.id
                      return (
                        <option key={m.id} value={m.id} disabled={ocupadoPorOutro}>
                          {m.nome} · {m.funcao}
                          {ocupadoPorOutro ? " (já vinculado)" : ""}
                        </option>
                      )
                    })}
                  </select>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
