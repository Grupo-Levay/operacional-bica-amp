import { CalendarCheck } from 'lucide-react'

export default function ReservasPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-6 text-center">
      <CalendarCheck
        size={48}
        strokeWidth={1.2}
        style={{ color: 'var(--color-b4)' }}
        aria-hidden="true"
      />
      <div>
        <h1
          className="font-display text-2xl mb-1"
          style={{ color: 'var(--color-b2)' }}
        >
          Reservas
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-b4)' }}>
          Módulo em desenvolvimento.
        </p>
      </div>
    </div>
  )
}
