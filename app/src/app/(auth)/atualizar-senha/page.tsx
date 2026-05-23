import type { Metadata } from 'next'
import { AtualizarForm } from './atualizar-form'

export const metadata: Metadata = {
  title: 'Nova Senha — BiCA Operacional',
}

export default function AtualizarSenhaPage() {
  return (
    <div
      className="w-full max-w-sm rounded-xl p-8 shadow-xl"
      style={{
        backgroundColor: 'var(--color-ink3)',
        border: '1px solid var(--border)',
      }}
    >
      {/* Wordmark */}
      <div className="mb-8 flex items-baseline gap-2">
        <span
          className="font-display text-3xl leading-none select-none"
          style={{ color: 'var(--color-b1)' }}
        >
          B<em style={{ color: 'var(--color-bica)', fontStyle: 'italic' }}>i</em>CA
        </span>
        <span
          className="text-[8px] uppercase leading-tight"
          style={{ color: 'var(--color-b4)', letterSpacing: '0.36em', fontWeight: 300 }}
        >
          Oper&shy;acional
        </span>
      </div>

      <h1
        className="mb-1 text-lg font-medium leading-tight"
        style={{ color: 'var(--color-b1)' }}
      >
        Criar nova senha
      </h1>
      <p className="mb-6 text-sm" style={{ color: 'var(--color-b4)' }}>
        Escolha uma senha segura com pelo menos 8 caracteres.
      </p>

      <AtualizarForm />
    </div>
  )
}
