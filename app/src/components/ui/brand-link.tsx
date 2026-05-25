import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface BrandLinkProps {
  href: string
  children: React.ReactNode
  badge?: React.ReactNode
  className?: string
}

export function BrandLink({ href, children, badge, className }: BrandLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center justify-center gap-2 rounded-lg px-4 min-h-[52px]",
        "bg-bica text-[#14100D] font-semibold transition-opacity",
        "hover:opacity-90 active:opacity-80",
        className
      )}
    >
      {children}
      {badge && (
        <span className="ml-1 rounded-full bg-black/20 px-2 py-0.5 text-xs font-bold">
          {badge}
        </span>
      )}
    </Link>
  )
}
