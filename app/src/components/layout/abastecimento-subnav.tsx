"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const TABS = [
  { href: "/compras", label: "Compras" },
  { href: "/estoque", label: "Estoque" },
] as const

export function AbastecimentoSubnav() {
  const pathname = usePathname()

  return (
    <div
      className="flex gap-1 p-1 rounded-lg w-fit"
      style={{ backgroundColor: "var(--muted)" }}
    >
      {TABS.map(({ href, label }) => {
        const active = pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className="px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
            style={
              active
                ? {
                    backgroundColor: "var(--color-bica)",
                    color: "var(--color-bica-fg)",
                  }
                : {
                    color: "var(--color-b4)",
                  }
            }
          >
            {label}
          </Link>
        )
      })}
    </div>
  )
}
