'use client'

import { useActionState } from 'react'
import { Loader2 } from 'lucide-react'
import { signIn } from '@/app/actions/auth'

const initialState = null

export function LoginForm() {
  const [state, action, isPending] = useActionState(signIn, initialState)

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

      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="text-xs font-medium uppercase tracking-wide"
          style={{ color: 'var(--color-b4)' }}
        >
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
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
          style={{
            backgroundColor: 'var(--color-danger-bg)',
            color: 'var(--color-danger)',
          }}
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 w-full rounded-lg py-2.5 text-sm font-medium transition-opacity disabled:opacity-60"
        style={{
          backgroundColor: 'var(--color-bica)',
          color: 'var(--color-ink2)',
        }}
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="size-4 animate-spin" />
            Entrando…
          </span>
        ) : (
          'Entrar'
        )}
      </button>
    </form>
  )
}
