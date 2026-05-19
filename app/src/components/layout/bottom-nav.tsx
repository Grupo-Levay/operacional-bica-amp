"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, CheckSquare, Layers, Calendar, ChefHat, CalendarCheck } from "lucide-react"

type Tab = {
  href: string
  label: string
  icon: React.ElementType
  match: (pathname: string) => boolean
}

const tabs: Tab[] = [
  { href: "/dashboard",  label: "Início",       icon: Home,          match: (p) => p.startsWith("/dashboard") },
  { href: "/checklists", label: "Checklists",   icon: CheckSquare,   match: (p) => p.startsWith("/checklists") },
  { href: "/estoque",    label: "Abastec.",     icon: Layers,        match: (p) => p.startsWith("/estoque") || p.startsWith("/compras") },
  { href: "/escala",     label: "Escala",       icon: Calendar,      match: (p) => p.startsWith("/escala") },
  { href: "/fichas",     label: "Fichas",       icon: ChefHat,       match: (p) => p.startsWith("/fichas") },
  { href: "/reservas",   label: "Reservas",     icon: CalendarCheck, match: (p) => p.startsWith("/reservas") },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[100] border-t bg-background"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex h-16 items-stretch">
        {tabs.map(({ href, label, icon: Icon, match }) => {
          const active = match(pathname)
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
