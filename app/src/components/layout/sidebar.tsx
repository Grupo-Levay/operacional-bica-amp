"use client"

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
]

interface SidebarProps {
  role: Role
  currentCasa: Casa
  availableCasas: Casa[]
}

export function Sidebar({ role, currentCasa, availableCasas }: SidebarProps) {
  const pathname = usePathname()
  const allowed = rotasPermitidas(role)
  const tabs = ALL_TABS.filter(t => allowed.includes(t.href))

  return (
    <aside
      className="hidden md:flex fixed inset-y-0 left-0 z-30 w-56 flex-col bg-ink2 border-r border-border"
    >
      {/* Wordmark + Casa Switcher */}
      <div
        className="flex h-16 shrink-0 items-center justify-between gap-3 px-4 border-b border-border"
      >
        <div className="flex items-center gap-2">
          <span
            className="font-display text-[26px] leading-none select-none text-b1"
          >
            B<em className="text-bica italic">i</em>CA
          </span>
          <span
            className="text-[8px] uppercase leading-tight text-b4 tracking-[0.36em] font-light pt-[2px]"
          >
            Oper&shy;acional
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
                  className={`flex items-center gap-3 rounded-md px-3 min-h-[52px] py-[10px] transition-colors border-l-2 ${
                    active
                      ? "bg-bica-light text-bica border-bica"
                      : "bg-transparent text-b4 border-transparent"
                  }`}
                >
                  <Icon
                    size={17}
                    strokeWidth={active ? 2.5 : 1.8}
                    aria-hidden="true"
                  />
                  <span
                    className={`text-sm tracking-wide ${active ? "font-medium" : "font-normal"}`}
                  >
                    {label}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Rodapé */}
      <div
        className="shrink-0 px-4 py-4 flex items-center justify-between border-t border-border"
      >
        <p
          className="text-[8px] uppercase text-b4 tracking-[0.38em] opacity-50"
        >
          Bica &amp; AMP 213
        </p>
        <LogoutBtn />
      </div>
    </aside>
  )
}
