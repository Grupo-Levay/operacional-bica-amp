export function periodoRefAtual(periodo: 'semanal' | 'mensal' | 'trimestral'): string {
  const now = new Date()
  const ano = now.getFullYear()
  const mes = String(now.getMonth() + 1).padStart(2, '0')

  if (periodo === 'mensal') return `${ano}-${mes}`

  if (periodo === 'trimestral') {
    const trimestre = Math.ceil((now.getMonth() + 1) / 3)
    return `${ano}-Q${trimestre}`
  }

  // semanal: ISO week number
  const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return `${ano}-W${String(week).padStart(2, '0')}`
}

export function pctProgresso(atual: number, alvo: number): number {
  if (alvo <= 0) return 0
  return Math.min(100, Math.round((atual / alvo) * 100))
}

export function corProgresso(pct: number): string {
  if (pct >= 100) return 'text-success'
  if (pct >= 60) return 'text-warning'
  return 'text-danger'
}

export function bgProgresso(pct: number): string {
  if (pct >= 100) return 'bg-success'
  if (pct >= 60) return 'bg-warning'
  return 'bg-danger'
}
