"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { abrirRodada } from "@/app/actions/compras"

export function NovaRodadaButton() {
  const [aberto, setAberto] = useState(false)
  const [nome, setNome] = useState("")
  const [, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const nomeFinal = nome.trim() || `Rodada ${new Date().toLocaleDateString("pt-BR")}`
    startTransition(async () => {
      await abrirRodada(nomeFinal)
      setNome("")
      setAberto(false)
    })
  }

  if (!aberto) {
    return (
      <Button
        size="sm"
        onClick={() => setAberto(true)}
        style={{ backgroundColor: "var(--color-bica)", color: "#fff" }}
      >
        Nova Rodada
      </Button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder={`Rodada ${new Date().toLocaleDateString("pt-BR")}`}
        autoFocus
        className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-bica)]"
      />
      <Button
        type="submit"
        size="sm"
        style={{ backgroundColor: "var(--color-bica)", color: "#fff" }}
      >
        Criar
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => { setAberto(false); setNome("") }}
      >
        ✕
      </Button>
    </form>
  )
}
