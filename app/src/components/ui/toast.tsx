'use client'

import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'
type Toast = { id: number; message: string; type: ToastType }
type ToastFn = (message: string) => void
type ToastAPI = { success: ToastFn; error: ToastFn; info: ToastFn }

const ToastContext = createContext<ToastAPI | null>(null)

const ICONS = {
  success: <CheckCircle size={16} className="shrink-0 text-green-400" />,
  error:   <AlertCircle size={16} className="shrink-0 text-red-400" />,
  info:    <Info        size={16} className="shrink-0 text-amber-400" />,
}

const BG: Record<ToastType, string> = {
  success: 'border-green-800/60 bg-green-950/90 text-green-100',
  error:   'border-red-800/60   bg-red-950/90   text-red-100',
  info:    'border-amber-800/60 bg-amber-950/90  text-amber-100',
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const counter = useRef(0)

  const add = useCallback((message: string, type: ToastType) => {
    const id = ++counter.current
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000)
  }, [])

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const api: ToastAPI = {
    success: (m) => add(m, 'success'),
    error:   (m) => add(m, 'error'),
    info:    (m) => add(m, 'info'),
  }

  return (
    <ToastContext.Provider value={api}>
      {children}
      {/* bottom-24 keeps toasts above mobile bottom-nav */}
      <div
        aria-live="polite"
        className="fixed bottom-24 inset-x-0 z-[200] flex flex-col items-center gap-2 px-4 pointer-events-none"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`w-full max-w-sm flex items-start gap-2.5 rounded-lg border px-3 py-2.5 shadow-lg text-sm pointer-events-auto backdrop-blur-sm ${BG[t.type]}`}
          >
            {ICONS[t.type]}
            <span className="flex-1 leading-snug">{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              className="shrink-0 opacity-50 hover:opacity-100 transition-opacity"
              aria-label="Fechar"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastAPI {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
