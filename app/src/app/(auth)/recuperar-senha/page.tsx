import type { Metadata } from 'next'
import Link from 'next/link'
import { RecuperarForm } from './recuperar-form'

export const metadata: Metadata = {
  title: 'Recuperar Senha — BiCA Operacional',
}

export default function RecuperarSenhaPage() {
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
        Recuperar senha
      </h1>
      <p className="mb-6 text-sm text-b4">
        Digite seu e-mail e enviaremos um link para redefinir sua senha.
      </p>

      <RecuperarForm />

      <Link
        href="/login"
        className="mt-4 flex justify-center text-xs transition-opacity hover:opacity-80 text-b4"
      >
        Voltar para o login
      </Link>
    </div>
  )
}
