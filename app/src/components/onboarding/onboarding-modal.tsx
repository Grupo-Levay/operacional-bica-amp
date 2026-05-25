'use client'

import { useState, useTransition } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { concluirOnboarding } from '@/app/actions/onboarding'
import type { OnboardingConfig } from '@/lib/onboarding'

interface OnboardingModalProps {
  config: OnboardingConfig
  nomeUsuario?: string | null
}

export function OnboardingModal({ config, nomeUsuario }: OnboardingModalProps) {
  const [step, setStep] = useState<'welcome' | 'features' | 'done'>('welcome')
  const [isPending, startTransition] = useTransition()

  function handleConcluir() {
    startTransition(async () => {
      await concluirOnboarding()
    })
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300 bg-[rgba(12,9,7,0.85)] backdrop-blur-sm"
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4 duration-400 bg-ink3 border border-border"
      >
        {step === 'welcome' && (
          <WelcomeStep
            nomeUsuario={nomeUsuario}
            config={config}
            onNext={() => setStep('features')}
          />
        )}
        {step === 'features' && (
          <FeaturesStep
            config={config}
            onConcluir={handleConcluir}
            isPending={isPending}
          />
        )}
      </div>
    </div>
  )
}

function WelcomeStep({
  nomeUsuario,
  config,
  onNext,
}: {
  nomeUsuario?: string | null
  config: OnboardingConfig
  onNext: () => void
}) {
  const primeiroNome = nomeUsuario?.split(' ')[0]

  return (
    <div className="p-8 space-y-6">
      {/* Wordmark */}
      <span
        className="font-display text-3xl leading-none select-none block text-b1"
      >
        B<em className="text-bica italic">i</em>CA
      </span>

      <div className="space-y-2">
        <h2
          className="font-display text-2xl leading-tight text-b1"
        >
          {primeiroNome ? `Olá, ${primeiroNome}.` : 'Bem-vindo.'}
        </h2>
        <p className="text-sm leading-relaxed text-b4">
          {config.subtitulo} Vamos te mostrar o que está disponível para você nesta plataforma.
        </p>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="flex w-full items-center justify-between rounded-xl px-5 py-3.5 text-sm font-medium transition-opacity hover:opacity-90 bg-bica text-ink2"
      >
        Ver o que está disponível
        <ArrowRight className="size-4" />
      </button>
    </div>
  )
}

function FeaturesStep({
  config,
  onConcluir,
  isPending,
}: {
  config: OnboardingConfig
  onConcluir: () => void
  isPending: boolean
}) {
  return (
    <div className="p-8 space-y-6">
      <div className="space-y-1">
        <h2
          className="font-display text-xl leading-tight text-b1"
        >
          {config.titulo}
        </h2>
        <p className="text-sm text-b4">
          Estas são as seções que você tem acesso:
        </p>
      </div>

      <ul className="space-y-3">
        {config.features.map((f) => (
          <li
            key={f.label}
            className="flex items-start gap-3 rounded-lg px-3 py-2.5 bg-ink2"
          >
            <span className="text-xl leading-none mt-0.5" aria-hidden="true">{f.icon}</span>
            <div className="min-w-0">
              <p
                className="text-sm font-medium leading-none mb-1 text-b1"
              >
                {f.label}
              </p>
              <p className="text-xs leading-relaxed text-b4">
                {f.descricao}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onConcluir}
        disabled={isPending}
        className="flex w-full items-center justify-between rounded-xl px-5 py-3.5 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
        style={{
          backgroundColor: 'var(--color-bica)',
          color: 'var(--color-ink2)',
        }}
      >
        Entendido, vamos começar
        <Check className="size-4" />
      </button>
    </div>
  )
}
