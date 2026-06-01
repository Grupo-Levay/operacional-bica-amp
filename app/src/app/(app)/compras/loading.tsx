import { Skeleton } from "@/components/ui/skeleton"
import { PageHeader } from "@/components/shared/page-header"

export default function ComprasLoading() {
  return (
    <main className="p-4 space-y-6">
      <PageHeader title="Compras" />

      {/* Rodadas */}
      <section className="space-y-4">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-28 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>
      </section>

      {/* Catálogo */}
      <section className="space-y-4">
        <Skeleton className="h-5 w-36" />
        {[0, 1].map((cat) => (
          <div key={cat} className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-24 rounded-lg" />
          </div>
        ))}
      </section>
    </main>
  )
}
