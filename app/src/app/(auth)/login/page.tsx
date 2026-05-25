import type { Metadata } from 'next'
import { LoginForm } from './login-form'

export const metadata: Metadata = {
  title: 'Entrar — BiCA Operacional',
}

export default function LoginPage() {
  return (
    <div
      className="w-full max-w-sm rounded-xl p-8 shadow-xl bg-ink3 border border-border"
    >
      {/* Wordmark */}
      <div className="mb-8 flex items-baseline gap-2">
        <span
          className="font-display text-3xl leading-none select-none text-b1"
        >
          B<em className="text-bica italic">i</em>CA
        </span>
        <span
          className="text-[8px] uppercase leading-tight text-b4 tracking-[0.36em] font-light"
        >
          Oper&shy;acional
        </span>
      </div>

      <h1
        className="mb-1 text-lg font-medium leading-tight text-b1"
      >
        Bem-vindo de volta
      </h1>
      <p className="mb-6 text-sm text-b4">
        Entre com seu e-mail e senha para continuar.
      </p>

      <LoginForm />
    </div>
  )
}
