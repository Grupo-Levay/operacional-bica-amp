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
}

export function BottomNav({ role }: BottomNavProps) {
  const pathname = usePathname()
  const allowed = rotasPermitidas(role)
  const tabs = ALL_TABS.filter(t => allowed.includes(t.href))

  const activeIndex = tabs.findIndex(t => pathname.startsWith(t.href))
  const pct = 100 / tabs.length

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[100] border-t border-border bg-card md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Limelight — spotlight que segue a tab ativa */}
      <div className="relative h-16 flex items-stretch">
        {activeIndex >= 0 && (
          <span
            className="pointer-events-none absolute top-0 bottom-0 transition-all duration-300 ease-out"
            style={{
              left: `${activeIndex * pct}%`,
              width: `${pct}%`,
              background: "radial-gradient(ellipse 60% 70% at 50% 0%, rgba(201,163,104,0.18) 0%, transparent 100%)",
            }}
          />
        )}

        {tabs.map(({ href, label, icon: Icon }, i) => {
          const active = activeIndex === i
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-1 flex-col items-center justify-center gap-0.5 relative z-10 transition-colors"
              style={{ color: active ? "var(--color-bica)" : "var(--color-b4)" }}
            >
              {active && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-8 rounded-full"
                  style={{ background: "var(--color-bica)" }}
                />
              )}
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              <span
                className="text-[9px] uppercase tracking-wider leading-none"
                style={{ fontWeight: active ? 600 : 400, letterSpacing: "0.08em" }}
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
