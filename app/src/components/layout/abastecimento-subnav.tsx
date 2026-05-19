'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function AbastecimentoSubnav({ casaColor }: { casaColor: string }) {
  const pathname = usePathname()
  const isEstoque = pathname.startsWith('/estoque')

  const tabs = [
    { href: '/estoque', label: 'Estoque', active: isEstoque },
    { href: '/compras', label: 'Compras', active: !isEstoque },
  ]

  return (
    <div className="flex gap-1 p-1 rounded-lg bg-muted w-fit">
      {tabs.map(({ href, label, active }) => (
        <Link
          key={href}
          href={href}
          className="px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
          style={
            active
              ? { backgroundColor: casaColor, color: '#fff' }
              : { color: 'hsl(var(--muted-foreground))' }
          }
        >
          {label}
        </Link>
      ))}
    </div>
  )
}
