"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, CheckSquare, ShoppingCart, Package, Calendar, ChefHat, CalendarCheck, ShieldCheck } from "lucide-react"
import { rotasPermitidas, type Role } from "@/lib/roles"

const ALL_TABS = [
  { href: "/dashboard",   label: "Início",      icon: Home },
  { href: "/checklists",  label: "Checklists",  icon: CheckSquare },
  { href: "/compras",     label: "Compras",     icon: ShoppingCart },
  { href: "/estoque",     label: "Estoque",     icon: Package },
  { href: "/escala",      label: "Escala",      icon: Calendar },
  { href: "/reservas",    label: "Reservas",    icon: CalendarCheck },
  { href: "/fichas",      label: "Fichas",      icon: ChefHat },
  { href: "/admin",       label: "Admin",       icon: ShieldCheck },
]

interface BottomNavProps {
  role: Role
  className?: string
}

export function BottomNav({ role, className }: BottomNavProps) {
  const pathname = usePathname()
  const allowed = rotasPermitidas(role)
  const tabs = ALL_TABS.filter((t) => allowed.includes(t.href))

  const activeIndex = tabs.findIndex((t) => pathname.startsWith(t.href))
  const pct = 100 / tabs.length

  return (
    <nav
      aria-label="Navegação móvel"
      className={`${className || ""} fixed bottom-0 left-0 right-0 z-[100] border-t border-border bg-ink2/85 backdrop-blur-md md:hidden pb-[env(safe-area-inset-bottom)]`}
    >
      <div className="relative h-16 flex items-stretch">
        {/* Limelight — spotlight that follows the active tab */}
        {activeIndex >= 0 && (
          <span
            className="pointer-events-none absolute top-0 bottom-0 transition-all duration-300 ease-out [background:radial-gradient(ellipse_60%_70%_at_50%_0%,rgba(var(--color-primary-dynamic-rgb),0.18)_0%,transparent_100%)]"
            style={{ left: `${activeIndex * pct}%`, width: `${pct}%` }}
          />
        )}

        {tabs.map(({ href, label, icon: Icon }, i) => {
          const active = activeIndex === i
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-1 flex-col items-center justify-center gap-1 relative z-10 transition-all duration-200 active:scale-95 ${
                active ? "text-primary" : "text-b4"
              }`}
              style={{ minHeight: "52px" }}
            >
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-8 rounded-full bg-primary" />
              )}
              <Icon size={20} strokeWidth={active ? 2.5 : 1.8} aria-hidden="true" />
              <span className={`text-[10px] font-medium leading-none ${active ? "font-semibold text-primary" : "font-normal"}`}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
