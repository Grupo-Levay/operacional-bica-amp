'use client'

import { useActionState } from 'react'
import { Loader2, CheckCircle } from 'lucide-react'
import { resetPassword } from '@/app/actions/auth'

const initialState = null

export function RecuperarForm() {
  const [state, action, isPending] = useActionState(resetPassword, initialState)

  if (state?.success) {
    return (
      <div
        className="flex flex-col items-center gap-3 rounded-lg px-4 py-5 text-center"
        style={{ backgroundColor: 'var(--color-success-bg)' }}
      >
        <CheckCircle className="size-6" style={{ color: 'var(--color-success)' }} />
        <p className="text-sm font-medium" style={{ color: 'var(--color-success)' }}>
          E-mail enviado!
        </p>
        <p className="text-xs" style={{ color: 'var(--color-b4)' }}>
          Verifique sua caixa de entrada e clique no link para redefinir sua senha.
        </p>
      </div>
    )
  }

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="text-xs font-medium uppercase tracking-wide"
          style={{ color: 'var(--color-b4)' }}
        >
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="seu@email.com"
          className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-colors"
          style={{
            backgroundColor: 'var(--color-ink2)',
            border: '1px solid var(--border)',
            color: 'var(--color-b1)',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-bica)')}
          onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
        />
      </div>

      {state?.error && (
        <p
          className="rounded-lg px-3 py-2 text-sm"
          style={{ backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)' }}
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 w-full rounded-lg py-2.5 text-sm font-medium transition-opacity disabled:opacity-60"
        style={{ backgroundColor: 'var(--color-bica)', color: 'var(--color-ink2)' }}
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="size-4 animate-spin" />
            Enviando…
          </span>
        ) : (
          'Enviar link de recuperação'
        )}
      </button>
    </form>
  )
}
