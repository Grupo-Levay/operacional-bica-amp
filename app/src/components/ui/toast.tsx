'use client'

import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'
type Toast = { id: number; message: string; type: ToastType }
type ToastFn = (message: string) => void
type ToastAPI = { success: ToastFn; error: ToastFn; info: ToastFn }

const ToastContext = createContext<ToastAPI | null>(null)

const ICONS = {
  success: <CheckCircle size={16} className="shrink-0 text-green-600" />,
  error:   <AlertCircle size={16} className="shrink-0 text-red-600" />,
  info:    <Info        size={16} className="shrink-0 text-blue-600" />,
}

const BG = {
  success: 'border-green-200 bg-green-50',
  error:   'border-red-200   bg-red-50',
  info:    'border-blue-200  bg-blue-50',
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const counter = useRef(0)

  const add = useCallback((message: string, type: ToastType) => {
    const id = ++counter.current
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
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
      <div
        aria-live="polite"
        className="fixed bottom-20 left-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none"
        style={{ maxWidth: 400, margin: '0 auto' }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-start gap-2.5 rounded-lg border px-3 py-2.5 shadow-md text-sm pointer-events-auto animate-in slide-in-from-bottom-2 duration-200 ${BG[t.type]}`}
          >
            {ICONS[t.type]}
            <span className="flex-1 leading-snug">{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              className="shrink-0 opacity-50 hover:opacity-100 transition-opacity"
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
