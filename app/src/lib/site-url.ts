import { headers } from 'next/headers'

/**
 * Resolve a URL base do site para redirects (ex: e-mail de reset de senha).
 * Prioriza NEXT_PUBLIC_SITE_URL; se ausente, deriva do host da request atual.
 * Evita fallback hardcoded que poderia redirecionar entre ambientes por engano.
 */
export async function getSiteUrl(): Promise<string> {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL
  if (fromEnv) return fromEnv.replace(/\/$/, '')

  const h = await headers()
  const host = h.get('host')
  if (host) {
    const proto = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https')
    return `${proto}://${host}`
  }

  throw new Error('NEXT_PUBLIC_SITE_URL não definido e host indisponível.')
}
