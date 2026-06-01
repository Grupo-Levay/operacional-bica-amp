"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  CheckSquare,
  ShoppingCart,
  Package,
  Calendar,
  ChefHat,
  CalendarCheck,
  ShieldCheck,
  User,
} from "lucide-react"
import { rotasPermitidas, type Role } from "@/lib/roles"
import { type Casa } from "@/lib/tenant-types"
import { CasaSwitcher } from "@/components/layout/casa-switcher"
import { LogoutBtn } from "@/components/layout/logout-btn"

const ALL_TABS = [
  { href: "/dashboard",  label: "Início",     icon: Home },
  { href: "/checklists", label: "Checklists", icon: CheckSquare },
  { href: "/compras",    label: "Compras",    icon: ShoppingCart },
  { href: "/estoque",    label: "Estoque",    icon: Package },
  { href: "/escala",     label: "Escala",     icon: Calendar },
  { href: "/reservas",   label: "Reservas",   icon: CalendarCheck },
  { href: "/fichas",     label: "Fichas",     icon: ChefHat },
  { href: "/admin",      label: "Admin",      icon: ShieldCheck },
  { href: "/perfil",     label: "Perfil",     icon: User },
]

interface SidebarProps {
  role: Role
  currentCasa: Casa
  availableCasas: Casa[]
}

export function Sidebar({ role, currentCasa, availableCasas }: SidebarProps) {
  const pathname = usePathname()
  const allowed = rotasPermitidas(role)
  const tabs = ALL_TABS.filter((t) => allowed.includes(t.href))

  return (
    <aside className="hidden md:flex fixed inset-y-0 left-0 z-30 w-56 flex-col border-r border-border bg-ink2/80 backdrop-blur-md">
      {/* Wordmark + Casa Switcher */}
      <div className="flex h-16 shrink-0 items-center justify-between gap-3 px-4 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="font-display text-[26px] leading-none select-none text-b1">
            B<em className="text-primary italic">i</em>CA
          </span>
          <span className="text-[8px] uppercase leading-tight text-b4 tracking-[0.36em] font-light pt-[2px]">
            Operacional
          </span>
        </div>
        <CasaSwitcher currentCasa={currentCasa} availableCasas={availableCasas} />
      </div>

      {/* Navegação */}
      <nav className="flex-1 overflow-y-auto py-3 px-2" aria-label="Navegação principal">
        <ul className="flex flex-col gap-0.5">
          {tabs.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-md px-3 min-h-[52px] py-[10px] transition-all border-l-2 ${
                    active
                      ? "bg-primary/10 text-primary border-primary font-medium"
                      : "bg-transparent text-b4 border-transparent hover:bg-white/5 hover:text-b1"
                  }`}
                >
                  <Icon
                    size={17}
                    strokeWidth={active ? 2.5 : 1.8}
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:scale-110"
                  />
                  <span className="text-sm tracking-wide">
                    {label}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Rodapé */}
      <div className="shrink-0 p-4 border-t border-border flex flex-col gap-3 bg-black/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            <span className="text-xs font-medium text-b3">Operação Ativa</span>
          </div>
          <span className="text-[9px] text-b4 font-mono">v1.2.0-pos</span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-border/40">
          <p className="text-[8px] uppercase text-b4 tracking-[0.38em] opacity-50">
            Bica &amp; AMP 213
          </p>
          <LogoutBtn />
        </div>
      </div>
    </aside>
  )
}
