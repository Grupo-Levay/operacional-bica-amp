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
} from "lucide-react"

const tabs = [
  { href: "/dashboard",  label: "Início",     icon: Home },
  { href: "/checklists", label: "Checklists", icon: CheckSquare },
  { href: "/compras",    label: "Compras",    icon: ShoppingCart },
  { href: "/estoque",    label: "Estoque",    icon: Package },
  { href: "/escala",     label: "Escala",     icon: Calendar },
  { href: "/fichas",     label: "Fichas",     icon: ChefHat },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="hidden md:flex fixed inset-y-0 left-0 z-30 w-56 flex-col"
      style={{
        backgroundColor: "var(--color-ink2)",
        borderRight: "1px solid var(--border)",
      }}
    >
      {/* Wordmark */}
      <div
        className="flex h-16 shrink-0 items-center gap-3 px-6"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
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
        className="shrink-0 px-6 py-4"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <p
          className="text-[8px] uppercase"
          style={{ color: "var(--color-b4)", letterSpacing: "0.38em", opacity: 0.5 }}
        >
          Bica &amp; AMP 213
        </p>
      </div>
    </aside>
  )
}
