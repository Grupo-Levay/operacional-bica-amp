import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-5xl font-bold text-muted-foreground/30">404</p>
      <div>
        <p className="font-semibold text-sm">Página não encontrada</p>
        <p className="text-xs text-muted-foreground mt-1">
          O conteúdo que você procura não existe ou foi removido.
        </p>
      </div>
      <Link
        href="/dashboard"
        className="px-4 py-2 rounded-lg border text-sm hover:bg-muted transition-colors"
      >
        Voltar ao início
      </Link>
    </div>
  )
}
