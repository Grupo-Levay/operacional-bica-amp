import { Skeleton } from "@/components/ui/skeleton"
import { PageHeader } from "@/components/shared/page-header"

export default function AdminLoading() {
  return (
    <main className="p-4 space-y-4">
      <PageHeader title="Usuários" subtitle="Gestão de usuários e roles" />

      {/* Tabela de usuários */}
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-lg" />
        ))}
      </div>
    </main>
  )
}
