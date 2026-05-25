'use client'

import { useActionState } from 'react'
import { Loader2 } from 'lucide-react'
import { updatePassword } from '@/app/actions/auth'

const initialState = null

export function AtualizarForm() {
  const [state, action, isPending] = useActionState(updatePassword, initialState)

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="text-xs font-medium uppercase tracking-wide text-b4"
        >
          Nova senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="Mínimo 8 caracteres"
          className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-colors bg-ink2 border border-border text-b1 focus:border-bica"
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="confirm"
          className="text-xs font-medium uppercase tracking-wide text-b4"
        >
          Confirmar senha
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
          placeholder="Repita a senha"
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
            Salvando…
          </span>
        ) : (
          'Salvar nova senha'
        )}
      </button>
    </form>
  )
}
