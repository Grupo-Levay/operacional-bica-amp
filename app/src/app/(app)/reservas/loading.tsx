import { Skeleton } from "@/components/ui/skeleton"
import { PageHeader } from "@/components/shared/page-header"

export default function ReservasLoading() {
  return (
    <main className="p-4 space-y-4 pb-24">
      <PageHeader title="Reservas" />

      {/* Date nav */}
      <Skeleton className="h-12 rounded-xl" />

      {/* Contadores de status */}
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-lg" />
        ))}
      </div>

      {/* Lista de reservas */}
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    </main>
  )
}
