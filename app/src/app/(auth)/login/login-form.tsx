'use client'

import { useActionState } from 'react'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { signIn } from '@/app/actions/auth'

const initialState = null

export function LoginForm() {
  const [state, action, isPending] = useActionState(signIn, initialState)

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="text-xs font-medium uppercase tracking-wide text-b4"
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
          className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-colors bg-ink2 border border-border text-b1 focus:border-bica"
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="text-xs font-medium uppercase tracking-wide text-b4"
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
          className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-colors bg-ink2 border border-border text-b1 focus:border-bica"
        />
      </div>

      {state?.error && (
        <p
          className="rounded-lg px-3 py-2 text-sm bg-danger-bg text-danger"
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 w-full rounded-lg py-2.5 text-sm font-medium transition-opacity disabled:opacity-60 bg-bica text-ink2"
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

      <Link
        href="/recuperar-senha"
        className="mt-3 flex justify-center text-xs transition-opacity hover:opacity-80 text-b4"
      >
        Esqueceu a senha?
      </Link>
    </form>
  )
}
