"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { setCasaAction } from "@/app/actions/auth"
import { CASA_LABELS, type Casa } from "@/lib/tenant"

interface CasaSwitcherProps {
  currentCasa: Casa
  availableCasas: Casa[]
}

export function CasaSwitcher({ currentCasa, availableCasas }: CasaSwitcherProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  if (availableCasas.length <= 1) return null

  const otherCasas = availableCasas.filter((c) => c !== currentCasa)
  const next = otherCasas[0]

  function handleSwitch() {
    startTransition(async () => {
      await setCasaAction(next)
      router.refresh()
    })
  }

  const dotColor =
    currentCasa === "bica" ? "var(--color-bica)" : "var(--color-amp)"

  return (
    <button
      type="button"
      onClick={handleSwitch}
      disabled={isPending}
      title={`Trocar para ${CASA_LABELS[next]}`}
      className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors disabled:opacity-50"
      style={{
        border: "1px solid var(--border)",
        color: "var(--color-b3)",
        backgroundColor: "transparent",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "var(--color-bica-light)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent"
      }}
    >
      <span
        className="size-2 rounded-full shrink-0"
        style={{ backgroundColor: dotColor }}
      />
      <span style={{ color: "var(--color-b2)" }}>{CASA_LABELS[currentCasa]}</span>
    </button>
  )
}
