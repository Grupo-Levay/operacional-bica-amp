import { cookies, headers } from "next/headers"
import type { Casa } from "@/lib/tenant-types"
export type { Casa } from "@/lib/tenant-types"
export { CASAS, CASA_LABELS } from "@/lib/tenant-types"

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
