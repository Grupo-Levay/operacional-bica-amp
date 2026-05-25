"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { setCasaAction } from "@/app/actions/auth"
import { CASA_LABELS, type Casa } from "@/lib/tenant-types"

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

  return (
    <button
      type="button"
      onClick={handleSwitch}
      disabled={isPending}
      title={`Trocar para ${CASA_LABELS[next]}`}
      className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors disabled:opacity-50 border border-border text-b3 bg-transparent hover:bg-bica-light"
    >
      <span
        className={`size-2 rounded-full shrink-0 ${currentCasa === "bica" ? "bg-bica" : "bg-amp"}`}
      />
      <span className="text-b2">{CASA_LABELS[currentCasa]}</span>
    </button>
  )
}
