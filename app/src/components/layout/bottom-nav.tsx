"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, CheckSquare, ShoppingCart, Package, Calendar, ChefHat } from "lucide-react"

const tabs = [
  { href: "/dashboard",   label: "Início",      icon: Home },
  { href: "/checklists",  label: "Checklists",  icon: CheckSquare },
  { href: "/compras",     label: "Compras",     icon: ShoppingCart },
  { href: "/estoque",     label: "Estoque",     icon: Package },
  { href: "/escala",      label: "Escala",      icon: Calendar },
  { href: "/fichas",      label: "Fichas",      icon: ChefHat },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[100] border-t bg-background"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex h-16 items-stretch">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors"
              style={{
                color: active ? "var(--color-bica)" : "var(--color-neutral-500, #71717a)",
                minHeight: "52px",
              }}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              <span
                className="text-[10px] leading-none"
                style={{ fontWeight: active ? 600 : 400 }}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
