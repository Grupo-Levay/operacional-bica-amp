"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"
import { Home, CheckSquare, ShoppingCart, Package, Calendar, ChefHat, CalendarCheck, ShieldCheck, User } from "lucide-react"
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
  { href: "/perfil",      label: "Perfil",      icon: User },
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

  // Quando há muitas abas (admin/super_admin), a barra rola horizontalmente.
  // Centraliza a aba ativa no scroll para que ela nunca fique fora da tela.
  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = scrollRef.current?.querySelector('[aria-current="page"]')
    el?.scrollIntoView({ inline: "center", block: "nearest" })
  }, [pathname])

  return (
    <nav
      aria-label="Navegação móvel"
      className={`${className || ""} fixed bottom-0 left-0 right-0 z-[100] border-t border-border bg-ink2/85 backdrop-blur-md md:hidden pb-[env(safe-area-inset-bottom)]`}
    >
      <div
        ref={scrollRef}
        className="relative flex h-16 items-stretch overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map(({ href, label, icon: Icon }, i) => {
          const active = activeIndex === i
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              // flex-1 preenche a largura quando há poucas abas; min-w garante um
              // alvo de toque confortável quando há muitas (aí a barra rola).
              className={`relative flex min-w-[4.25rem] flex-1 flex-col items-center justify-center gap-1 px-1 transition-all duration-200 active:scale-95 ${
                active ? "text-primary" : "text-b4"
              }`}
              style={{ minHeight: "52px" }}
            >
              {active && (
                <>
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-8 rounded-full bg-primary" />
                  {/* Glow por-aba (segue a casa ativa); seguro com scroll. */}
                  <span className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_60%_70%_at_50%_0%,rgba(var(--color-primary-dynamic-rgb),0.18)_0%,transparent_100%)]" />
                </>
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
