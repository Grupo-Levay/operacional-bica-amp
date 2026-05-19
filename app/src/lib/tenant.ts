import { cookies, headers } from "next/headers"

export type Casa = "bica" | "amp"

export const CASAS: readonly Casa[] = ["bica", "amp"] as const

export const CASA_LABELS: Record<Casa, string> = {
  bica: "Bica Bar",
  amp: "AMP 213",
}

const COOKIE_NAME = "casa_atual"

function fromHost(host: string | null): Casa | null {
  if (!host) return null
  if (host.includes("bica.bar")) return "bica"
  if (host.includes("amp213") || host.includes("amp.")) return "amp"
  return null
}

export async function getCurrentCasa(): Promise<Casa> {
  const cookieStore = await cookies()
  const override = cookieStore.get(COOKIE_NAME)?.value
  if (override === "bica" || override === "amp") return override

  const headerStore = await headers()
  const fromSubdomain = fromHost(headerStore.get("host"))
  if (fromSubdomain) return fromSubdomain

  return "bica"
}

export async function setCurrentCasa(casa: Casa): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, casa, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
  })
}
