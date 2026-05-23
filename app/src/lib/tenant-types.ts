export type Casa = "bica" | "amp"

export const CASAS: readonly Casa[] = ["bica", "amp"] as const

export const CASA_LABELS: Record<Casa, string> = {
  bica: "Bica Bar",
  amp: "AMP 213",
}
