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
import { type Casa } from "@/lib/tenant"
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
      className="hidden md:flex fixed inset-y-0 left-0 z-30 w-56 flex-col"
      style={{
        backgroundColor: "var(--color-ink2)",
        borderRight: "1px solid var(--border)",
      }}
    >
      {/* Wordmark + Casa Switcher */}
      <div
        className="flex h-16 shrink-0 items-center justify-between gap-3 px-4"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2">
          <span
            className="font-display text-[26px] leading-none select-none"
            style={{ color: "var(--color-b1)" }}
          >
            B<em style={{ color: "var(--color-bica)", fontStyle: "italic" }}>i</em>CA
          </span>
          <span
            className="text-[8px] uppercase leading-tight"
            style={{
              color: "var(--color-b4)",
              letterSpacing: "0.36em",
              fontWeight: 300,
              paddingTop: "2px",
            }}
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
                  className="flex items-center gap-3 rounded-md px-3 transition-colors"
                  style={{
                    minHeight: "44px",
                    paddingTop: "10px",
                    paddingBottom: "10px",
                    backgroundColor: active
                      ? "var(--color-bica-light)"
                      : "transparent",
                    color: active ? "var(--color-bica)" : "var(--color-b4)",
                    borderLeft: active
                      ? "2px solid var(--color-bica)"
                      : "2px solid transparent",
                  }}
                >
                  <Icon
                    size={17}
                    strokeWidth={active ? 2.5 : 1.8}
                    aria-hidden="true"
                  />
                  <span
                    className="text-sm tracking-wide"
                    style={{ fontWeight: active ? 500 : 400 }}
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
        className="shrink-0 px-4 py-4 flex items-center justify-between"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <p
          className="text-[8px] uppercase"
          style={{ color: "var(--color-b4)", letterSpacing: "0.38em", opacity: 0.5 }}
        >
          Bica &amp; AMP 213
        </p>
        <LogoutBtn />
      </div>
    </aside>
  )
}
