'use client'

import { useEffect, useState } from 'react'
import { z } from 'zod'

/** Marca ativa do painel. Persistida em localStorage e sincronizada
 *  entre componentes via evento `brandchange`. */
export type Brand = 'bica' | 'amp'

const BRAND_KEY = 'bica-brand'
const brandSchema = z.enum(['bica', 'amp'])

/** Lê a marca do localStorage com validação — fallback seguro em valor inválido. */
function lerBrand(): Brand {
  if (typeof window === 'undefined') return 'bica'
  const parsed = brandSchema.safeParse(localStorage.getItem(BRAND_KEY))
  return parsed.success ? parsed.data : 'bica'
}

/**
 * Hook de marca ativa. Inicializa de forma estável (SSR-safe) e reage a
 * mudanças disparadas por `window.dispatchEvent(new Event('brandchange'))`.
 */
export function useBrand(): Brand {
  const [brand, setBrand] = useState<Brand>('bica')

  useEffect(() => {
    const sync = () => setBrand(lerBrand())
    sync()
    window.addEventListener('brandchange', sync)
    return () => window.removeEventListener('brandchange', sync)
  }, [])

  return brand
}
