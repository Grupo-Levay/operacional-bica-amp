import { Skeleton } from "@/components/ui/skeleton"
import { PageHeader } from "@/components/shared/page-header"

export default function EstoqueLoading() {
  return (
    <main className="p-4 space-y-6 pb-24">
      <PageHeader title="Estoque" />

      {[0, 1, 2].map((cat) => (
        <section key={cat} className="space-y-3">
          <Skeleton className="h-4 w-28" />
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 rounded-lg" />
            ))}
          </div>
        </section>
      ))}
    </main>
  )
}
